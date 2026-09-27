"use client";

import React, { useState } from "react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";
import { WorkflowStepper } from "@/components/workflow/workflow-stepper";
import { ContactSheetPreview } from "@/components/preview/contact-sheet-preview";
import { Button } from "@/components/ui/button";
import { useWorkflowState } from "@/hooks/use-workflow-state";
import { testAttack, AttackTestResponse } from "@/services/api/attack.service";

const ATTACK_OPTIONS = {
  jpeg: { name: "JPEG Compression", params: [90, 70, 50], suffix: "Q" },
  crop: { name: "Crop", params: [10, 25], suffix: "%" },
  resize: { name: "Resize", params: [75, 50], suffix: "%" },
  gaussian_noise: { name: "Gaussian Noise", params: [5, 10, 20], suffix: "σ" },
  brightness: { name: "Brightness", params: [-30, 30], suffix: "" },
  contrast: { name: "Contrast", params: [0.7, 1.0, 1.3], suffix: "" },
};

type AttackType = keyof typeof ATTACK_OPTIONS;

interface AttackHistoryEntry extends AttackTestResponse {
  timestamp: string;
}

export default function AttackLabPage() {
  const { baselineContext, addExperimentResult, refreshSession } = useWorkflowState();
  
  const [selectedAttack, setSelectedAttack] = useState<AttackType>("jpeg");
  const [selectedParam, setSelectedParam] = useState<number>(70);
  
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackError, setAttackError] = useState<string | null>(null);
  
  const [history, setHistory] = useState<AttackHistoryEntry[]>([]);
  const currentResult = history.length > 0 ? history[0] : null;

  const handleAttackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const atk = e.target.value as AttackType;
    setSelectedAttack(atk);
    setSelectedParam(ATTACK_OPTIONS[atk].params[0]);
  };

  const handleRunAttack = async () => {
    if (!baselineContext) {
      setAttackError("No baseline context. Please protect an image first.");
      return;
    }
    setAttackError(null);
    setIsAttacking(true);

    try {
      const attackStart = Date.now();
      const res = await testAttack({
        watermarked_image: baselineContext.watermarkedImage,
        original_watermark_text: baselineContext.watermarkText,
        secret_key: baselineContext.secretKey,
        attack_type: selectedAttack,
        parameter: selectedParam,
      });
      const duration = Date.now() - attackStart;

      setHistory((prev) => [{ ...res, timestamp: new Date().toISOString() }, ...prev]);

      // Persist to session store
      addExperimentResult({
        watermarkType: "text",
        watermarkPayloadDescription: baselineContext.watermarkText,
        imageWidth: res.original_dimensions.width,
        imageHeight: res.original_dimensions.height,
        attackType: selectedAttack as import("@/lib/types/experiment").ExperimentAttackType,
        attackParameter: selectedParam,
        attackedWidth: res.attacked_dimensions.width,
        attackedHeight: res.attacked_dimensions.height,
        extractionStatus: res.extraction_status,
        extractedWatermark: res.extracted_watermark,
        psnr: res.psnr === -1 ? null : res.psnr,
        nc: res.nc,
        ber: res.ber,
        error: null,
        duration,
      });
      refreshSession();
    } catch (err: unknown) {
      setAttackError(err instanceof Error ? err.message : "Failed to run attack");
    } finally {
      setIsAttacking(false);
    }
  };

  const handleDownload = () => {
    if (!currentResult?.attacked_image) return;
    try {
      const parts = currentResult.attacked_image.split(";base64,");
      const contentType = parts[0].split(":")[1] || "image/png";
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      const blob = new Blob([uInt8Array], { type: contentType });
      const blobUrl = URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      const ext = contentType.split("/")[1] || "png";
      downloadLink.download = `frame-protect-attack-${currentResult.attack_type}-${currentResult.parameter}.${ext}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (e) {
      console.error("Download failed:", e);
    }
  };

  if (!baselineContext) {
    return (
      <PlaceholderPage
        pageName="Image Attack Laboratory"
        description="Subject frames to signal distortions to evaluate watermark survival."
        routePath="/app/attack-lab"
      >
        <div className="text-center py-24 space-y-4">
          <p className="font-mono text-sm text-text-secondary">No active baseline.</p>
          <p className="font-sans text-sm text-text-secondary">Please return to the Protect page and process an image first.</p>
        </div>
      </PlaceholderPage>
    );
  }

  return (
    <PlaceholderPage
      pageName="Image Attack Laboratory"
      description="Subject frames to signal distortions to evaluate watermark survival."
      routePath="/app/attack-lab"
    >
      <div className="space-y-12">
        <WorkflowStepper currentStepId="attack" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-8">
            <div className="border border-border bg-surface p-6 space-y-6">
              <div className="flex items-end justify-between border-b border-border pb-4">
                <div className="space-y-1">
                  <h4 className="font-sans text-sm uppercase tracking-widest text-text-primary">
                    Attack Configuration
                  </h4>
                  <p className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">
                    Configure distortion parameters
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">
                    Attack Type
                  </label>
                  <select
                    className="w-full bg-background border border-border text-sm p-3 focus:outline-none focus:border-text-primary font-mono"
                    value={selectedAttack}
                    onChange={handleAttackChange}
                  >
                    {Object.entries(ATTACK_OPTIONS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">
                    Parameter
                  </label>
                  <select
                    className="w-full bg-background border border-border text-sm p-3 focus:outline-none focus:border-text-primary font-mono"
                    value={selectedParam}
                    onChange={(e) => setSelectedParam(Number(e.target.value))}
                  >
                    {ATTACK_OPTIONS[selectedAttack].params.map((p) => (
                      <option key={p} value={p}>
                        {ATTACK_OPTIONS[selectedAttack].suffix === "Q" ? `Q${p}` : 
                         ATTACK_OPTIONS[selectedAttack].suffix === "σ" ? `σ${p}` : 
                         ATTACK_OPTIONS[selectedAttack].suffix === "%" ? `${p}%` : p}
                      </option>
                    ))}
                  </select>
                </div>

                {attackError && (
                  <div className="p-3 border border-error bg-[#9e5b5b]/10 text-error text-[10px] font-mono tracking-widest uppercase">
                    ERROR: {attackError}
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full font-mono text-xs tracking-widest uppercase"
                  disabled={isAttacking}
                  onClick={handleRunAttack}
                >
                  {isAttacking ? "PROCESSING..." : "RUN ATTACK"}
                </Button>
              </div>
            </div>

            {/* Results Block */}
            {currentResult && (
              <div className="space-y-6">
                <div className="border border-border bg-surface p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-primary">
                      Attacked Image
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">Attack</span>
                      <span className="block font-mono text-[11px] text-text-primary">{ATTACK_OPTIONS[currentResult.attack_type as AttackType]?.name || currentResult.attack_type}</span>
                    </div>
                    <div>
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">Parameter</span>
                      <span className="block font-mono text-[11px] text-text-primary">{currentResult.parameter}</span>
                    </div>
                    <div>
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">Dimensions</span>
                      <span className="block font-mono text-[11px] text-text-primary">{currentResult.attacked_dimensions.width} × {currentResult.attacked_dimensions.height}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-border bg-surface p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-primary">
                      Extraction
                    </h4>
                  </div>
                  <div className="bg-background p-4 border border-border space-y-1">
                    <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">Status</span>
                    <span className={`block font-mono text-xs font-bold ${currentResult.extraction_status === "DETECTED" ? "text-success" : "text-error"}`}>
                      {currentResult.extraction_status}
                    </span>
                  </div>
                  <div className="bg-background p-4 border border-border space-y-1">
                    <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">Extracted Watermark</span>
                    <div className="font-mono text-sm text-text-primary font-medium tracking-wide">
                      {currentResult.extracted_watermark || "(empty)"}
                    </div>
                  </div>
                </div>

                <div className="border border-border bg-surface p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-primary">
                      Metrics vs Baseline
                    </h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-background p-3 border border-border">
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">PSNR</span>
                      <span className="block font-mono text-sm text-black font-extrabold">
                        {currentResult.psnr === null ? "N/A" : currentResult.psnr === -1.0 ? "∞" : `${currentResult.psnr.toFixed(2)} dB`}
                      </span>
                    </div>
                    <div className="bg-background p-3 border border-border">
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">NC</span>
                      <span className="block font-mono text-sm text-black font-extrabold">
                        {currentResult.nc === null ? "N/A" : currentResult.nc.toFixed(4)}
                      </span>
                    </div>
                    <div className="bg-background p-3 border border-border">
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">BER</span>
                      <span className="block font-mono text-sm text-black font-extrabold">
                        {currentResult.ber === null ? "N/A" : currentResult.ber.toFixed(6)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full font-mono text-[10px] tracking-widest uppercase shadow-md"
                  onClick={handleDownload}
                >
                  DOWNLOAD ATTACKED IMAGE
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="sticky top-24 space-y-4">
              <ContactSheetPreview
                leftTitle="Watermarked Baseline"
                rightTitle="Attacked Output"
                leftImage={{ file: baselineContext.watermarkedImage, previewUrl: baselineContext.watermarkedImageUrl, metadata: {} as any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }}
                rightImage={
                  currentResult
                    ? { file: new File([], "attacked.png"), previewUrl: currentResult.attacked_image, metadata: {} as any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }
                    : null
                }
              />
            </div>
            
            {/* History Table */}
            <div className="border border-border bg-surface p-6 space-y-4 mt-8">
              <h4 className="font-sans text-sm uppercase tracking-widest text-text-primary border-b border-border pb-3">
                Attack History
              </h4>
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">NO ATTACKS RUN</p>
                  <p className="font-sans text-xs text-text-secondary mt-2">Run an attack to begin robustness analysis.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-2 pr-4 font-mono text-[8px] uppercase tracking-widest text-text-secondary font-normal">Attack</th>
                        <th className="py-2 pr-4 font-mono text-[8px] uppercase tracking-widest text-text-secondary font-normal">Param</th>
                        <th className="py-2 pr-4 font-mono text-[8px] uppercase tracking-widest text-text-secondary font-normal">Dims</th>
                        <th className="py-2 pr-4 font-mono text-[8px] uppercase tracking-widest text-text-secondary font-normal">Extract</th>
                        <th className="py-2 pr-4 font-mono text-[8px] uppercase tracking-widest text-text-secondary font-normal">PSNR</th>
                        <th className="py-2 pr-4 font-mono text-[8px] uppercase tracking-widest text-text-secondary font-normal">NC</th>
                        <th className="py-2 pr-4 font-mono text-[8px] uppercase tracking-widest text-text-secondary font-normal">BER</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-[10px] text-text-primary">
                      {history.map((h, i) => (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-surface-hover">
                          <td className="py-2 pr-4">{ATTACK_OPTIONS[h.attack_type as AttackType]?.name || h.attack_type}</td>
                          <td className="py-2 pr-4">{h.parameter}</td>
                          <td className="py-2 pr-4">{h.attacked_dimensions.width}×{h.attacked_dimensions.height}</td>
                          <td className={`py-2 pr-4 ${h.extraction_status === "DETECTED" ? "text-success" : "text-error"}`}>{h.extraction_status}</td>
                          <td className="py-2 pr-4">{h.psnr === null ? "N/A" : h.psnr === -1.0 ? "∞" : h.psnr.toFixed(2)}</td>
                          <td className="py-2 pr-4">{h.nc === null ? "N/A" : h.nc.toFixed(4)}</td>
                          <td className="py-2 pr-4">{h.ber === null ? "N/A" : h.ber.toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PlaceholderPage>
  );
}
