"use client";

import React, { useState } from "react";
import { PlaceholderPage } from "@/components/ui/placeholder-page";
import { WorkflowStepper } from "@/components/workflow/workflow-stepper";
import { ContactSheetPreview } from "@/components/preview/contact-sheet-preview";
import { Button } from "@/components/ui/button";
import { useWorkflowState } from "@/hooks/use-workflow-state";
import {
  testAttack,
  AttackTestResponse,
} from "@/services/api/attack.service";

const ATTACK_OPTIONS = {
  jpeg: {
    name: "Kompresi JPEG",
    params: [90, 70, 50],
    suffix: "Q",
  },
  crop: {
    name: "Pemotongan (Crop)",
    params: [10, 25],
    suffix: "%",
  },
  resize: {
    name: "Penskalaan (Resize)",
    params: [75, 50],
    suffix: "%",
  },
  gaussian_noise: {
    name: "Derau Gaussian",
    params: [5, 10, 20],
    suffix: "σ",
  },
  brightness: {
    name: "Kecerahan",
    params: [-30, 30],
    suffix: "",
  },
  contrast: {
    name: "Kontras",
    params: [0.7, 1.0, 1.3],
    suffix: "",
  },
};

type AttackType = keyof typeof ATTACK_OPTIONS;

interface AttackHistoryEntry extends AttackTestResponse {
  timestamp: string;
}

/**
 * Normalize BER from the backend.
 *
 * Expected normal form:
 *   number | null
 *
 * Also supports a backend response such as:
 *   { ber: number, total_bits: number, error_bits: number }
 */
function normalizeBer(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "object") {
    const candidate = value as {
      ber?: unknown;
    };

    if (typeof candidate.ber === "number") {
      return Number.isFinite(candidate.ber)
        ? candidate.ber
        : null;
    }
  }

  return null;
}

