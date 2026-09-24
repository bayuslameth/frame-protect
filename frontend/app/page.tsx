import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WorkflowStepper } from "@/components/workflow/workflow-stepper";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center border-b border-border overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCBMIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNDUsMjQ0LDI0MCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] pointer-events-none" />
        
        {/* Editorial composition block */}
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 py-12">
          
          {/* Left: Typography */}
          <div className="flex-1 space-y-8 z-10">
            <div className="space-y-4">
               <div className="flex items-center space-x-3">
                 <span className="h-px w-8 bg-text-secondary" />
                 <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">System Ready</span>
               </div>
               <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif text-text-primary uppercase leading-[0.95] tracking-tight">
                 Protect<br />
                 <span className="text-text-secondary italic">the image.</span><br />
                 Prove<br />
                 <span className="text-text-secondary italic">the origin.</span>
               </h1>
            </div>
            
            <p className="max-w-md text-sm font-sans text-text-tertiary leading-relaxed">
              Digital watermarking for photographers, creators, and visual evidence. Embed imperceptible cryptographic signatures directly into the image frequencies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/app/protect">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">Protect an Image</Button>
              </Link>
              <Link href="/app/attack-lab">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">Explore the Lab</Button>
              </Link>
            </div>
          </div>

          {/* Right: Abstract Contact Sheet/Image Placeholder */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative aspect-[4/5] bg-surface border border-border p-4 flex flex-col justify-between">
            {/* Crop marks */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-text-tertiary" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-text-tertiary" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-text-tertiary" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-text-tertiary" />
            
            <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
              <span>Frame / 001</span>
              <span>Source / Original</span>
            </div>
            
            <div className="flex-1 my-4 border border-border relative overflow-hidden bg-background">
               <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDUwNTA1Ii8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMyNTI1MjUiLz4KPC9zdmc+')] mix-blend-overlay" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-px h-16 bg-border" />
                 <div className="absolute h-px w-16 bg-border" />
               </div>
            </div>

            <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest text-text-tertiary">
              <span>Mode / DCT</span>
              <span className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                <span>Status / Ready</span>
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="space-y-4">
            <h2 className="font-serif text-3xl text-text-primary uppercase tracking-wide">The Process</h2>
            <p className="text-sm font-sans text-text-tertiary max-w-lg">From ingestion to verification, a strictly controlled cryptographic workflow.</p>
          </div>
          <WorkflowStepper />
        </div>
      </section>

      {/* CAPABILITIES SECTION */}
      <section className="py-24 border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="space-y-4">
            <h2 className="font-serif text-3xl text-text-primary uppercase tracking-wide">Core Capabilities</h2>
            <p className="text-sm font-sans text-text-tertiary max-w-lg">Advanced frequency-domain watermarking meets rigorous stress testing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
            {[
              { title: "Digital Watermarking", desc: "Embed a hidden signal into an image using frequency-domain (DCT) processing." },
              { title: "Robustness Testing", desc: "Test whether the watermark survives common image transformations and attacks." },
              { title: "Image Fidelity", desc: "Measure visual quality and imperceptibility using Peak Signal-to-Noise Ratio (PSNR)." },
              { title: "Recovery Analysis", desc: "Measure watermark similarity using Normalized Correlation (NC) and Bit Error Rate (BER)." }
            ].map((cap, i) => (
              <div key={i} className="bg-background p-8 space-y-4 group hover:bg-surface-hover transition-colors">
                <span className="font-mono text-[10px] text-text-tertiary tracking-widest">0{i+1}</span>
                <h3 className="font-sans text-sm uppercase tracking-widest text-text-secondary group-hover:text-text-primary transition-colors">{cap.title}</h3>
                <p className="font-sans text-xs text-text-tertiary leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DARKROOM / CONTACT SHEET PREVIEW */}
      <section className="py-24 border-b border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-6">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl text-text-primary uppercase tracking-wide">Attack Lab Previews</h2>
              <p className="text-sm font-sans text-text-tertiary max-w-lg">Visualize resilience across a spectrum of signal distortions.</p>
            </div>
            <Link href="/app/attack-lab">
              <Button variant="outline" size="sm">Enter Laboratory</Button>
            </Link>
          </div>

          <div className="flex space-x-6 overflow-x-auto pb-8 no-scrollbar snap-x">
            {["Original", "Watermarked", "JPEG 90", "JPEG 70", "Crop", "Resize"].map((label, i) => (
              <div key={i} className="shrink-0 w-72 sm:w-80 snap-center">
                <div className="border border-border bg-surface p-3 space-y-3">
                  <div className="aspect-[3/2] bg-background border border-border relative flex items-center justify-center">
                    <span className="font-mono text-[9px] text-text-tertiary uppercase tracking-widest">[ Preview Frame ]</span>
                  </div>
                  <div className="flex justify-between items-center font-mono text-[9px] uppercase tracking-widest text-text-secondary">
                    <span>{label}</span>
                    <span>#{i+1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY + PHOTOGRAPHY POSITIONING */}
      <section className="py-32 bg-deep-black">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
           <h2 className="font-serif text-4xl sm:text-5xl text-text-primary uppercase leading-tight">
             Built for images <br/><span className="text-text-secondary italic">that carry meaning.</span>
           </h2>
           <p className="font-sans text-sm sm:text-base text-text-tertiary max-w-2xl mx-auto leading-relaxed">
             A rigorous technical intersection of photography, ownership, provenance, and integrity. We do not claim unbreakable security—we provide verifiable, cryptographic resilience and transparent technical validation.
           </p>
           <div className="pt-8">
             <Link href="/app">
               <Button variant="primary" size="lg">Access Workspace</Button>
             </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
