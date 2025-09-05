"use client";
import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setStatus("Sending...");
    try {
      const res = await fetch("/api/contact", { method: "POST", body: formData });
      const json = await res.json();
      setStatus(json.ok ? "Thanks! I’ll get back to you soon." : json.error || "Something went wrong");
    } catch {
      setStatus("Something went wrong");
    }
  }

  return (
    <form action={onSubmit} className="space-y-3">
      <input name="name" required placeholder="Name" className="w-full rounded-xl border px-3 py-2" />
      <input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border px-3 py-2" />
      <textarea name="message" required placeholder="Message" className="w-full rounded-xl border px-3 py-2 h-32" />
      <button className="rounded-xl border px-4 py-2 text-sm hover:bg-accent">Send</button>
      {status && <p className="text-sm text-muted-foreground">{status}</p>}
    </form>
  );
}
