import { ArrowsLeftRight, SignOut, User } from "@phosphor-icons/react";
import { Button, Sheet } from "@/components/mobile";
import { BUSINESS_UNITS, type BusinessUnit } from "@/lib/demo";

export function ProfileSheet({
  open,
  name,
  unit,
  onClose,
  onSwitchUnit,
  onLogout,
}: {
  open: boolean;
  name: string;
  unit: BusinessUnit;
  onClose: () => void;
  onSwitchUnit: () => void;
  onLogout: () => void;
}) {
  const current = BUSINESS_UNITS.find((item) => item.id === unit) ?? BUSINESS_UNITS[0];
  return (
    <Sheet open={open} onClose={onClose} label="Profil">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-[#dbe8ff] text-[#5b7fc7]">
          <User size={34} weight="fill" className="translate-y-1.5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-[18px] font-semibold leading-[1.3] text-[#16191c]">{name}</h2>
          <p className="flex items-center gap-1.5 text-[13px] leading-[1.4] text-[#4f5963]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: current.color }} />
            {current.short} · {current.name}
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <Button variant="outline" className="w-full" onClick={onSwitchUnit}>
          <ArrowsLeftRight size={18} aria-hidden="true" />
          Ganti Unit Bisnis
        </Button>
        <button
          type="button"
          onClick={onLogout}
          className="flex h-11 items-center justify-center gap-2 rounded-[8px] text-[14px] font-medium text-[#d73926] transition active:bg-[#fdf1ef]"
        >
          <SignOut size={18} aria-hidden="true" />
          Keluar
        </button>
      </div>
    </Sheet>
  );
}
