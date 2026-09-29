
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
              Laboratorium watermark digital.<br />
              Lindungi citra. Buktikan keaslian.
            </p>
          </div>

          {/* Algorithm */}
          <div className="space-y-2">
            <p className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary mb-3">
              Algoritma
            </p>
            {["DCT · Frekuensi Blok 8×8", "Penyisipan Koefisien Menengah", "Derivasi Kunci SHA-256"].map((t) => (
              <p key={t} className="font-mono text-[10px] text-text-secondary">{t}</p>
            ))}
          </div>

          {/* Metrics */}
          <div className="space-y-2">
            <p className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary mb-3">
              Metrik Kualitas
            </p>
            {["PSNR · Kualitas Citra", "NC · Korelasi Ternormalisasi", "BER · Rasio Kesalahan Bit"].map((t) => (
              <p key={t} className="font-mono text-[10px] text-text-secondary">{t}</p>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="font-mono text-[9px] text-text-tertiary uppercase tracking-widest">
            Proyek Keamanan Informasi — 2026
          </p>
          <p className="font-mono text-[9px] text-text-tertiary uppercase tracking-widest">
            Semua pemrosesan lokal · Tidak ada data yang dikirim ke luar
          </p>
        </div>
      </div>
    </footer>
  );
}
