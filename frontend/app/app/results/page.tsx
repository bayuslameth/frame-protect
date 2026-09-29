"use client";

import React, { useState } from "react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";
import { WorkflowStepper } from "@/components/workflow/workflow-stepper";
import { Button } from "@/components/ui/button";
import { useWorkflowState } from "@/hooks/use-workflow-state";
import type { ExperimentResult, ExperimentAttackType } from "@/lib/types/experiment";

// ── Helpers ───────────────────────────────────────────────────────────────────

const ATTACK_LABELS: Record<ExperimentAttackType, string> = {
  baseline: "Citra Acuan (Baseline)",
  jpeg: "Kompresi JPEG",
  crop: "Pemotongan (Crop)",
  resize: "Penskalaan (Resize)",
  gaussian_noise: "Derau Gaussian",
  brightness: "Kecerahan",
  contrast: "Kontras",
};

const ATTACK_GROUP_ORDER: ExperimentAttackType[] = [
  "jpeg",
  "crop",
  "resize",
  "gaussian_noise",
  "brightness",
  "contrast",
];

function fmt(v: number | null, decimals: number): string {
  if (v === null) return "—";
  return v.toFixed(decimals);
}

function fmtPsnr(v: number | null): string {
  if (v === null) return "—";
  if (v === -1) return "∞";
  return `${v.toFixed(2)} dB`;
}

function formatParam(attackType: ExperimentAttackType, param: number | null): string {
  if (param === null) return "—";
  if (attackType === "jpeg") return `Q${param}`;
  if (attackType === "crop" || attackType === "resize") return `${param}%`;
  if (attackType === "gaussian_noise") return `σ${param}`;
  if (attackType === "brightness") return param > 0 ? `+${param}` : `${param}`;
  return `${param}`;
}

// ── SVG bar chart ─────────────────────────────────────────────────────────────

interface BarChartProps {
  data: { label: string; value: number | null }[];
  yLabel: string;
  height?: number;
}

