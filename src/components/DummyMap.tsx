import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
} from "react";
import { cn } from "@/lib/cn";
import {
  AREAS,
  H_ROADS,
  MAP_POIS,
  PARKS,
  POI_COLORS,
  POI_GLYPH,
  RIVER,
  TOLL,
  USER_LOCATION,
  V_ROADS,
  WORLD,
  clampView,
  type MapPoint,
  type MapView,
} from "@/lib/map";

/** A vector "dummy" map: crisp at every zoom level, no tiles or network. */

function MapArt() {
  const cols = [0, ...V_ROADS.map((road) => road.x), WORLD];
  const rows = [0, ...H_ROADS.map((road) => road.y), WORLD];
  const blocks: ReactElement[] = [];
  for (let c = 0; c < cols.length - 1; c += 1) {
    for (let r = 0; r < rows.length - 1; r += 1) {
      const x0 = cols[c] + 14;
      const y0 = rows[r] + 14;
      const w = cols[c + 1] - cols[c] - 28;
      const h = rows[r + 1] - rows[r] - 28;
      if (w <= 0 || h <= 0) continue;
      if (PARKS.has(`${c}-${r}`)) {
        blocks.push(<rect key={`p${c}-${r}`} x={x0} y={y0} width={w} height={h} rx={10} fill="#cfe7c4" />);
        continue;
      }
      const mx = x0 + w / 2;
      const my = y0 + h / 2;
      const quads = [
        [x0, y0, mx - 5 - x0, my - 5 - y0],
        [mx + 5, y0, x0 + w - mx - 5, my - 5 - y0],
        [x0, my + 5, mx - 5 - x0, y0 + h - my - 5],
        [mx + 5, my + 5, x0 + w - mx - 5, y0 + h - my - 5],
      ];
      quads.forEach(([bx, by, bw, bh], index) => {
        if (bw <= 0 || bh <= 0) return;
        blocks.push(
          <rect key={`b${c}-${r}-${index}`} x={bx} y={by} width={bw} height={bh} rx={5} fill="#e7e5df" />,
        );
        if ((c + r + index) % 3 === 0) {
          blocks.push(
            <rect
              key={`h${c}-${r}-${index}`}
              x={bx + 10}
              y={by + 10}
              width={Math.max(0, bw - 20)}
              height={Math.max(0, bh / 2 - 12)}
              rx={3}
              fill="#dcd9d2"
            />,
          );
        }
      });
    }
  }

  return (
    <>
      <rect x={-2000} y={-2000} width={WORLD + 4000} height={WORLD + 4000} fill="#f3f1ec" />
      {blocks}
      <ellipse cx={215} cy={1000} rx={62} ry={32} fill="#b7dcf3" />
      <path d={RIVER} fill="none" stroke="#b7dcf3" strokeWidth={30} strokeLinecap="round" />
      {/* minor roads */}
      <g stroke="#ffffff" strokeLinecap="round">
        {V_ROADS.filter((road) => !road.major).map((road) => (
          <line key={road.name} x1={road.x} y1={-20} x2={road.x} y2={WORLD + 20} strokeWidth={14} />
        ))}
        {H_ROADS.filter((road) => !road.major).map((road) => (
          <line key={road.name} x1={-20} y1={road.y} x2={WORLD + 20} y2={road.y} strokeWidth={14} />
        ))}
      </g>
      {/* arterial roads */}
      {V_ROADS.filter((road) => road.major).map((road) => (
        <g key={road.name}>
          <line x1={road.x} y1={-20} x2={road.x} y2={WORLD + 20} stroke="#f1cf7a" strokeWidth={24} />
          <line x1={road.x} y1={-20} x2={road.x} y2={WORLD + 20} stroke="#fde9a8" strokeWidth={20} />
        </g>
      ))}
      {H_ROADS.filter((road) => road.major).map((road) => (
        <g key={road.name}>
          <line x1={-20} y1={road.y} x2={WORLD + 20} y2={road.y} stroke="#f1cf7a" strokeWidth={24} />
          <line x1={-20} y1={road.y} x2={WORLD + 20} y2={road.y} stroke="#fde9a8" strokeWidth={20} />
        </g>
      ))}
      <path d={TOLL} fill="none" stroke="#e9a35c" strokeWidth={28} />
      <path d={TOLL} fill="none" stroke="#f9c48b" strokeWidth={22} />
      <path id="toll-label" d={TOLL} fill="none" />

      {/* labels */}
      <g
        fontFamily="inherit"
        fontSize={11}
        fill="#5f6873"
        stroke="#ffffff"
        strokeWidth={3}
        style={{ paintOrder: "stroke" }}
        textAnchor="middle"
      >
        {V_ROADS.flatMap((road) =>
          [240, 720, 1190].map((y) => (
            <text key={`${road.name}-${y}`} transform={`translate(${road.x + 4} ${y}) rotate(-90)`}>
              {road.name}
            </text>
          )),
        )}
        {H_ROADS.flatMap((road) =>
          [215, 675, 1135].map((x) => (
            <text key={`${road.name}-${x}`} x={x} y={road.y + 4}>
              {road.name}
            </text>
          )),
        )}
        <text fontSize={12} fill="#9a5a19">
          <textPath href="#toll-label" startOffset="62%">
            Jakarta Outer Ring Rd E
          </textPath>
        </text>
        <text x={960} y={470} fill="#4b86b4" fontStyle="italic" transform="rotate(-70 960 470)">
          Kali Sunter
        </text>
        <text x={215} y={925} fill="#3f7d3a" fontSize={10}>
          Taman Kirana
        </text>
        <text x={905} y={960} fill="#3f7d3a" fontSize={10}>
          Taman Pulomas
        </text>
        <text x={1135} y={484} fill="#3f7d3a" fontSize={10}>
          Hutan Kota Gading
        </text>
      </g>
      <g
        fontSize={13}
        fontWeight={600}
        letterSpacing="0.18em"
        fill="#9aa3ad"
        textAnchor="middle"
        style={{ textTransform: "uppercase" }}
      >
        {AREAS.map((area) => (
          <text key={area.name} x={area.x} y={area.y}>
            {area.name.toUpperCase()}
          </text>
        ))}
      </g>
    </>
  );
}

