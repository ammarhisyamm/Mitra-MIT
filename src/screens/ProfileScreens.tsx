import { useState, type ReactNode } from "react";
import { CaretRight, DotsNine, Key, SignOut, User } from "@phosphor-icons/react";
import { BottomNav, Button, ResultDialog, type NavId } from "@/components/mobile";
import { cn } from "@/lib/cn";

function MenuRow({
  icon,
  label,
  detail,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  detail?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-[#f1f1f1] py-4 text-left transition last:border-b-0 active:bg-[#f8fafc]"
    >
      <span className="grid h-6 w-6 flex-none place-items-center text-[#16191c]">{icon}</span>
      <span className="min-w-0 flex-1 text-[16px] leading-[1.4] text-[#16191c]">{label}</span>
      {detail ? <span className="text-[14px] leading-[1.4] text-[#65737f]">{detail}</span> : null}
      <CaretRight size={20} className="flex-none text-[#16191c]" aria-hidden="true" />
    </button>
  );
}

export function ProfileScreen({
  name,
  onChangePassword,
  onChangePin,
  onLogout,
  onNavigate,
}: {
  name: string;
  onChangePassword: () => void;
  onChangePin: () => void;
  onLogout: () => void;
  onNavigate: (id: NavId) => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="bg-[var(--brand-soft)] px-6 pb-6 pt-14">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 flex-none place-items-center overflow-hidden rounded-full bg-[var(--brand-softer)] text-[var(--brand)]">
            <User size={36} weight="fill" className="translate-y-1.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-[18px] font-semibold leading-[1.3] text-[#16191c]">{name}</h1>
            <p className="flex items-center gap-1.5 text-[14px] leading-[1.4] text-[#4f5963]">
              Gadai MAS Jatim
              <span className="h-1 w-1 rounded-full bg-[#c6ccd1]" aria-hidden="true" />
              MAS Surabaya
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 pt-2">
        <MenuRow icon={<Key size={24} />} label="Ubah Kata Sandi" onClick={onChangePassword} />
        <MenuRow icon={<DotsNine size={24} />} label="Ubah PIN" onClick={onChangePin} />
        <MenuRow
          icon={<SignOut size={24} />}
          label="Keluar"
          detail="Versi 1.0"
          onClick={() => setConfirmOpen(true)}
        />
      </main>

      <BottomNav active="profile" onNavigate={onNavigate} />

      <ResultDialog
        open={confirmOpen}
        tone="warning"
        title="Keluar dari Akun"
        message="Apakah Anda yakin ingin keluar dari akun sales tracking?"
        onClose={() => setConfirmOpen(false)}
      >
        <Button className="w-full" onClick={() => setConfirmOpen(false)}>
          Batal
        </Button>
        <button
          type="button"
          onClick={() => {
            setConfirmOpen(false);
            onLogout();
          }}
          className={cn(
            "flex h-11 w-full items-center justify-center rounded-[8px] border border-[#ef402b] bg-white",
            "text-[14px] font-medium text-[#d73926] transition active:bg-[#fdf1ef]",
          )}
        >
          Ya, Keluar
        </button>
      </ResultDialog>
    </div>
  );
}