function BarChart({ data, yLabel, height = 180 }: BarChartProps) {
  const valid = data.filter((d) => d.value !== null && d.value !== -1);
  if (valid.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 border border-[#000000] bg-background">
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">TIDAK ADA DATA</p>
      </div>
    );
  }

  const maxVal = Math.max(...valid.map((d) => d.value as number));
  const minVal = Math.min(0, ...valid.map((d) => d.value as number));
  const range = maxVal - minVal || 1;

  const barWidth = Math.max(20, Math.floor(380 / data.length) - 4);
  const totalWidth = data.length * (barWidth + 4) + 40;
  const svgHeight = height;
  const chartTop = 10;
  const chartBottom = svgHeight - 28;
  const chartHeight = chartBottom - chartTop;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${svgHeight}`}
      className="w-full"
      role="img"
      aria-label={`${yLabel} bar chart`}
    >
      {/* Y-axis line */}
      <line x1={38} y1={chartTop} x2={38} y2={chartBottom} stroke="var(--color-border, #333)" strokeWidth={1} />
      {/* X-axis line */}
      <line x1={38} y1={chartBottom} x2={totalWidth - 4} y2={chartBottom} stroke="var(--color-border, #333)" strokeWidth={1} />

      {/* Bars */}
      {data.map((d, i) => {
        const x = 42 + i * (barWidth + 4);
        const val = d.value === -1 ? null : d.value;
        if (val === null) {
          return (
            <g key={i}>
              <rect x={x} y={chartTop} width={barWidth} height={chartHeight} fill="transparent" stroke="var(--color-border,#333)" strokeDasharray="2,2" />
              <text x={x + barWidth / 2} y={chartBottom + 10} textAnchor="middle" fontSize={6} fill="var(--color-text-tertiary,#888)" fontFamily="monospace">
                {d.label.length > 6 ? d.label.slice(0, 6) : d.label}
              </text>
            </g>
          );
        }
        const barH = Math.max(1, ((val - minVal) / range) * chartHeight);
        const y = chartBottom - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={barH} fill="currentColor" className="text-text-primary" opacity={0.75} />
            <text x={x + barWidth / 2} y={chartBottom + 10} textAnchor="middle" fontSize={6} fill="var(--color-text-tertiary,#888)" fontFamily="monospace">
              {d.label.length > 6 ? d.label.slice(0, 6) : d.label}
            </text>
            <text x={x + barWidth / 2} y={y - 2} textAnchor="middle" fontSize={6} fill="var(--color-text-secondary,#aaa)" fontFamily="monospace">
              {val.toFixed(2)}
            </text>
          </g>
        );
      })}

      {/* Y label */}
      <text x={4} y={svgHeight / 2} textAnchor="middle" fontSize={7} fill="var(--color-text-tertiary,#888)" fontFamily="monospace" transform={`rotate(-90, 8, ${svgHeight / 2})`}>
        {yLabel}
      </text>
    </svg>
  );
}

// ── CSV/JSON export helpers ───────────────────────────────────────────────────

function exportCSV(results: ExperimentResult[]) {
  const headers = [
    "session_id", "experiment_id", "timestamp",
    "attack_type", "attack_parameter",
    "original_width", "original_height",
    "attacked_width", "attacked_height",
    "extraction_status", "extracted_watermark",
    "psnr", "nc", "ber", "error",
  ];

  const rows = results.map((r) =>
    [
      r.sessionId, r.experimentId, r.timestamp,
      r.attackType, r.attackParameter ?? "",
      r.imageWidth, r.imageHeight,
      r.attackedWidth, r.attackedHeight,
      r.extractionStatus, `"${r.extractedWatermark}"`,
      r.psnr ?? "", r.nc ?? "", r.ber ?? "", r.error ?? "",
    ].join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "frame-protect-results.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportJSON(session: { sessionId: string; createdAt: string; imageFileName: string; imageWidth: number; imageHeight: number; watermarkText: string }, results: ExperimentResult[]) {
  const baseline = results.find((r) => r.attackType === "baseline") ?? null;
  const experiments = results.filter((r) => r.attackType !== "baseline");

  const payload = {
    session: {
      id: session.sessionId,
      createdAt: session.createdAt,
      image: {
        fileName: session.imageFileName,
        width: session.imageWidth,
        height: session.imageHeight,
      },
      watermarkPayload: session.watermarkText,
      // secret key is intentionally excluded
    },
    baseline: baseline
      ? {
          experimentId: baseline.experimentId,
          timestamp: baseline.timestamp,
          extractionStatus: baseline.extractionStatus,
          extractedWatermark: baseline.extractedWatermark,
          psnr: baseline.psnr,
          nc: baseline.nc,
          ber: baseline.ber,
        }
      : null,
    experiments: experiments.map((r) => ({
      experimentId: r.experimentId,
      timestamp: r.timestamp,
      attackType: r.attackType,
      attackParameter: r.attackParameter,
      originalDimensions: { width: r.imageWidth, height: r.imageHeight },
      attackedDimensions: { width: r.attackedWidth, height: r.attackedHeight },
      extractionStatus: r.extractionStatus,
      extractedWatermark: r.extractedWatermark,
      psnr: r.psnr,
      nc: r.nc,
      ber: r.ber,
      error: r.error,
    })),
  };

  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "frame-protect-results.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const { session, requestClearSession, confirmClearPending, cancelClearSession, executeClearSession } = useWorkflowState();
  const [sortKey, setSortKey] = useState<"attackType" | "psnr" | "nc" | "ber">("attackType");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const results = session?.results ?? [];
  const baseline = results.find((r) => r.attackType === "baseline") ?? null;
  const attackResults = results.filter((r) => r.attackType !== "baseline");

  // Summary statistics
  const validPsnr = attackResults.filter((r) => r.psnr !== null && r.psnr !== -1).map((r) => r.psnr as number);
  const validNc = attackResults.filter((r) => r.nc !== null).map((r) => r.nc as number);
  const validBer = attackResults.filter((r) => r.ber !== null).map((r) => r.ber as number);
  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

  // Sorted attack results for table — no useMemo to avoid React Compiler warnings
  const sortedResults = [...attackResults].sort((a, b) => {
    let av: number | string, bv: number | string;
    if (sortKey === "attackType") {
      av = a.attackType;
      bv = b.attackType;
    } else {
      av = a[sortKey] ?? -Infinity;
      bv = b[sortKey] ?? -Infinity;
    }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  // Chart data — attack results only, insertion order
  const chartData = attackResults.map((r) => ({
    label: `${r.attackType.slice(0, 4)}${r.attackParameter !== null ? r.attackParameter : ""}`,
    psnr: r.psnr,
    nc: r.nc,
    ber: r.ber,
  }));

  // Group attack results by type
  const grouped: Partial<Record<ExperimentAttackType, ExperimentResult[]>> = {};
  for (const r of attackResults) {
    if (!grouped[r.attackType]) grouped[r.attackType] = [];
    grouped[r.attackType]!.push(r);
  }

  const thClass = "py-2 pr-4 font-mono text-[8px] uppercase tracking-widest text-text-secondary font-normal text-left cursor-pointer select-none hover:text-text-primary";

  return (
    <PlaceholderPage
      pageName="Hasil Analisis"
      description="Analisis ketahanan watermark berdasarkan data eksperimen nyata."
      routePath="/app/results"
    >
      <div className="space-y-12">
        <WorkflowStepper currentStepId="analyze" />

        {!session ? (
          <div className="border border-[#000000] bg-surface p-12 text-center space-y-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">BELUM ADA SESI EKSPERIMEN</p>
            <p className="font-sans text-sm text-text-secondary">
              Kembali ke halaman <strong>Lindungi</strong>, sisipkan watermark dan verifikasi citra acuan untuk memulai sesi pengujian.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* ── SESSION INFO ── */}
            <div className="border border-[#000000] bg-surface p-6 space-y-4">
              <div className="flex items-end justify-between border-b border-[#000000] pb-4">
                <div className="space-y-1">
                  <h4 className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#000000]">Sesi</h4>
                  <p className="font-mono text-[10px] text-text-secondary tracking-widest uppercase">Konteks Eksperimen</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={requestClearSession} aria-label="Hapus sesi eksperimen">
                    HAPUS SESI
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-[10px]">
                <div>
                  <span className="block text-text-secondary uppercase tracking-widest">ID Sesi</span>
                  <span className="block text-text-primary truncate">{session.sessionId.slice(0, 16)}…</span>
                </div>
                <div>
                  <span className="block text-text-secondary uppercase tracking-widest">Citra</span>
                  <span className="block text-text-primary truncate">{session.imageFileName}</span>
                </div>
                <div>
                  <span className="block text-text-secondary uppercase tracking-widest">Dimensi</span>
                  <span className="block text-text-primary">{session.imageWidth} × {session.imageHeight}</span>
                </div>
                <div>
                  <span className="block text-text-secondary uppercase tracking-widest">Watermark</span>
                  <span className="block text-text-primary">{session.watermarkText}</span>
                </div>
              </div>
            </div>

            {/* ── CONFIRM CLEAR ── */}
            {confirmClearPending && (
              <div className="border border-[#000000] bg-surface p-6 space-y-4">
                <p className="font-sans text-sm text-text-primary">
                  Apakah Anda yakin ingin menghapus seluruh hasil eksperimen? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-4">
                  <Button variant="primary" size="sm" onClick={executeClearSession}>Ya, Hapus Sesi</Button>
                  <Button variant="outline" size="sm" onClick={cancelClearSession}>Batal</Button>
                </div>
              </div>
            )}

            {/* ── BASELINE ── */}
            {baseline ? (
              <div className="border border-[#000000] bg-surface p-6 space-y-6">
                <div className="flex items-end justify-between border-b border-[#000000] pb-4">
                  <div className="space-y-1">
                    <h4 className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#000000]">Citra Acuan</h4>
                    <p className="font-mono text-[10px] text-text-secondary tracking-widest uppercase">
                      Asli → Ber-watermark (tanpa distorsi)
                    </p>
                  </div>
                  <span className={`font-mono text-[9px] uppercase tracking-widest ${baseline.extractionStatus === "DETECTED" ? "text-success" : "text-error"}`}>
                    {baseline.extractionStatus === "DETECTED" ? "TERDETEKSI" : "GAGAL"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-px bg-border border border-[#000000]">
                  {[
                    { label: "PSNR", value: fmtPsnr(baseline.psnr), unit: "dB" },
                    { label: "NC", value: fmt(baseline.nc, 4), unit: "0–1" },
                    { label: "BER", value: fmt(baseline.ber, 6), unit: "0–1" },
                  ].map((m) => (
                    <div key={m.label} className="bg-background p-5 space-y-3">
                      <span className="block font-mono text-[9px] uppercase tracking-widest text-text-secondary">{m.label}</span>
                      <div className="metric-value">{m.value}</div>
                      <span className="block font-mono text-[8px] text-text-secondary uppercase">{m.unit}</span>
                    </div>
                  ))}
                </div>
                {baseline.extractedWatermark && (
                  <div className="font-mono text-xs text-text-secondary">
                    Hasil Ekstraksi: <span className="text-text-primary">{baseline.extractedWatermark}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-dashed border-[#000000] bg-surface p-6 text-center">
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">Belum ada hasil acuan.</p>
              </div>
            )}

            {/* ── SUMMARY STATISTICS ── */}
            {attackResults.length > 0 && (
              <div className="border border-[#000000] bg-surface p-6 space-y-4">
                <h4 className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#000000] border-b border-[#000000] pb-3">Ringkasan</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-mono text-[10px]">
                  <div>
                    <span className="block text-text-secondary uppercase tracking-widest">Total Pengujian</span>
                    <span className="block text-text-primary text-base font-bold">{attackResults.length}</span>
                  </div>
                  <div>
                    <span className="block text-text-secondary uppercase tracking-widest">Terdeteksi</span>
                    <span className="block text-success text-base font-bold">{attackResults.filter((r) => r.extractionStatus === "DETECTED").length}</span>
                  </div>
                  <div>
                    <span className="block text-text-secondary uppercase tracking-widest">Gagal</span>
                    <span className="block text-error text-base font-bold">{attackResults.filter((r) => r.extractionStatus === "FAILED").length}</span>
                  </div>
                  <div>
                    <span className="block text-text-secondary uppercase tracking-widest">Rata-rata PSNR</span>
                    <span className="block text-text-primary">{avg(validPsnr) !== null ? avg(validPsnr)!.toFixed(2) + " dB" : "—"}</span>
                  </div>
                  <div>
                    <span className="block text-text-secondary uppercase tracking-widest">Rata-rata NC / BER</span>
                    <span className="block text-text-primary">
                      {avg(validNc) !== null ? avg(validNc)!.toFixed(4) : "—"} / {avg(validBer) !== null ? avg(validBer)!.toFixed(4) : "—"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ── RESULTS TABLE ── */}
            <div className="border border-[#000000] bg-surface p-6 space-y-4">
              <h4 className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#000000] border-b border-[#000000] pb-3">
                Eksperimen Ketahanan
              </h4>
              {sortedResults.length === 0 ? (
                <div className="text-center py-10">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">BELUM ADA HASIL EKSPERIMEN</p>
                  <p className="font-sans text-xs text-text-secondary mt-2">Jalankan pengujian di menu Uji Ketahanan untuk mengisi bagian ini.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse" aria-label="Hasil eksperimen ketahanan">
                    <thead>
                      <tr className="border-b border-[#000000]">
                        <th className={thClass} onClick={() => toggleSort("attackType")}>Pengujian {sortKey === "attackType" ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
                        <th className="py-2 pr-4 font-mono text-[8px] uppercase tracking-widest text-text-secondary font-normal text-left">Param</th>
                        <th className="py-2 pr-4 font-mono text-[8px] uppercase tracking-widest text-text-secondary font-normal text-left">Dimensi</th>
                        <th className="py-2 pr-4 font-mono text-[8px] uppercase tracking-widest text-text-secondary font-normal text-left">Ekstraksi</th>
                        <th className={thClass} onClick={() => toggleSort("psnr")}>PSNR {sortKey === "psnr" ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
                        <th className={thClass} onClick={() => toggleSort("nc")}>NC {sortKey === "nc" ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
                        <th className={thClass} onClick={() => toggleSort("ber")}>BER {sortKey === "ber" ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-[10px] text-text-primary">
                      {sortedResults.map((r) => (
                        <tr key={r.experimentId} className="border-b border-[#000000] last:border-0 hover:bg-surface-hover">
                          <td className="py-2 pr-4">{ATTACK_LABELS[r.attackType]}</td>
                          <td className="py-2 pr-4">{formatParam(r.attackType, r.attackParameter)}</td>
                          <td className="py-2 pr-4">{r.attackedWidth}×{r.attackedHeight}</td>
                          <td className={`py-2 pr-4 ${r.extractionStatus === "DETECTED" ? "text-success" : "text-error"}`}>
                            {r.extractionStatus === "DETECTED" ? "TERDETEKSI" : "GAGAL"}
                          </td>
                          <td className="py-2 pr-4">{fmtPsnr(r.psnr)}</td>
                          <td className="py-2 pr-4">{fmt(r.nc, 4)}</td>
                          <td className="py-2 pr-4">{fmt(r.ber, 4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ── GROUPED VIEW ── */}
            {ATTACK_GROUP_ORDER.some((type) => grouped[type]?.length) && (
              <div className="border border-[#000000] bg-surface p-6 space-y-6">
                <h4 className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#000000] border-b border-[#000000] pb-3">
                  Hasil Berdasarkan Jenis Distorsi
                </h4>
                {ATTACK_GROUP_ORDER.filter((type) => grouped[type]?.length).map((type) => (
                  <div key={type} className="space-y-2">
                    <h5 className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">{ATTACK_LABELS[type]}</h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse border border-[#000000]">
                        <thead>
                          <tr className="border-b border-[#000000] bg-surface">
                            <th className="py-1 px-3 font-mono text-[8px] text-text-secondary uppercase tracking-widest font-normal">Param</th>
                            <th className="py-1 px-3 font-mono text-[8px] text-text-secondary uppercase tracking-widest font-normal">Dimensi</th>
                            <th className="py-1 px-3 font-mono text-[8px] text-text-secondary uppercase tracking-widest font-normal">Ekstraksi</th>
                            <th className="py-1 px-3 font-mono text-[8px] text-text-secondary uppercase tracking-widest font-normal">PSNR</th>
                            <th className="py-1 px-3 font-mono text-[8px] text-text-secondary uppercase tracking-widest font-normal">NC</th>
                            <th className="py-1 px-3 font-mono text-[8px] text-text-secondary uppercase tracking-widest font-normal">BER</th>
                          </tr>
                        </thead>
                        <tbody className="font-mono text-[10px]">
                          {grouped[type]!.map((r) => (
                            <tr key={r.experimentId} className="border-b border-[#000000] last:border-0">
                              <td className="py-1 px-3">{formatParam(r.attackType, r.attackParameter)}</td>
                              <td className="py-1 px-3">{r.attackedWidth}×{r.attackedHeight}</td>
                              <td className={`py-1 px-3 ${r.extractionStatus === "DETECTED" ? "text-success" : "text-error"}`}>
                                {r.extractionStatus === "DETECTED" ? "TERDETEKSI" : "GAGAL"}
                              </td>
                              <td className="py-1 px-3">{fmtPsnr(r.psnr)}</td>
                              <td className="py-1 px-3">{fmt(r.nc, 4)}</td>
                              <td className="py-1 px-3">{fmt(r.ber, 4)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── CHARTS ── */}
            {chartData.length > 0 && (
              <div className="border border-[#000000] bg-surface p-6 space-y-8">
                <h4 className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#000000] border-b border-[#000000] pb-3">
                  Analisis Visual
                </h4>
                <p className="font-mono text-[9px] text-text-secondary uppercase tracking-widest">
                  Grafik dibuat langsung dari hasil eksperimen aktual. Nilai yang hilang tidak diinterpolasi.
                </p>
                <div className="space-y-6">
                  <div>
                    <h5 className="font-mono text-[10px] uppercase tracking-widest text-text-secondary mb-2">PSNR (dB)</h5>
                    <BarChart data={chartData.map((d) => ({ label: d.label, value: d.psnr === -1 ? null : d.psnr }))} yLabel="PSNR dB" />
                    <p className="font-mono text-[8px] text-text-secondary mt-1">N/A ditampilkan sebagai batang putus-putus (pengujian yang mengubah dimensi citra)</p>
                  </div>
                  <div>
                    <h5 className="font-mono text-[10px] uppercase tracking-widest text-text-secondary mb-2">NC (Korelasi Ternormalisasi)</h5>
                    <BarChart data={chartData.map((d) => ({ label: d.label, value: d.nc }))} yLabel="NC" />
                  </div>
                  <div>
                    <h5 className="font-mono text-[10px] uppercase tracking-widest text-text-secondary mb-2">BER (Rasio Kesalahan Bit)</h5>
                    <BarChart data={chartData.map((d) => ({ label: d.label, value: d.ber }))} yLabel="BER" />
                  </div>
                </div>
              </div>
            )}

            {/* ── EXPORT ── */}
            <div className="border border-[#000000] bg-surface p-6 space-y-4">
              <h4 className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#000000] border-b border-[#000000] pb-3">Ekspor</h4>
              <p className="font-mono text-[9px] text-text-secondary uppercase tracking-widest">
                Data yang diekspor tidak memuat kunci rahasia. Format CSV dan JSON berfungsi penuh.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => exportCSV(results)}
                  aria-label="Ekspor hasil sebagai CSV"
                  disabled={results.length === 0}
                >
                  EKSPOR CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportJSON(session, results)}
                  aria-label="Ekspor hasil sebagai JSON"
                  disabled={results.length === 0}
                >
                  EKSPOR JSON
                </Button>
              </div>
              {results.length > 0 && (
                <p className="font-mono text-[8px] text-text-secondary">
                  {results.length} data riwayat · frame-protect-results.csv / frame-protect-results.json
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </PlaceholderPage>
  );
}
