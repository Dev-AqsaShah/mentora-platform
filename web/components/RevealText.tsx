"use client";

import { useEffect, useRef, useState } from "react";

export default function RevealText({ text, keyWords }: { text: string; keyWords: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [litCount, setLitCount] = useState<number | null>(null);

  const tokens = text.split(/(\s+)/).filter((t) => t.length > 0);
  const words = tokens.filter((t) => t.trim().length > 0);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLitCount(words.length);
      return;
    }
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = innerHeight;
      let p = (vh * 0.82 - r.top) / (vh * 0.55);
      p = Math.max(0, Math.min(1, p));
      setLitCount(Math.round(p * words.length));
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, [words.length]);

  let wordIndex = -1;
  return (
    <p
      ref={ref}
      className="font-display font-medium text-[clamp(1.7rem,4vw,2.8rem)] leading-[1.3] max-w-[880px]"
    >
      {tokens.map((tok, i) => {
        if (!tok.trim()) return <span key={i}>{tok}</span>;
        wordIndex++;
        const lit = litCount === null ? true : wordIndex < litCount;
        const isKey = keyWords.includes(tok.replace(/[^\w]/g, ""));
        return (
          <span
            key={i}
            className={`transition-colors duration-[450ms] ease-out ${
              lit ? (isKey ? "text-amber-bright" : "text-text") : "text-[rgba(143,166,174,0.3)]"
            }`}
          >
            {tok}
          </span>
        );
      })}
    </p>
  );
}
