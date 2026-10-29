import { MitraMark } from "@/components/primitives";

export function SplashScreen() {
  return (
    <div className="flex min-h-full flex-col bg-white px-6 pb-safe pt-16">
      <div className="flex flex-1 flex-col items-center justify-center pb-12 text-center">
        <div className="flex items-center gap-3">
          <MitraMark size={52} className="splash-mark" />
          <div className="text-left">
            <span className="splash-word block text-[34px] font-extrabold italic leading-none tracking-[0.04em] text-[#151b2b]">
              MITRA
            </span>
            <span className="splash-tag mt-1 block text-[13px] italic leading-4 text-[var(--brand-ink)]">
              Powered by MIT
            </span>
          </div>
        </div>
        <div className="splash-progress mt-10" role="progressbar" aria-label="Memuat aplikasi" />
      </div>
      <p className="splash-tag text-center text-[13px] leading-5 text-[#6b7280]">
        V1. Mitra powered by MIT
      </p>
    </div>
  );
}
