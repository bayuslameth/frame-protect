import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const steps = [
    {
      n: "01",
      title: "Protect",
      desc: "Upload a source image. Configure watermark payload, secret key, and DCT parameters. The signal is injected into mid-frequency coefficients of 8×8 blocks.",
    },
    {
      n: "02",
      title: "Attack",
      desc: "Subject the watermarked image to JPEG compression, cropping, noise, brightness, and contrast attacks. Test the resilience of the embedded signal under realistic conditions.",
    },
    {
      n: "03",
      title: "Detect",
      desc: "Provide the candidate image and secret key. Recover the embedded watermark bitstream without access to the original image. Blind extraction only.",
    },
    {
      n: "04",
      title: "Analyze",
      desc: "Evaluate fidelity (PSNR) and watermark integrity (NC, BER) across all attack conditions. The results quantify the robustness of the embedding.",
    },
  ];

  const capabilities = [
    {
      code: "DCT",
      name: "Frequency-Domain Embedding",
      desc: "Watermark bits are encoded into the relationship between mid-frequency DCT coefficients — imperceptible yet recoverable.",
    },
    {
      code: "KEY",
      name: "Secret Key Selection",
      desc: "SHA-256 key derivation drives a PRNG that selects which image blocks carry the watermark. Without the key, extraction yields noise.",
    },
    {
      code: "PSNR",
      name: "Fidelity Measurement",
      desc: "Peak Signal-to-Noise Ratio measures the visual imperceptibility of the watermark — typically above 35 dB for strong embedding.",
    },
    {
      code: "NC",
      name: "Normalized Correlation",
      desc: "Measures structural similarity between original and extracted watermark. NC = 1.0000 indicates perfect bit recovery.",
    },
    {
      code: "BER",
      name: "Bit Error Rate",
      desc: "Proportion of incorrectly recovered watermark bits. BER = 0.000000 means the watermark survived without error.",
    },
    {
      code: "BLIND",
      name: "Blind Extraction",
      desc: "Watermark is extracted using only the secret key and candidate image. No original image required at detection time.",
    },
  ];

  return (
    <div className="w-full">

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[88vh] items-center gap-12 lg:gap-0 py-16 lg:py-0">

            {/* Left — editorial headline */}
            <div className="lg:col-span-5 space-y-8 lg:pr-16 lg:border-r lg:border-border">
              <div className="space-y-2">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#444444] mb-6">
                  Digital Watermarking Laboratory
                </p>
                <h1 className="font-serif leading-[0.95] tracking-tight text-[#000000]"
                    style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)", fontWeight: 900 }}>
                  Protect<br />
                  <span className="text-[#222222]">the image.</span><br />
                  Prove<br />
                  <span className="text-[#222222]">the origin.</span>
                </h1>
              </div>

              <p className="text-sm font-sans text-[#333333] leading-relaxed max-w-sm font-medium">
                Embed imperceptible cryptographic signatures into photographs
                using discrete cosine transform frequency-domain encoding.
                Verify authenticity. Measure resilience.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/app/protect">
                  <Button variant="primary" size="lg">Protect an Image</Button>
                </Link>
                <Link href="/app/attack-lab">
                  <Button variant="outline" size="lg">Attack Lab</Button>
                </Link>
              </div>

              {/* Technical spec strip */}
              <div className="pt-6 border-t border-border grid grid-cols-3 gap-4">
                {[
                  ["Mode", "DCT · 8×8"],
                  ["Band", "Mid-Freq."],
                  ["Key", "SHA-256"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <span className="block font-mono text-[8px] font-bold uppercase tracking-widest text-[#444444]">{k}</span>
                    <span className="block font-mono text-[11px] font-bold text-[#000000] mt-0.5">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — photographic frame composition */}
            <div className="lg:col-span-7 lg:pl-16 w-full">
              <div className="relative border border-[#000000] bg-white p-4 sm:p-6">
                {/* Corner crop marks */}
                {["top-0 left-0 border-t-2 border-l-2", "top-0 right-0 border-t-2 border-r-2",
                  "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map((cls) => (
                  <div key={cls} className={`absolute w-5 h-5 border-[#000000] ${cls}`} />
                ))}

                {/* Metadata bar */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#000000]">Frame / 001</span>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#444444]">Ready</span>
                  </div>
                </div>

                {/* Main image placeholder */}
                <div className="aspect-[4/3] bg-[#F0F0EC] border border-[#BDBDB7] img-grid-bg relative overflow-hidden flex items-center justify-center">
                  {/* Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border border-[#BDBDB7]" />
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-[#BDBDB7]" />
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#BDBDB7]" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                    <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-[#444444]">Source Image</span>
                    <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-[#444444]">Awaiting Upload</span>
                  </div>
                </div>

                {/* Contact sheet — 3 comparison frames */}
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { label: "Original", tag: "#A" },
                    { label: "Watermarked", tag: "#B" },
                    { label: "Δ Difference", tag: "#C" },
                  ].map(({ label, tag }) => (
                    <div key={tag} className="border border-[#BDBDB7] bg-white">
                      <div className="aspect-square img-grid-bg flex items-center justify-center">
                        <span className="font-mono text-[7px] font-bold text-[#444444]">{tag}</span>
                      </div>
                      <div className="px-2 py-1 border-t border-[#BDBDB7]">
                        <span className="font-mono text-[7px] font-bold uppercase tracking-widest text-[#222222]">{label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Metric preview strip */}
                <div className="flex justify-between mt-4 pt-3 border-t border-[#BDBDB7]">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#444444]">PSNR — dB</span>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#444444]">NC — · BER —</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PROCESS — 01 02 03 04
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Sticky label */}
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-24 space-y-4">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#444444]">Process</p>
                <h2 className="font-serif text-[#000000] leading-tight" style={{ fontSize: "2.25rem", fontWeight: 800 }}>
                  The<br />Workflow
                </h2>
                <p className="text-sm text-[#333333] font-sans leading-relaxed font-medium">
                  A four-stage laboratory workflow for embedding, stress-testing, and verifying digital watermarks.
                </p>
                <div className="pt-4">
                  <Link href="/app/protect">
                    <Button variant="outline" size="sm">Begin Workflow</Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Steps grid */}
            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-[#BDBDB7]">
                {steps.map((step) => (
                  <div
                    key={step.n}
                    className="bg-background p-8 space-y-4 hover:bg-surface-soft transition-colors duration-150"
                  >
                    <span className="font-serif text-5xl text-[#BDBDB7] leading-none font-black">{step.n}</span>
                    <div className="pt-3 border-t border-[#BDBDB7]">
                      <h3 className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#000000]">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm font-sans text-[#333333] leading-relaxed font-medium">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CONTEXT — Photography carries provenance
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Text column */}
            <div className="space-y-6">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#444444]">Context</p>
              <h2 className="font-serif text-[#000000] leading-tight" style={{ fontSize: "2.5rem", fontWeight: 800 }}>
                Images carry<br />provenance.
              </h2>
              <div className="space-y-4 text-sm font-sans text-[#333333] leading-relaxed font-medium">
                <p>
                  Every photograph has an origin. Frequency-domain watermarking provides a technical mechanism to assert that provenance in a mathematically verifiable way — without visibly altering the image.
                </p>
                <p>
                  Unlike metadata, which can be stripped, watermarks embedded in the DCT domain survive many common transformations: JPEG recompression, resizing, brightness and contrast adjustment.
                </p>
                <p>
                  Frame Protect does not claim perfect security. It provides technical evidence — a way to measure, test, and quantify watermark integrity under controlled and realistic conditions.
                </p>
              </div>

              <div className="pt-5 grid grid-cols-2 gap-5 border-t border-[#BDBDB7]">
                {[
                  ["Embedding Domain", "Frequency (DCT)"],
                  ["Block Size",       "8 × 8 px"],
                  ["Extraction",       "Blind — no original"],
                  ["Key Derivation",   "SHA-256 HMAC"],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <span className="block font-mono text-[8px] font-bold uppercase tracking-widest text-[#444444]">{label}</span>
                    <span className="block font-mono text-[11px] font-bold text-[#000000] mt-0.5">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signal chain diagram */}
            <div className="space-y-0">
              {[
                { label: "Original Image",             sub: "Unmodified source frame" },
                { label: "DCT Transform",              sub: "8×8 block frequency decomposition" },
                { label: "Coefficient Modification",   sub: "Mid-freq. pair embedding" },
                { label: "Watermarked Image",          sub: "Visually imperceptible Δ" },
              ].map(({ label, sub }, i) => (
                <div key={label} className="flex items-center gap-4 py-4 border-b border-[#BDBDB7] last:border-0">
                  <div className="shrink-0 w-9 h-9 border border-[#BDBDB7] flex items-center justify-center bg-white">
                    <span className="font-mono text-[10px] font-bold text-[#444444]">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-sans text-[11px] font-bold text-[#000000] uppercase tracking-wide">{label}</p>
                    <p className="font-mono text-[9px] text-[#444444] tracking-wider mt-0.5 font-semibold">{sub}</p>
                  </div>
                  {i < 3 && <span className="shrink-0 font-mono text-[10px] font-bold text-[#BDBDB7]">↓</span>}
                </div>
              ))}

              <div className="mt-5 p-4 border border-[#BDBDB7] bg-[#F0F0EC]">
                <p className="font-mono text-[8px] font-bold uppercase tracking-widest text-[#444444] mb-2">Signal Comparison</p>
                <div className="grid grid-cols-2 gap-px bg-[#BDBDB7]">
                  {["Original DCT", "Modified DCT"].map((lbl) => (
                    <div key={lbl} className="bg-white p-3 aspect-[3/2] img-grid-bg flex items-end">
                      <span className="font-mono text-[7px] font-bold text-[#444444] uppercase">{lbl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CAPABILITIES — 6-cell grid
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-3">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#444444]">Technical Foundation</p>
              <h2 className="font-serif text-[#000000] leading-tight" style={{ fontSize: "2.25rem", fontWeight: 800 }}>
                Core Capabilities
              </h2>
              <p className="text-sm font-sans text-[#333333] leading-relaxed font-medium">
                A transparent implementation of classical digital watermarking with measurable quality metrics.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#BDBDB7] border border-[#BDBDB7]">
            {capabilities.map((c) => (
              <div
                key={c.code}
                className="bg-background p-8 space-y-4 hover:bg-white transition-colors duration-150"
              >
                <span className="font-mono text-xs font-black text-[#000000] tracking-widest">{c.code}</span>
                <div className="pt-3 border-t border-[#BDBDB7]">
                  <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#000000]">
                    {c.name}
                  </h3>
                  <p className="mt-2 text-xs font-sans text-[#444444] leading-relaxed font-medium">
                    {c.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-2 border-[#000000] p-12 sm:p-16 text-center space-y-8 relative">
            {/* Corner marks */}
            {["top-[-1px] left-[-1px] border-t-4 border-l-4",
              "top-[-1px] right-[-1px] border-t-4 border-r-4",
              "bottom-[-1px] left-[-1px] border-b-4 border-l-4",
              "bottom-[-1px] right-[-1px] border-b-4 border-r-4"].map((cls) => (
              <div key={cls} className={`absolute w-6 h-6 border-[#000000] ${cls}`} />
            ))}

            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#444444]">
              Begin
            </p>
            <h2 className="font-serif text-[#000000] leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900 }}>
              Built for images<br />
              <span className="text-[#333333]">that carry meaning.</span>
            </h2>
            <p className="text-sm font-sans text-[#333333] leading-relaxed max-w-xl mx-auto font-medium">
              A rigorous technical intersection of photography, ownership, and integrity verification.
              All processing runs locally. No images are uploaded to external servers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/app/protect">
                <Button variant="primary" size="lg">Start Protecting</Button>
              </Link>
              <Link href="/app/detect">
                <Button variant="outline" size="lg">Detect Watermark</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
