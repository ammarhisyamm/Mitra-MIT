import { useMemo, useState, type ReactNode } from "react";
import { ArrowCounterClockwise, CaretRight, Checks, ClipboardText, Scales } from "@phosphor-icons/react";
import {
  BottomNav,
  Button,
  EmptyState,
  FilterButton,
  FilterChip,
  SearchField,
  Sheet,
  StatusChip,
  type NavId,
} from "@/components/mobile";
import { effectiveHeat, maskPhone, type Activity, type Lead, type LeadHeat } from "@/lib/activity";
import { cn } from "@/lib/cn";
import { HEAT_META } from "@/lib/heat";

type SimFilter = "belum" | "sudah";
type ContactFilter = { simulation: SimFilter[]; status: LeadHeat[] };

const EMPTY: ContactFilter = { simulation: [], status: [] };

type Contact = { lead: Lead; activity: Activity; heat: LeadHeat };

function toggle<T>(list: T[], value: T) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function ContactCard({ contact, onClick }: { contact: Contact; onClick: () => void }) {
  const { lead, activity } = contact;
  const heat = HEAT_META[contact.heat];
  return (
    <button
      type="button"
      onClick={onClick}
      className="card-enter w-full rounded-[8px] border border-[#e2e8f0] text-left transition active:bg-[#f8fafc]"
    >
      <span className="mx-3 flex items-center justify-between gap-2 border-b border-[#f1f1f1] py-2.5">
        {lead.simulation ? (
          <span className="flex items-center gap-1.5 text-[14px] leading-[1.4] text-[var(--brand-ink)]">
            <Checks size={18} aria-hidden="true" />
            Sudah Simulasi
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[14px] leading-[1.4] text-[#384047]">
            <Scales size={18} aria-hidden="true" />
            Belum Simulasi
          </span>
        )}
        <StatusChip tone={heat.tone}>{heat.label}</StatusChip>
      </span>
      <span className="flex items-center gap-3 px-3 pb-3 pt-2.5">
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[16px] font-medium leading-[1.4] text-[#020618]">{lead.name}</span>
          <span className="block text-[16px] leading-[1.4] text-[#384047]">{maskPhone(lead.phone)}</span>
        </span>
        <CaretRight size={20} className="flex-none text-[#16191c]" aria-hidden="true" />
      </span>
      <span className="mx-3 mb-3 flex items-center gap-3 rounded-[4px] border border-[#dfe4ea] px-3 py-2">
        <ClipboardText size={22} className="flex-none text-[var(--brand-ink)]" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block text-[12px] leading-[1.4] text-[#4f5963]">Sumber Aktivitas</span>
          <span className="block truncate text-[14px] leading-[1.4] text-[#020618]">{activity.name}</span>
        </span>
      </span>
    </button>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="mt-4">
      <legend className="mb-2 text-[16px] font-medium leading-[1.4] text-[#16191c]">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

export function ContactScreen({
  activities,
  onOpen,
  onNavigate,
}: {
  activities: Activity[];
  onOpen: (activityId: string) => void;
  onNavigate: (id: NavId) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ContactFilter>(EMPTY);
  const [draft, setDraft] = useState<ContactFilter>(EMPTY);
  const [filterOpen, setFilterOpen] = useState(false);

  // Contacts are leads that already count as a prospect (warm or hot).
  const contacts = useMemo<Contact[]>(
    () =>
      activities
        .flatMap((activity) => activity.leads.map((lead) => ({ lead, activity, heat: effectiveHeat(lead) })))
        .filter((contact) => contact.heat !== "cold"),
    [activities],
  );

  const counts = {
    total: contacts.length,
    warm: contacts.filter((item) => item.heat === "warm").length,
    hot: contacts.filter((item) => item.heat === "hot").length,
  };

  const filtered = filter.simulation.length > 0 || filter.status.length > 0;
  const visible = contacts.filter(({ lead, heat }) => {
    const needle = query.trim().toLowerCase();
    if (needle && !lead.name.toLowerCase().includes(needle) && !lead.phone.includes(needle)) return false;
    if (filter.simulation.length > 0 && !filter.simulation.includes(lead.simulation ? "sudah" : "belum")) return false;
    if (filter.status.length > 0 && !filter.status.includes(heat)) return false;
    return true;
  });

  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="hero-safe px-6 pb-4">
        <h1 className="text-[24px] font-semibold leading-[1.2] text-[#16191c]">Kontak</h1>
        <p className="mt-2 text-[14px] leading-[1.4] text-[#384047]">Hubungi dan tindak lanjuti calon nasabah Anda.</p>
        <dl className="mt-4 grid grid-cols-3 gap-2">
          {(
            [
              ["Total", counts.total],
              ["Warm", counts.warm],
              ["Hot", counts.hot],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="rounded-[4px] bg-[var(--brand-soft)] px-3 py-2.5">
              <dt className="text-[14px] leading-[1.4] text-[var(--brand-ink)]">{label}</dt>
              <dd className="text-[24px] font-medium leading-[1.3] text-[#16191c]">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="sticky top-0 z-[5] flex gap-2 bg-white px-6 py-3">
        <div className="min-w-0 flex-1">
          <SearchField value={query} onChange={setQuery} placeholder="Cari Nama Kontak" />
        </div>
        <FilterButton
          active={filtered}
          onClick={() => {
            setDraft(filter);
            setFilterOpen(true);
          }}
        />
      </div>

      <main className="flex flex-1 flex-col px-6 pb-6 pt-3">
        {visible.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              image="/activity/empty-activity.png"
              title="Kontak Tidak Ditemukan"
              message="Coba kata kunci lain atau atur ulang filter."
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setFilter(EMPTY);
                  }}
                >
                  <ArrowCounterClockwise size={16} aria-hidden="true" />
                  Atur Ulang
                </Button>
              }
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {visible.map((contact) => (
              <ContactCard
                key={contact.lead.id}
                contact={contact}
                onClick={() => onOpen(contact.activity.id)}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNav active="contact" onNavigate={onNavigate} />

      <Sheet open={filterOpen} onClose={() => setFilterOpen(false)} label="Filter kontak">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-semibold leading-[1.3] text-[#16191c]">Filter</h2>
          <button
            type="button"
            onClick={() => setDraft(EMPTY)}
            className="flex items-center gap-1 text-[14px] font-medium text-[var(--brand-ink)]"
          >
            <ArrowCounterClockwise size={16} aria-hidden="true" />
            Reset
          </button>
        </div>
        <FilterGroup title="Simulasi">
          {(
            [
              ["belum", "Belum Simulasi"],
              ["sudah", "Sudah Simulasi"],
            ] as const
          ).map(([id, label]) => (
            <FilterChip
              key={id}
              label={label}
              selected={draft.simulation.includes(id)}
              onClick={() => setDraft((current) => ({ ...current, simulation: toggle(current.simulation, id) }))}
            />
          ))}
        </FilterGroup>
        <FilterGroup title="Status">
          {(["warm", "hot"] as const).map((id) => (
            <FilterChip
              key={id}
              label={HEAT_META[id].label}
              selected={draft.status.includes(id)}
              onClick={() => setDraft((current) => ({ ...current, status: toggle(current.status, id) }))}
            />
          ))}
        </FilterGroup>
        <Button
          className={cn("mt-6 w-full")}
          onClick={() => {
            setFilter(draft);
            setFilterOpen(false);
          }}
        >
          Tampilkan Leads
        </Button>
      </Sheet>
    </div>
  );
}
