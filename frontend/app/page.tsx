import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const steps = [
    {
      n: "01",
      title: "Lindungi",
      desc: "Unggah citra sumber, tentukan watermark, kunci rahasia, dan parameter DCT. Watermark disisipkan pada koefisien frekuensi menengah dalam blok 8×8.",
    },
    {
      n: "02",
      title: "Uji",
      desc: "Uji citra yang telah diberi watermark dengan kompresi JPEG, pemotongan, noise, perubahan kecerahan, dan kontras untuk melihat ketahanannya.",
    },
    {
      n: "03",
      title: "Deteksi",
      desc: "Masukkan citra yang akan diperiksa dan kunci rahasia. Sistem mencoba mengambil kembali watermark yang tertanam tanpa memerlukan citra asli.",
    },
    {
      n: "04",
      title: "Analisis",
      desc: "Bandingkan kualitas citra dan ketahanan watermark menggunakan PSNR, NC, dan BER pada berbagai kondisi pengujian.",
    },
  ];

  const capabilities = [
    {
      code: "DCT",
      name: "Penyisipan pada Domain Frekuensi",
      desc: "Bit watermark disisipkan melalui hubungan antara koefisien DCT frekuensi menengah sehingga tidak mudah terlihat namun tetap dapat dideteksi.",
    },
    {
      code: "KEY",
      name: "Kunci Rahasia",
      desc: "Kunci rahasia digunakan untuk menentukan posisi blok citra secara teratur. Tanpa kunci yang sesuai, watermark tidak dapat diekstraksi dengan benar.",
    },
    {
      code: "PSNR",
      name: "Pengukuran Kualitas Citra",
      desc: "PSNR digunakan untuk mengukur seberapa besar perubahan kualitas citra setelah watermark disisipkan.",
    },
    {
      code: "NC",
      name: "Kemiripan Watermark",
      desc: "NC mengukur tingkat kemiripan antara watermark asli dan watermark hasil ekstraksi.",
    },
    {
      code: "BER",
      name: "Kesalahan Bit",
      desc: "BER menunjukkan proporsi bit watermark yang berhasil atau gagal dipulihkan setelah proses pengujian.",
    },
    {
      code: "BLIND",
      name: "Ekstraksi Blind",
      desc: "Watermark dapat diekstraksi menggunakan citra yang diperiksa dan kunci rahasia tanpa memerlukan citra asli pada saat deteksi.",
    },
  ];

  return (
    <div className="w-full">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="border-b border-border">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid min-h-[88vh] grid-cols-1 items-center gap-12 py-16 lg:grid-cols-12 lg:gap-0 lg:py-0">

            {/* LEFT */}
            <div className="space-y-8 lg:col-span-5 lg:border-r lg:border-border lg:pr-16">

              <div className="space-y-2">

                <p className="mb-6 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#444444]">
                  Laboratorium Watermark Digital
                </p>

                <h1
                  className="font-serif leading-[0.95] tracking-tight text-[#000000]"
                  style={{
                    fontSize: "clamp(3rem, 6vw, 4.5rem)",
                    fontWeight: 900,
                  }}
                >
                  Lindungi
                  <br />
                  <span className="text-[#222222]">
                    citra.
                  </span>
                  <br />
                  Buktikan
                  <br />
                  <span className="text-[#222222]">
                    asalnya.
                  </span>
                </h1>

              </div>

              <p className="max-w-sm font-sans text-sm font-medium leading-relaxed text-[#333333]">
                Sisipkan watermark digital yang tidak terlihat
                pada citra menggunakan metode DCT.
                Periksa keberadaan watermark dan ukur
                ketahanannya terhadap berbagai perubahan citra.
              </p>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">

                <Link href="/app/protect">
                  <Button variant="primary" size="lg">
                    Lindungi Citra
                  </Button>
                </Link>

                <Link href="/app/attack-lab">
                  <Button variant="outline" size="lg">
                    Uji Ketahanan
                  </Button>
                </Link>

              </div>

              {/* TECHNICAL SPEC */}
              <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">

                {[
                  ["Metode", "DCT · 8×8"],
                  ["Frekuensi", "Menengah"],
                  ["Kunci", "SHA-256"],
                ].map(([k, v]) => (
                  <div key={k}>

                    <span className="block font-mono text-[8px] font-bold uppercase tracking-widest text-[#444444]">
                      {k}
                    </span>

                    <span className="mt-0.5 block font-mono text-[11px] font-bold text-[#000000]">
                      {v}
                    </span>

                  </div>
                ))}

              </div>

            </div>

            {/* RIGHT */}
            <div className="w-full lg:col-span-7 lg:pl-16">

              <div className="relative border border-[#000000] bg-white p-4 sm:p-6">

                {/* CORNER MARKS */}
                {[
                  "top-0 left-0 border-t-2 border-l-2",
                  "top-0 right-0 border-t-2 border-r-2",
                  "bottom-0 left-0 border-b-2 border-l-2",
                  "bottom-0 right-0 border-b-2 border-r-2",
                ].map((cls) => (
                  <div
                    key={cls}
                    className={`absolute h-5 w-5 border-[#000000] ${cls}`}
                  />
                ))}

                {/* METADATA */}
                <div className="mb-4 flex items-center justify-between">

                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#000000]">
                    Frame / 001
                  </span>

                </div>

                {/* IMAGE PLACEHOLDER */}
                <div className="img-grid-bg relative flex aspect-[4/3] items-center justify-center overflow-hidden border border-[#BDBDB7] bg-[#F0F0EC]">

                  {/* CROSSHAIR */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

                    <div className="relative h-16 w-16">

                      <div className="absolute inset-0 border border-[#BDBDB7]" />

                      <div className="absolute left-0 right-0 top-1/2 h-px bg-[#BDBDB7]" />

                      <div className="absolute bottom-0 left-1/2 top-0 w-px bg-[#BDBDB7]" />

                    </div>

                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex justify-between">

                    <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-[#444444]">
                      Citra Sumber
                    </span>

                    <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-[#444444]">
                      Menunggu Citra
                    </span>

                  </div>

                </div>

                {/* COMPARISON */}
                <div className="mt-3 grid grid-cols-3 gap-2">

                  {[
                    {
                      label: "Asli",
                      tag: "#A",
                    },
                    {
                      label: "Ber-watermark",
                      tag: "#B",
                    },
                    {
                      label: "Perbedaan",
                      tag: "#C",
                    },
                  ].map(({ label, tag }) => (

                    <div
                      key={tag}
                      className="border border-[#BDBDB7] bg-white"
                    >

                      <div className="img-grid-bg flex aspect-square items-center justify-center">

                        <span className="font-mono text-[7px] font-bold text-[#444444]">
                          {tag}
                        </span>

                      </div>

                      <div className="border-t border-[#BDBDB7] px-2 py-1">

                        <span className="font-mono text-[7px] font-bold uppercase tracking-widest text-[#222222]">
                          {label}
                        </span>

                      </div>

                    </div>

                  ))}

                </div>

                {/* METRICS */}
                <div className="mt-4 flex justify-between border-t border-[#BDBDB7] pt-3">

                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#444444]">
                    PSNR — dB
                  </span>

                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#444444]">
                    NC — · BER —
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          WORKFLOW
      ====================================================== */}
      <section className="border-b border-border py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">

            {/* LABEL */}
            <div className="lg:col-span-3">

              <div className="space-y-4 lg:sticky lg:top-24">

                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#444444]">
                  Proses
                </p>

                <h2
                  className="font-serif leading-tight text-[#000000]"
                  style={{
                    fontSize: "2.25rem",
                    fontWeight: 800,
                  }}
                >
                  Alur
                  <br />
                  Kerja
                </h2>

                <p className="font-sans text-sm font-medium leading-relaxed text-[#333333]">
                  Empat tahap utama untuk menyisipkan,
                  menguji, mendeteksi, dan menganalisis
                  watermark digital.
                </p>

                <div className="pt-4">

                  <Link href="/app/protect">
                    <Button variant="outline" size="sm">
                      Mulai Proses
                    </Button>
                  </Link>

                </div>

              </div>

            </div>

            {/* STEPS */}
            <div className="lg:col-span-9">

              <div className="grid grid-cols-1 gap-px border border-[#BDBDB7] bg-border sm:grid-cols-2">

                {steps.map((step) => (

                  <div
                    key={step.n}
                    className="space-y-4 bg-background p-8 transition-colors duration-150 hover:bg-surface-soft"
                  >

                    <span className="font-serif text-5xl font-black leading-none text-[#BDBDB7]">
                      {step.n}
                    </span>

                    <div className="border-t border-[#BDBDB7] pt-3">

                      <h3 className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#000000]">
                        {step.title}
                      </h3>

                      <p className="mt-2 font-sans text-sm font-medium leading-relaxed text-[#333333]">
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

      {/* =====================================================
          CONTEXT
      ====================================================== */}
      <section className="border-b border-border bg-white py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24">

            {/* TEXT */}
            <div className="space-y-6">

              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#444444]">
                Latar Belakang
              </p>

              <h2
                className="font-serif leading-tight text-[#000000]"
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                }}
              >
                Citra membawa
                <br />
                informasi asal.
              </h2>

              <div className="space-y-4 font-sans text-sm font-medium leading-relaxed text-[#333333]">

                <p>
                  Setiap foto memiliki asal dan riwayat.
                  Watermark pada domain frekuensi dapat
                  digunakan sebagai salah satu cara untuk
                  memberikan informasi asal tersebut tanpa
                  mengubah tampilan citra secara terlihat.
                </p>

                <p>
                  Berbeda dengan metadata yang dapat
                  dihapus, watermark pada domain DCT
                  dirancang agar tetap dapat dideteksi
                  setelah beberapa perubahan umum seperti
                  kompresi JPEG, perubahan ukuran,
                  kecerahan, dan kontras.
                </p>

                <p>
                  FRAME PROTECT tidak menjanjikan keamanan
                  yang sempurna. Sistem ini menyediakan
                  bukti teknis yang dapat diuji dan diukur
                  untuk melihat ketahanan watermark pada
                  kondisi yang terkontrol.
                </p>

              </div>

              <div className="grid grid-cols-2 gap-5 border-t border-[#BDBDB7] pt-5">

                {[
                  ["Metode Penyisipan", "Domain Frekuensi (DCT)"],
                  ["Ukuran Blok", "8 × 8 piksel"],
                  ["Ekstraksi", "Blind — tanpa citra asli"],
                  ["Derivasi Kunci", "SHA-256"],
                ].map(([label, value]) => (

                  <div key={label}>

                    <span className="block font-mono text-[8px] font-bold uppercase tracking-widest text-[#444444]">
                      {label}
                    </span>

                    <span className="mt-0.5 block font-mono text-[11px] font-bold text-[#000000]">
                      {value}
                    </span>

                  </div>

                ))}

              </div>

            </div>

            {/* SIGNAL CHAIN */}
            <div>

              {[
                {
                  label: "Citra Asli",
                  sub: "Citra sumber sebelum watermark",
                },
                {
                  label: "Transformasi DCT",
                  sub: "Pemecahan frekuensi dalam blok 8×8",
                },
                {
                  label: "Modifikasi Koefisien",
                  sub: "Penyisipan pada pasangan frekuensi menengah",
                },
                {
                  label: "Citra Ber-watermark",
                  sub: "Perubahan visual yang tidak terlihat",
                },
              ].map(({ label, sub }, i) => (

                <div
                  key={label}
                  className="flex items-center gap-4 border-b border-[#BDBDB7] py-4 last:border-0"
                >

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#BDBDB7] bg-white">

                    <span className="font-mono text-[10px] font-bold text-[#444444]">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                  </div>

                  <div className="flex-1">

                    <p className="font-sans text-[11px] font-bold uppercase tracking-wide text-[#000000]">
                      {label}
                    </p>

                    <p className="mt-0.5 font-mono text-[9px] font-semibold tracking-wider text-[#444444]">
                      {sub}
                    </p>

                  </div>

                  {i < 3 && (
                    <span className="shrink-0 font-mono text-[10px] font-bold text-[#BDBDB7]">
                      ↓
                    </span>
                  )}

                </div>

              ))}

              {/* DCT COMPARISON */}
              <div className="mt-5 border border-[#BDBDB7] bg-[#F0F0EC] p-4">

                <p className="mb-2 font-mono text-[8px] font-bold uppercase tracking-widest text-[#444444]">
                  Perbandingan Sinyal
                </p>

                <div className="grid grid-cols-2 gap-px bg-[#BDBDB7]">

                  {[
                    "DCT Asli",
                    "DCT Setelah Modifikasi",
                  ].map((lbl) => (

                    <div
                      key={lbl}
                      className="img-grid-bg flex aspect-[3/2] items-end bg-white p-3"
                    >

                      <span className="font-mono text-[7px] font-bold uppercase text-[#444444]">
                        {lbl}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CAPABILITIES
      ====================================================== */}
      <section className="border-b border-border py-24">

        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

            <div className="space-y-3 lg:col-span-4">

              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#444444]">
                Dasar Teknis
              </p>

              <h2
                className="font-serif leading-tight text-[#000000]"
                style={{
                  fontSize: "2.25rem",
                  fontWeight: 800,
                }}
              >
                Fitur
                <br />
                Utama
              </h2>

              <p className="font-sans text-sm font-medium leading-relaxed text-[#333333]">
                Metode watermark digital yang dapat
                diperiksa dan diukur menggunakan
                metrik kualitas citra.
              </p>

            </div>

          </div>

          {/* CAPABILITY GRID */}
          <div className="grid grid-cols-1 gap-px border border-[#BDBDB7] bg-[#BDBDB7] md:grid-cols-2 lg:grid-cols-3">

            {capabilities.map((c) => (

              <div
                key={c.code}
                className="space-y-4 bg-background p-8 transition-colors duration-150 hover:bg-white"
              >

                <span className="font-mono text-xs font-black tracking-widest text-[#000000]">
                  {c.code}
                </span>

                <div className="border-t border-[#BDBDB7] pt-3">

                  <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#000000]">
                    {c.name}
                  </h3>

                  <p className="mt-2 font-sans text-xs font-medium leading-relaxed text-[#444444]">
                    {c.desc}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="bg-white py-24">

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

          <div className="relative space-y-8 border-2 border-[#000000] p-12 text-center sm:p-16">

            {/* CORNER MARKS */}
            {[
              "top-[-1px] left-[-1px] border-t-4 border-l-4",
              "top-[-1px] right-[-1px] border-t-4 border-r-4",
              "bottom-[-1px] left-[-1px] border-b-4 border-l-4",
              "bottom-[-1px] right-[-1px] border-b-4 border-r-4",
            ].map((cls) => (

              <div
                key={cls}
                className={`absolute h-6 w-6 border-[#000000] ${cls}`}
              />

            ))}

            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#444444]">
              Mulai
            </p>

            <h2
              className="font-serif leading-tight text-[#000000]"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 900,
              }}
            >
              Lindungi citra
              <br />
              <span className="text-[#333333]">
                yang memiliki makna.
              </span>
            </h2>

            <p className="mx-auto max-w-xl font-sans text-sm font-medium leading-relaxed text-[#333333]">
              Menggabungkan fotografi, watermark digital,
              dan pengujian ketahanan untuk membantu
              memeriksa keaslian serta keberadaan watermark
              pada citra.
              <br />
              Seluruh pemrosesan dilakukan secara lokal.
              Citra tidak dikirim ke server eksternal.
            </p>

            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">

              <Link href="/app/protect">
                <Button variant="primary" size="lg">
                  Mulai Melindungi
                </Button>
              </Link>

              <Link href="/app/detect">
                <Button variant="outline" size="lg">
                  Deteksi Watermark
                </Button>
              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}