import re

with open("frontend/app/app/protect/page.tsx", "r") as f:
    code = f.read()

# Replace rendering logic
old_render = """                    <div className="bg-background p-4 border border-border space-y-1">
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                        Extracted Watermark
                      </span>
                      <div className="font-mono text-sm text-text-primary font-medium tracking-wide">
                        {metricsResult.recovered_text || "(empty)"}
                      </div>
                    </div>"""

new_render = """                    <div className="bg-background p-4 border border-border space-y-2">
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                        Extracted Watermark
                      </span>
                      {metricsResult.recovered_logo ? (
                        <div className="border border-border-strong bg-white inline-block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={metricsResult.recovered_logo} alt="Extracted Logo" className="h-16 w-auto object-contain" />
                        </div>
                      ) : (
                        <div className="font-mono text-sm text-text-primary font-medium tracking-wide">
                          {metricsResult.recovered_text || "(empty)"}
                        </div>
                      )}
                    </div>"""

code = code.replace(old_render, new_render)

with open("frontend/app/app/protect/page.tsx", "w") as f:
    f.write(code)