function PoiMarkers({ z }: { z: number }) {
  const scale = 1 / Math.max(0.8, Math.min(z, 1.6));
  return (
    <g>
      {MAP_POIS.map((poi) => (
        <g key={poi.id} transform={`translate(${poi.x} ${poi.y}) scale(${scale})`}>
          <circle r={10} fill={POI_COLORS[poi.kind]} stroke="#fff" strokeWidth={2} />
          <path d={POI_GLYPH[poi.kind]} fill="none" stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
          {z >= 0.9 ? (
            <text
              x={14}
              y={4}
              fontSize={11}
              fontWeight={600}
              fill={POI_COLORS[poi.kind]}
              stroke="#fff"
              strokeWidth={3}
              style={{ paintOrder: "stroke" }}
            >
              {poi.name}
            </text>
          ) : null}
        </g>
      ))}
    </g>
  );
}

export function DummyMap({
  view,
  onViewChange,
  onMovingChange,
  className,
}: {
  view: MapView;
  onViewChange: (view: MapView) => void;
  onMovingChange: (moving: boolean) => void;
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 393, h: 600 });
  const pointers = useRef(new Map<number, MapPoint>());
  const gesture = useRef<{ dist: number; z: number } | null>(null);
  const lastTap = useRef(0);
  const viewRef = useRef(view);
  viewRef.current = view;

  useEffect(() => {
    const node = boxRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const set = useCallback((next: MapView) => onViewChange(clampView(next)), [onViewChange]);

  /** Zoom keeping the world point under (sx, sy) screen coords fixed. */
  const zoomAt = useCallback(
    (factor: number, sx: number, sy: number) => {
      const current = viewRef.current;
      const z = Math.min(3, Math.max(0.55, current.z * factor));
      const wx = current.x + (sx - size.w / 2) / current.z;
      const wy = current.y + (sy - size.h / 2) / current.z;
      set({ x: wx - (sx - size.w / 2) / z, y: wy - (sy - size.h / 2) / z, z });
    },
    [set, size],
  );

  function local(event: { clientX: number; clientY: number }) {
    const rect = boxRef.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function onPointerDown(event: PointerEvent) {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, local(event));
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), z: viewRef.current.z };
    }
    onMovingChange(true);
  }

  function onPointerMove(event: PointerEvent) {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    const point = local(event);
    pointers.current.set(event.pointerId, point);
    const current = viewRef.current;
    if (pointers.current.size === 2 && gesture.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const target = (gesture.current.z * dist) / gesture.current.dist;
      zoomAt(target / current.z, (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }
    set({
      ...current,
      x: current.x - (point.x - previous.x) / current.z,
      y: current.y - (point.y - previous.y) / current.z,
    });
  }

  function onPointerUp(event: PointerEvent) {
    const start = pointers.current.get(event.pointerId);
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) gesture.current = null;
    if (pointers.current.size === 0) {
      onMovingChange(false);
      const now = Date.now();
      if (event.pointerType !== "mouse" && start && now - lastTap.current < 280) {
        zoomAt(1.6, start.x, start.y);
        lastTap.current = 0;
      } else {
        lastTap.current = now;
      }
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    const step = 60 / view.z;
    const moves: Record<string, Partial<MapView>> = {
      ArrowLeft: { x: view.x - step },
      ArrowRight: { x: view.x + step },
      ArrowUp: { y: view.y - step },
      ArrowDown: { y: view.y + step },
    };
    if (moves[event.key]) {
      event.preventDefault();
      set({ ...view, ...moves[event.key] });
    } else if (event.key === "+" || event.key === "=") {
      zoomAt(1.3, size.w / 2, size.h / 2);
    } else if (event.key === "-") {
      zoomAt(1 / 1.3, size.w / 2, size.h / 2);
    }
  }

  useEffect(() => {
    const node = boxRef.current;
    if (!node) return;
    let idle = 0;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = node.getBoundingClientRect();
      onMovingChange(true);
      zoomAt(Math.exp(-event.deltaY * 0.0022), event.clientX - rect.left, event.clientY - rect.top);
      window.clearTimeout(idle);
      idle = window.setTimeout(() => onMovingChange(false), 220);
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      node.removeEventListener("wheel", onWheel);
      window.clearTimeout(idle);
    };
  }, [zoomAt, onMovingChange]);

  const tx = size.w / 2 - view.x * view.z;
  const ty = size.h / 2 - view.y * view.z;

  return (
    <div
      ref={boxRef}
      className={cn("map-surface", className)}
      role="application"
      aria-label="Peta. Geser untuk memindahkan titik, gunakan tombol plus dan minus untuk zoom."
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={(event) => {
        const point = local(event);
        zoomAt(1.6, point.x, point.y);
      }}
      onKeyDown={onKeyDown}
    >
      <svg width="100%" height="100%" aria-hidden="true">
        <g transform={`translate(${tx} ${ty}) scale(${view.z})`}>
          <MapArt />
          <PoiMarkers z={view.z} />
          <g transform={`translate(${USER_LOCATION.x} ${USER_LOCATION.y}) scale(${1 / view.z})`}>
            <circle r={18} fill="#2f6fe4" opacity={0.18} className="map-user-pulse" />
            <circle r={8} fill="#2f6fe4" stroke="#fff" strokeWidth={3} />
          </g>
        </g>
      </svg>
    </div>
  );
}

