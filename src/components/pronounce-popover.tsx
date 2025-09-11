"use client";

import * as React from "react";
import * as RPopover from "@radix-ui/react-popover";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  text: string;                  // visible name
  speakText?: string;            // what TTS says (tune pronunciation here)
  lang?: string;                 // e.g. "en-IN", "en-US"
  hint?: string;                 // small helper line
  phonetic?: string;             // shown phonetic line
  rate?: number;                 // 0.85–1.00 sounds natural
  pitch?: number;                // 0.9–1.1 typical
  autoSpeakOnOpen?: boolean;     // speak once when opened
  className?: string;            // extra classes for trigger button
};

/** Pick a decent voice given a language preference */
function pickVoice(voices: SpeechSynthesisVoice[], langPref?: string) {
  if (!voices.length) return undefined;
  if (langPref) {
    const exact = voices.find(v => v.lang?.toLowerCase() === langPref.toLowerCase());
    if (exact) return exact;
    const base = langPref.split("-")[0].toLowerCase();
    const starts = voices.find(v => v.lang?.toLowerCase().startsWith(base));
    if (starts) return starts;
  }
  return (
    voices.find(v => /en-IN/i.test(v.lang)) ||
    voices.find(v => /en-GB/i.test(v.lang)) ||
    voices.find(v => /en-US/i.test(v.lang)) ||
    voices[0]
  );
}

export default function PronouncePopover({
  text,
  speakText,
  lang = "en-IN",
  hint = "Tap play to hear it",
  phonetic = "Parth (like “earth” with P) • Kulkarni (kul-KAR-nee)",
  rate = 0.92,
  pitch = 1.02,
  autoSpeakOnOpen = true,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [speaking, setSpeaking] = React.useState(false);
  const [loadingVoices, setLoadingVoices] = React.useState(true);
  const [voice, setVoice] = React.useState<SpeechSynthesisVoice | undefined>(undefined);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices
  React.useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const list = synth.getVoices();
      if (list.length) {
        setVoice(pickVoice(list, lang));
        setLoadingVoices(false);
      }
    };

    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);
    return () => synth.removeEventListener("voiceschanged", loadVoices);
  }, [lang]);

  const cancelSpeech = React.useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
    } catch {}
    setSpeaking(false);
    utteranceRef.current = null;
  }, []);

  const speak = React.useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    cancelSpeech();

    const say = (speakText && speakText.trim()) || text;
    const u = new SpeechSynthesisUtterance(say);
    if (voice) u.voice = voice;
    u.lang = voice?.lang || lang;
    u.pitch = pitch;
    u.rate = rate;
    u.volume = 1;

    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);

    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
  }, [cancelSpeech, voice, lang, pitch, rate, speakText, text]);

  React.useEffect(() => {
    if (!open || !autoSpeakOnOpen) return;
    const t = setTimeout(() => speak(), 120);
    return () => clearTimeout(t);
  }, [open, autoSpeakOnOpen, speak]);

  React.useEffect(() => {
    if (!open) cancelSpeech();
    return () => cancelSpeech();
  }, [open, cancelSpeech]);

  const supportsSpeech = typeof window !== "undefined" && "speechSynthesis" in window;

  return (
    <RPopover.Root open={open} onOpenChange={setOpen}>
      {/* Trigger — matches ThemeToggle’s icon button look */}
      <RPopover.Trigger asChild>
        <button
          type="button"
          aria-label="Pronounce name"
          className={[
            "inline-flex h-9 w-9 items-center justify-center rounded-xl border",
            "text-muted-foreground hover:text-foreground hover:bg-accent",
            "transition-colors",
            className || "",
          ].join(" ")}
        >
          {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </RPopover.Trigger>

      <RPopover.Content
        align="start"
        side="bottom"
        sideOffset={8}
        className="z-50 w-[260px] rounded-xl border bg-popover p-3 text-popover-foreground shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-foreground">{text}</div>
            <span className="text-[11px] text-muted-foreground">{lang}</span>
          </div>

          <div className="rounded-lg border bg-card/60 px-3 py-2">
            <p className="text-xs text-foreground">{phonetic}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-[11px] text-muted-foreground">
              {supportsSpeech ? (loadingVoices ? "Loading voice…" : voice?.name || "Default voice") : "TTS not supported"}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!supportsSpeech || loadingVoices}
                onClick={speaking ? cancelSpeech : speak}
                className="h-8 rounded-lg"
              >
                {loadingVoices ? (
                  <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                ) : speaking ? (
                  <VolumeX className="mr-1 h-3.5 w-3.5" />
                ) : (
                  <Volume2 className="mr-1 h-3.5 w-3.5" />
                )}
                {speaking ? "Stop" : "Play"}
              </Button>
            </div>
          </div>
        </div>

        <RPopover.Arrow className="fill-popover" />
      </RPopover.Content>
    </RPopover.Root>
  );
}
