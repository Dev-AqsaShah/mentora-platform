type SecurePlayerProps = {
  badge: string;
  live?: boolean;
  caption: string;
  watermark?: string;
  progressPct?: number;
  showWave?: boolean;
  downloadLabel?: string;
};

export default function SecurePlayer({
  badge,
  live = false,
  caption,
  watermark = "Ahmed Khan · ahmed@email.com · ID 4821",
  progressPct = 38,
  showWave = true,
  downloadLabel = "Download off",
}: SecurePlayerProps) {
  return (
    <div className="w-full max-w-[480px] rounded-[20px] border border-line-cool bg-surface p-3.5 shadow-[0_30px_70px_rgba(0,0,0,0.45)]">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-[linear-gradient(135deg,#0c2a33,#15414b)]">
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[rgba(10,24,32,0.7)] px-2.5 py-1 font-data text-[0.66rem] tracking-[0.08em] text-text">
          {live && <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" />}
          {badge}
        </span>
        <div className="watermark">{watermark}</div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-muted">
          <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full border border-amber bg-[rgba(240,162,75,0.16)] text-[1.4rem] text-amber-bright">
            ▶
          </div>
          <small className="font-data text-[0.68rem] tracking-[0.1em]">{caption}</small>
        </div>
      </div>
      <div className="flex items-center gap-3 px-1.5 pb-1 pt-3">
        {showWave && (
          <span className="flex h-[18px] items-end gap-[3px]">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="wave-bar w-[3px] rounded-sm bg-live"
                style={{ animationDelay: `${[0, 0.2, 0.4, 0.1, 0.3][i]}s` }}
              />
            ))}
          </span>
        )}
        <div className="relative h-[5px] flex-1 rounded-full bg-surface-2">
          <i
            className="absolute left-0 top-0 h-full rounded-full bg-amber"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="flex items-center gap-1 font-data text-[0.64rem] text-muted">
          ⤓ {downloadLabel}
        </span>
      </div>
    </div>
  );
}
