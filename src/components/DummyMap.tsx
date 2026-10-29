import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { cn } from "@/lib/cn";
import {
  AREAS,
  H_ROADS,
  MAP_POIS,
  CANALS,
  PATCHES,
  PONDS,
  POI_COLORS,
  POI_GLYPH,
  RIVER,
  TOLL,
  TOLL_RAMP,
  USER_LOCATION,
  V_ROADS,
  WORLD,
  clampView,
  type MapPoint,
  type MapView,
} from "@/lib/map";

/** A vector "dummy" map: crisp at every zoom level, no tiles or network. */

function MapArt() {
  return (
    <>
      <rect x={-2000} y={-2000} width={WORLD + 4000} height={WORLD + 4000} fill="#f4f4f5" />
      {/* soft land-use patches */}
      {PATCHES.map((patch, index) => (
        <path key={index} d={patch.d} fill={patch.fill} />
      ))}
      {/* water */}
      {PONDS.map((d, index) => (
        <path key={index} d={d} fill="#8fd8ee" />
      ))}
      <g fill="none" stroke="#8fd8ee" strokeLinecap="round">
        <path d={RIVER} strokeWidth={9} />
        {CANALS.map((d, index) => (
          <path key={index} d={d} strokeWidth={4} />
        ))}
      </g>
      {/* streets */}
      <g stroke="#e3e6ea" strokeLinecap="round">
        {V_ROADS.map((road) => (
          <line key={road.name} x1={road.x} y1={-20} x2={road.x} y2={WORLD + 20} strokeWidth={road.major ? 9 : 5} />
        ))}
        {H_ROADS.map((road) => (
          <line key={road.name} x1={-20} y1={road.y} x2={WORLD + 20} y2={road.y} strokeWidth={road.major ? 9 : 5} />
        ))}
      </g>
      <g stroke="#ffffff" strokeLinecap="round">
        {V_ROADS.map((road) => (
          <line key={road.name} x1={road.x} y1={-20} x2={road.x} y2={WORLD + 20} strokeWidth={road.major ? 6 : 3} />
        ))}
        {H_ROADS.map((road) => (
          <line key={road.name} x1={-20} y1={road.y} x2={WORLD + 20} y2={road.y} strokeWidth={road.major ? 6 : 3} />
        ))}
      </g>
      {/* highway */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={TOLL_RAMP} stroke="#7d8db3" strokeWidth={20} />
        <path d={TOLL} stroke="#7d8db3" strokeWidth={22} />
        <path d={TOLL_RAMP} stroke="#a9b7d6" strokeWidth={15} />
        <path d={TOLL} stroke="#a9b7d6" strokeWidth={17} />
      </g>
      <path id="toll-label" d={TOLL} fill="none" />

      {/* labels */}
      <g
        fontFamily="inherit"
        fontSize={10}
        fill="#8a93a0"
        stroke="#f4f4f5"
        strokeWidth={3}
        style={{ paintOrder: "stroke" }}
        textAnchor="middle"
      >
        {V_ROADS.flatMap((road) =>
          [240, 720, 1190].map((y) => (
            <text key={`${road.name}-${y}`} transform={`translate(${road.x + 3.5} ${y}) rotate(-90)`}>
              {road.name}
            </text>
          )),
        )}
        {H_ROADS.flatMap((road) =>
          [215, 675, 1135].map((x) => (
            <text key={`${road.name}-${x}`} x={x} y={road.y + 3.5}>
              {road.name}
            </text>
          )),
        )}
        <text x={1015} y={455} fill="#4aa9c9" fontStyle="italic" transform="rotate(-72 1015 455)">
          Kali Sunter
        </text>
      </g>
      <text
        fontSize={24}
        fontWeight={500}
        fill="#1f2937"
        stroke="#ffffff"
        strokeWidth={6}
        style={{ paintOrder: "stroke" }}
      >
        {[0.1, 0.36, 0.62, 0.88].map((offset) => (
          <textPath key={offset} href="#toll-label" startOffset={`${offset * 100}%`}>
            Jakarta Outer Ring Rd E
          </textPath>
        ))}
      </text>
      <g fontSize={13} fontWeight={600} letterSpacing="0.18em" fill="#b4bac3" textAnchor="middle">
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
          <circle r={9} fill={POI_COLORS[poi.kind]} stroke="#fff" strokeWidth={2} opacity={0.9} />
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
            <circle r={18} fill="var(--brand)" opacity={0.18} className="map-user-pulse" />
            <circle r={9} fill="var(--brand)" stroke="#fff" strokeWidth={3} />
          </g>
        </g>
      </svg>
    </div>
  );
}

