import type { ChipTone } from "@/components/mobile";

export const HEAT_META: Record<"warm" | "hot" | "cold", { label: string; tone: ChipTone }> = {
  warm: { label: "Warm", tone: "warm" },
  hot: { label: "Hot", tone: "hot" },
  cold: { label: "Cold", tone: "cold" },
};
