import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <p className="font-serif text-sm tracking-[0.15em] text-text-primary uppercase font-semibold">
              Frame Protect
            </p>
            <p className="font-mono text-[10px] text-text-tertiary leading-relaxed">
              Digital watermarking laboratory.<br />
              Protect the image. Prove the origin.
            </p>
          </div>

          {/* Algorithm */}
          <div className="space-y-2">
            <p className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary mb-3">
              Algorithm
            </p>
            {["DCT · 8×8 Block Frequency", "Mid-Coefficient Embedding", "SHA-256 Key Derivation"].map((t) => (
              <p key={t} className="font-mono text-[10px] text-text-secondary">{t}</p>
            ))}
          </div>

          {/* Metrics */}
          <div className="space-y-2">
            <p className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary mb-3">
              Quality Metrics
            </p>
            {["PSNR · Peak Signal-to-Noise", "NC · Normalized Correlation", "BER · Bit Error Rate"].map((t) => (
              <p key={t} className="font-mono text-[10px] text-text-secondary">{t}</p>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="font-mono text-[9px] text-text-tertiary uppercase tracking-widest">
            Information Security Project — 2026
          </p>
          <p className="font-mono text-[9px] text-text-tertiary uppercase tracking-widest">
            All processing is local · No data transmitted
          </p>
        </div>
      </div>
    </footer>
  );
}