export default function AttackLabPage() {
  const {
    baselineContext,
    addExperimentResult,
    refreshSession,
  } = useWorkflowState();

  const [selectedAttack, setSelectedAttack] =
    useState<AttackType>("jpeg");

  const [selectedParam, setSelectedParam] =
    useState<number>(70);

  const [isAttacking, setIsAttacking] =
    useState(false);

  const [attackError, setAttackError] =
    useState<string | null>(null);

  const [history, setHistory] =
    useState<AttackHistoryEntry[]>([]);

  const currentResult =
    history.length > 0 ? history[0] : null;

  const handleAttackChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const atk = e.target.value as AttackType;

    setSelectedAttack(atk);

    setSelectedParam(
      ATTACK_OPTIONS[atk].params[0]
    );
  };

  const handleRunAttack = async () => {
    if (!baselineContext) {
      setAttackError(
        "Belum ada citra acuan. Silakan sisipkan watermark pada citra terlebih dahulu."
      );
      return;
    }

    setAttackError(null);
    setIsAttacking(true);

    try {
      const attackStart = Date.now();

      const res = await testAttack({
        watermarked_image:
          baselineContext.watermarkedImage,

        original_watermark_text:
          baselineContext.watermarkText,

        secret_key:
          baselineContext.secretKey,

        attack_type:
          selectedAttack,

        parameter:
          selectedParam,
      });

      /*
       * Normalize BER before using it anywhere
       * in the frontend.
       */
      const normalizedBer =
        normalizeBer(res.ber);

      /*
       * Normalize the complete response used
       * by the UI history.
       */
      const normalizedResult: AttackHistoryEntry = {
        ...res,
        ber: normalizedBer,
        timestamp:
          new Date().toISOString(),
      };

      /*
       * Show newest result at the top.
       */
      setHistory((prev) => [
        normalizedResult,
        ...prev,
      ]);

      /*
       * Persist the normalized numeric BER.
       */
      addExperimentResult({
        watermarkType: "text",

        watermarkPayloadDescription:
          baselineContext.watermarkText,

        imageWidth:
          res.original_dimensions.width,

        imageHeight:
          res.original_dimensions.height,

        attackType:
          selectedAttack as import(
            "@/lib/types/experiment"
          ).ExperimentAttackType,

        attackParameter:
          selectedParam,

        attackedWidth:
          res.attacked_dimensions.width,

        attackedHeight:
          res.attacked_dimensions.height,

        extractionStatus:
          res.extraction_status,

        extractedWatermark:
          res.extracted_watermark,

        psnr:
          res.psnr === -1
            ? null
            : res.psnr,

        nc:
          res.nc,

        ber:
          normalizedBer,

        error: null,

        duration:
          Date.now() - attackStart,
      });

      refreshSession();
    } catch (err: unknown) {
      console.error(
        "Failed to run attack:",
        err
      );

      setAttackError(
        err instanceof Error
          ? err.message
          : "Gagal menjalankan pengujian distorsi."
      );
    } finally {
      setIsAttacking(false);
    }
  };

  const handleDownload = () => {
    if (!currentResult?.attacked_image) {
      return;
    }

    try {
      const parts =
        currentResult.attacked_image.split(
          ";base64,"
        );

      const contentType =
        parts[0].split(":")[1] ||
        "image/png";

      const raw =
        window.atob(parts[1]);

      const rawLength =
        raw.length;

      const uInt8Array =
        new Uint8Array(rawLength);

      for (
        let i = 0;
        i < rawLength;
        ++i
      ) {
        uInt8Array[i] =
          raw.charCodeAt(i);
      }

      const blob =
        new Blob(
          [uInt8Array],
          {
            type: contentType,
          }
        );

      const blobUrl =
        URL.createObjectURL(blob);

      const downloadLink =
        document.createElement("a");

      downloadLink.href =
        blobUrl;

      const ext =
        contentType.split("/")[1] ||
        "png";

      downloadLink.download =
        `frame-protect-attack-${currentResult.attack_type}-${currentResult.parameter}.${ext}`;

      document.body.appendChild(
        downloadLink
      );

      downloadLink.click();

      document.body.removeChild(
        downloadLink
      );

      setTimeout(() => {
        URL.revokeObjectURL(
          blobUrl
        );
      }, 1000);
    } catch (e) {
      console.error(
        "Download failed:",
        e
      );
    }
  };

  if (!baselineContext) {
    return (
      <PlaceholderPage
        pageName="Uji Ketahanan"
        description="Uji ketahanan watermark terhadap berbagai bentuk distorsi dan manipulasi citra."
        routePath="/app/attack-lab"
      >
        <div className="space-y-4 py-24 text-center">
          <p className="font-mono text-sm text-text-secondary">
            Belum ada citra acuan aktif.
          </p>

          <p className="font-sans text-sm text-text-secondary">
            Silakan kembali ke halaman Lindungi untuk memproses citra terlebih dahulu.
          </p>
        </div>
      </PlaceholderPage>
    );
  }

  return (
    <PlaceholderPage
      pageName="Uji Ketahanan"
      description="Uji ketahanan watermark terhadap berbagai bentuk distorsi dan manipulasi citra."
      routePath="/app/attack-lab"
    >
      <div className="space-y-12">

        {/* WORKFLOW */}
        <WorkflowStepper
          currentStepId="attack"
        />

        {/* =====================================================
            MAIN WORKSPACE
        ====================================================== */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.25fr)] lg:gap-14">

          {/* =====================================================
              LEFT COLUMN
          ====================================================== */}
          <div className="space-y-8">

            {/* ATTACK CONFIGURATION */}
            <div className="space-y-6 border border-[#000000] bg-surface p-6">

              <div className="flex items-end justify-between border-b border-[#000000] pb-4">
                <div className="space-y-1">
                  <h4 className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#000000]">
                    Konfigurasi Pengujian
                  </h4>

                  <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                    Atur parameter distorsi citra
                  </p>
                </div>
              </div>

              <div className="space-y-4">

                {/* ATTACK TYPE */}
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                    Jenis Pengujian
                  </label>

                  <select
                    className="h-10 w-full border border-[#000000] bg-white px-3 text-[11px] font-mono font-bold text-[#000000] transition-colors focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-1"
                    value={selectedAttack}
                    onChange={handleAttackChange}
                  >
                    {Object.entries(
                      ATTACK_OPTIONS
                    ).map(([k, v]) => (
                      <option
                        key={k}
                        value={k}
                      >
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PARAMETER */}
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                    Parameter
                  </label>

                  <select
                    className="h-10 w-full border border-[#000000] bg-white px-3 text-[11px] font-mono font-bold text-[#000000] transition-colors focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-1"
                    value={selectedParam}
                    onChange={(e) =>
                      setSelectedParam(
                        Number(e.target.value)
                      )
                    }
                  >
                    {ATTACK_OPTIONS[
                      selectedAttack
                    ].params.map((p) => (
                      <option
                        key={p}
                        value={p}
                      >
                        {ATTACK_OPTIONS[
                          selectedAttack
                        ].suffix === "Q"
                          ? `Q${p}`
                          : ATTACK_OPTIONS[
                                selectedAttack
                              ].suffix === "σ"
                            ? `σ${p}`
                            : ATTACK_OPTIONS[
                                  selectedAttack
                                ].suffix === "%"
                              ? `${p}%`
                              : p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ERROR */}
                {attackError && (
                  <div className="border border-error bg-[#9e5b5b]/10 p-3 text-[10px] font-mono uppercase tracking-widest text-error">
                    KESALAHAN: {attackError}
                  </div>
                )}

                {/* RUN ATTACK */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full font-mono text-xs uppercase tracking-widest"
                  disabled={isAttacking}
                  onClick={handleRunAttack}
                >
                  {isAttacking
                    ? "MEMPROSES..."
                    : "JALANKAN PENGUJIAN"}
                </Button>
              </div>
            </div>

            {/* =================================================
                CURRENT RESULT
            ================================================== */}
            {currentResult && (
              <div className="space-y-6">

                {/* ATTACKED IMAGE INFORMATION */}
                <div className="space-y-4 border border-[#000000] bg-surface p-5">

                  <div className="flex items-center justify-between border-b border-[#000000] pb-3">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-primary">
                      Citra Hasil Pengujian
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <div>
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                        Pengujian
                      </span>

                      <span className="block font-mono text-[11px] text-text-primary">
                        {ATTACK_OPTIONS[
                          currentResult.attack_type as AttackType
                        ]?.name ||
                          currentResult.attack_type}
                      </span>
                    </div>

                    <div>
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                        Parameter
                      </span>

                      <span className="block font-mono text-[11px] text-text-primary">
                        {currentResult.parameter}
                      </span>
                    </div>

                    <div>
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                        Dimensi
                      </span>

                      <span className="block font-mono text-[11px] text-text-primary">
                        {
                          currentResult
                            .attacked_dimensions
                            .width
                        }{" "}
                        ×{" "}
                        {
                          currentResult
                            .attacked_dimensions
                            .height
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* EXTRACTION */}
                <div className="space-y-4 border border-[#000000] bg-surface p-5">

                  <div className="flex items-center justify-between border-b border-[#000000] pb-3">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-primary">
                      Ekstraksi
                    </h4>
                  </div>

                  <div className="space-y-1 border border-[#000000] bg-background p-4">
                    <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                      Status
                    </span>

                    <span
                      className={`block font-mono text-xs font-bold ${
                        currentResult.extraction_status ===
                        "DETECTED"
                          ? "text-success"
                          : "text-error"
                      }`}
                    >
                      {
                        currentResult.extraction_status ===
                        "DETECTED"
                          ? "TERDETEKSI"
                          : "GAGAL"
                      }
                    </span>
                  </div>

                  <div className="space-y-1 border border-[#000000] bg-background p-4">
                    <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                      Watermark Hasil Ekstraksi
                    </span>

                    <div className="font-mono text-sm font-medium tracking-wide text-text-primary">
                      {currentResult.extracted_watermark ||
                        "(kosong)"}
                    </div>
                  </div>
                </div>

                {/* METRICS */}
                <div className="space-y-4 border border-[#000000] bg-surface p-5">

                  <div className="flex items-center justify-between border-b border-[#000000] pb-3">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-text-primary">
                      Metrik vs Acuan
                    </h4>
                  </div>

                  <div className="grid grid-cols-3 gap-3">

                    <div className="border border-[#000000] bg-background p-3">
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                        PSNR
                      </span>

                      <span className="metric-value">
                        {currentResult.psnr === null
                          ? "N/A"
                          : currentResult.psnr === -1.0
                            ? "∞"
                            : `${currentResult.psnr.toFixed(
                                2
                              )} dB`}
                      </span>
                    </div>

                    <div className="border border-[#000000] bg-background p-3">
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                        NC
                      </span>

                      <span className="metric-value">
                        {currentResult.nc === null
                          ? "N/A"
                          : currentResult.nc.toFixed(
                              4
                            )}
                      </span>
                    </div>

                    <div className="border border-[#000000] bg-background p-3">
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-text-secondary">
                        BER
                      </span>

                      <span className="metric-value">
                        {currentResult.ber === null
                          ? "N/A"
                          : currentResult.ber.toFixed(
                              6
                            )}
                      </span>
                    </div>

                  </div>
                </div>

                {/* DOWNLOAD */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full font-mono text-[10px] uppercase tracking-widest shadow-md"
                  onClick={handleDownload}
                >
                  UNDUH CITRA HASIL PENGUJIAN
                </Button>
              </div>
            )}
          </div>

          {/* =====================================================
              RIGHT COLUMN — IMAGE / VISUAL LAB
          ====================================================== */}
          <div className="space-y-8">

            <div className="sticky top-24 space-y-5">

              <ContactSheetPreview
                leftTitle="Citra Ber-watermark"
                rightTitle="Citra Terdistorsi"
                leftImage={{
                  file:
                    baselineContext.watermarkedImage,
                  previewUrl:
                    baselineContext.watermarkedImageUrl,
                  metadata:
                    {} as any,
                }}
                rightImage={
                  currentResult
                    ? {
                        file: new File(
                          [],
                          "attacked.png"
                        ),
                        previewUrl:
                          currentResult.attacked_image,
                        metadata:
                          {} as any,
                      }
                    : null
                }
              />

            </div>

            {/* ATTACK HISTORY */}
            <div className="space-y-4 border border-[#000000] bg-surface p-6">

              <h4 className="border-b border-[#000000] pb-3 font-sans text-[11px] font-bold uppercase tracking-widest text-[#000000]">
                Riwayat Pengujian
              </h4>

              {history.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                    BELUM ADA PENGUJIAN
                  </p>

                  <p className="mt-2 font-sans text-xs text-text-secondary">
                    Jalankan pengujian untuk memulai analisis ketahanan.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">

                    <thead>
                      <tr className="border-b border-[#000000]">

                        <th className="py-2 pr-4 font-mono text-[8px] font-normal uppercase tracking-widest text-text-secondary">
                          Pengujian
                        </th>

                        <th className="py-2 pr-4 font-mono text-[8px] font-normal uppercase tracking-widest text-text-secondary">
                          Param
                        </th>

                        <th className="py-2 pr-4 font-mono text-[8px] font-normal uppercase tracking-widest text-text-secondary">
                          Dimensi
                        </th>

                        <th className="py-2 pr-4 font-mono text-[8px] font-normal uppercase tracking-widest text-text-secondary">
                          Ekstraksi
                        </th>

                        <th className="py-2 pr-4 font-mono text-[8px] font-normal uppercase tracking-widest text-text-secondary">
                          PSNR
                        </th>

                        <th className="py-2 pr-4 font-mono text-[8px] font-normal uppercase tracking-widest text-text-secondary">
                          NC
                        </th>

                        <th className="py-2 pr-4 font-mono text-[8px] font-normal uppercase tracking-widest text-text-secondary">
                          BER
                        </th>

                      </tr>
                    </thead>

                    <tbody className="font-mono text-[10px] text-text-primary">

                      {history.map(
                        (h, i) => (
                          <tr
                            key={i}
                            className="border-b border-[#000000] last:border-0 hover:bg-surface-hover"
                          >

                            <td className="py-2 pr-4">
                              {ATTACK_OPTIONS[
                                h.attack_type as AttackType
                              ]?.name ||
                                h.attack_type}
                            </td>

                            <td className="py-2 pr-4">
                              {h.parameter}
                            </td>

                            <td className="py-2 pr-4">
                              {
                                h.attacked_dimensions
                                  .width
                              }
                              ×
                              {
                                h.attacked_dimensions
                                  .height
                              }
                            </td>

                            <td
                              className={`py-2 pr-4 ${
                                h.extraction_status ===
                                "DETECTED"
                                  ? "text-success"
                                  : "text-error"
                              }`}
                            >
                              {
                                h.extraction_status ===
                                "DETECTED"
                                  ? "TERDETEKSI"
                                  : "GAGAL"
                              }
                            </td>

                            <td className="py-2 pr-4">
                              {h.psnr === null
                                ? "N/A"
                                : h.psnr === -1.0
                                  ? "∞"
                                  : h.psnr.toFixed(
                                      2
                                    )}
                            </td>

                            <td className="py-2 pr-4">
                              {h.nc === null
                                ? "N/A"
                                : h.nc.toFixed(
                                    4
                                  )}
                            </td>

                            <td className="py-2 pr-4">
                              {h.ber === null
                                ? "N/A"
                                : h.ber.toFixed(
                                    4
                                  )}
                            </td>

                          </tr>
                        )
                      )}

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