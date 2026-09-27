

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface-soft py-10 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8">
          <div className="space-y-3">
            <div className="space-y-0.5">
              <p className="font-serif text-xs tracking-[0.2em] text-text-secondary uppercase">
                Frame
              </p>
              <p className="font-serif text-xs tracking-[0.2em] text-text-primary uppercase font-semibold">
                Protect
              </p>
            </div>
            <p className="font-sans text-xs text-text-secondary">
              Digital Watermarking Laboratory
            </p>
          </div>

          <div className="flex gap-8">
            <div className="space-y-2">
              <p className="font-mono text-[9px] uppercase tracking-widest text-text-secondary">
                Algorithm
              </p>
              {["DCT · 8×8 Blocks", "Secret Key", "Mid-Freq. Embedding"].map(
                (t) => (
                  <p key={t} className="font-mono text-[10px] text-text-secondary">
                    {t}
                  </p>
                )
              )}
            </div>
            <div className="space-y-2">
              <p className="font-mono text-[9px] uppercase tracking-widest text-text-secondary">
                Metrics
              </p>
              {["PSNR · Fidelity", "NC · Correlation", "BER · Accuracy"].map(
                (t) => (
                  <p key={t} className="font-mono text-[10px] text-text-secondary">
                    {t}
                  </p>
                )
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="font-mono text-[9px] text-text-secondary uppercase tracking-widest">
            Information Security Project — 2026
          </p>
          <p className="font-mono text-[9px] text-text-secondary uppercase tracking-widest">
            Local Processing · No Server Upload
          </p>
        </div>
      </div>
    </footer>
  );
}
