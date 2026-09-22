'use client';

import React, { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ZoomIn, ZoomOut, Maximize2, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type MapLevel = 1 | 2;

const MAPS: Record<MapLevel, { src: string; alt: string }> = {
  1: {
    src: '/tangle-tail-town-map.jpg',
    alt: 'Illustrated map of Tangle Tail Town, Level 1.',
  },
  2: {
    src: '/maps/tangle-tail-town-level-2.jpg',
    alt: 'Illustrated map of Tangle Tail Town, Level 2.',
  },
};

interface Hotspot {
  id: string;
  name: string;
  description: string;
  /** position as percentage of the map, 0-100 */
  x: number;
  y: number;
  /** optional route to navigate to on click */
  href?: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'sweet-paws',
    name: 'Sweet Paws Treats and Ice Cream',
    description: 'The cupcake shop in the heart of town — sweets, treats, and ice cream.',
    x: 42,
    y: 38,
  },
  {
    id: 'teapot-house',
    name: 'Teapot House',
    description: 'A cozy little home shaped like a giant painted teapot.',
    x: 16,
    y: 27,
  },
  {
    id: 'mushroom-hollow',
    name: 'Mushroom Hollow Homes',
    description: 'Toadstool cottages where the smallest woodland folk live.',
    x: 42,
    y: 80,
  },
  {
    id: 'gazelles-garden',
    name: "Gazelle's Garden",
    description: 'Neat rows of veggies and flowers tended by Gazelle.',
    x: 24,
    y: 63,
  },
  {
    id: 'jakes-bakery',
    name: "Jake's Bakery",
    description: 'Only bakery in Tangle Town — owned by Jake the Snake.',
    x: 54,
    y: 72,
    href: '/stories/ake-missing-recipe',
  },
  {
    id: 'boat-house',
    name: 'Boat House',
    description: 'A snug little houseboat bobbing on the duck pond.',
    x: 86,
    y: 76,
  },
  {
    id: 'wise-owl-library',
    name: 'Wise Owl Library',
    description: 'Shelves of books tucked inside the great old oak tree.',
    x: 82,
    y: 46,
  },
  {
    id: 'willas-nest',
    name: "Willa's Nest",
    description: "Willa the bird's twiggy home high in the treetops.",
    x: 80,
    y: 11,
  },
  {
    id: 'acorn-store',
    name: 'Acorn Store',
    description: "Zap the Squirrel's shop — acorns, maps, and snacks.",
    x: 91,
    y: 30,
    href: '/stories/ap-flapping-cap',
  },
];

const LEVEL2_HOTSPOTS: Hotspot[] = [
  {
    id: 'tangle-town-woods',
    name: 'Tangle Town Woods',
    description: 'A peaceful forest path winding through the tall autumn trees.',
    x: 20,
    y: 29,
  },
  {
    id: 'treehouse-lane',
    name: 'Treehouse Lane',
    description: 'Rope bridges and cozy treehouses high up in the old oaks.',
    x: 71,
    y: 33,
  },
  {
    id: 'cozy-cottage-lane',
    name: 'Cozy Cottage Lane',
    description: 'A winding row of colorful cottages where friends live.',
    x: 35,
    y: 58,
  },
  {
    id: 'bell-tower-square',
    name: 'Bell Tower Square',
    description: 'The town center gathered around the famous clock and bell tower.',
    x: 51,
    y: 58,
  },
  {
    id: 'tangle-tail-park',
    name: 'Tangle Tail Park',
    description: 'A sunny playground with swings and a slide for everyone.',
    x: 70,
    y: 56,
  },
];

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const SCALE_STEP = 0.5;

interface Signpost {
  id: string;
  label: string;
  x: number;
  y: number;
  /** which arrow direction to show */
  arrow: 'up-right' | 'right';
  /** show a red locator dot before the label */
  dot?: boolean;
}

const SIGNS: Signpost[] = [
  {
    id: 'woods',
    label: 'Tangle Town Woods this way',
    x: 52,
    y: 30,
    arrow: 'up-right',
    dot: true,
  },
  {
    id: 'park',
    label: 'To the Tangle Tail Park',
    x: 64,
    y: 39,
    arrow: 'right',
  },
];

export const TangleTailTownMap: React.FC = () => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [level, setLevel] = useState<MapLevel>(1);

  const hotspots = level === 1 ? HOTSPOTS : LEVEL2_HOTSPOTS;

  const switchLevel = (next: MapLevel) => {
    if (next === level) return;
    setLevel(next);
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setActiveId(null);
  };

  const dragState = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  }>({ dragging: false, startX: 0, startY: 0, originX: 0, originY: 0, moved: false });

  const zoomIn = () =>
    setScale((s) => Math.min(MAX_SCALE, +(s + SCALE_STEP).toFixed(2)));
  const zoomOut = () =>
    setScale((s) => {
      const next = Math.max(MIN_SCALE, +(s - SCALE_STEP).toFixed(2));
      if (next === MIN_SCALE) setOffset({ x: 0, y: 0 });
      return next;
    });
  const reset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setActiveId(null);
  };

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (scale <= 1) return;
      dragState.current = {
        dragging: true,
        startX: e.clientX,
        startY: e.clientY,
        originX: offset.x,
        originY: offset.y,
        moved: false,
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [scale, offset],
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragState.current;
    if (!d.dragging) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) d.moved = true;
    setOffset({ x: d.originX + dx, y: d.originY + dy });
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragState.current.dragging = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* no-op */
    }
  }, []);

  const handleHotspotActivate = (id: string) => {
    // Ignore the click that ends a pan gesture
    if (dragState.current.moved) return;
    setActiveId((current) => (current === id ? null : id));
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Level toggle */}
      <div
        role="group"
        aria-label="Choose map level"
        className="mb-3 flex items-center justify-center gap-2"
      >
        {([1, 2] as const).map((l) => (
          <button
            key={l}
            type="button"
            aria-pressed={level === l}
            onClick={() => switchLevel(l)}
            className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300 ${
              level === l
                ? 'bg-purple-500 text-white shadow'
                : 'border border-amber-300/80 bg-white text-gray-600 hover:bg-amber-50'
            }`}
          >
            Map {l}
          </button>
        ))}
      </div>

      {/* Parchment / watercolor frame */}
      <div className="relative rounded-3xl border-4 border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50 p-2 shadow-2xl shadow-amber-900/20 sm:p-3">
        <div className="rounded-2xl border border-amber-300/60 p-1">
          {/* Zoom / pan controls */}
          <div className="pointer-events-none absolute right-5 top-5 z-20 flex flex-col gap-2 sm:right-6 sm:top-6">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={zoomIn}
              disabled={scale >= MAX_SCALE}
              aria-label="Zoom in"
              className="pointer-events-auto rounded-full border border-amber-300/80 bg-white/90 text-amber-900 shadow-md hover:bg-white"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={zoomOut}
              disabled={scale <= MIN_SCALE}
              aria-label="Zoom out"
              className="pointer-events-auto rounded-full border border-amber-300/80 bg-white/90 text-amber-900 shadow-md hover:bg-white"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={reset}
              aria-label="Reset view"
              className="pointer-events-auto rounded-full border border-amber-300/80 bg-white/90 text-amber-900 shadow-md hover:bg-white"
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Map viewport */}
          <div
            className="relative overflow-hidden rounded-xl bg-amber-100/40"
            style={{ touchAction: scale > 1 ? 'none' : 'auto' }}
          >
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="relative origin-center select-none"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transition: dragState.current.dragging
                  ? 'none'
                  : 'transform 0.2s ease-out',
                cursor: scale > 1 ? 'grab' : 'default',
              }}
            >
              <img
                src={MAPS[level].src}
                alt={MAPS[level].alt}
                className="block w-full"
                draggable={false}
              />

              {/* Hotspots */}
              {hotspots.map((spot) => {
                const isActive = activeId === spot.id;
                const showAbove = spot.y > 55;
                return (
                  <div
                    key={spot.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    onMouseEnter={() => setActiveId(spot.id)}
                    onMouseLeave={() =>
                      setActiveId((current) => (current === spot.id ? null : current))
                    }
                  >
                    <button
                      type="button"
                      onClick={() => handleHotspotActivate(spot.id)}
                      aria-label={spot.name}
                      className={`group flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-rose-500/90 shadow-lg outline-none ring-rose-300 transition-transform hover:scale-125 focus-visible:ring-4 ${
                        isActive ? 'scale-125 bg-rose-600' : ''
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-white" />
                      <span className="absolute inline-flex h-6 w-6 animate-ping rounded-full bg-rose-400/50" />
                    </button>

                    {/* Tooltip */}
                    {isActive && (
                      <div
                        className={`absolute left-1/2 z-30 w-52 -translate-x-1/2 ${
                          showAbove ? 'bottom-8' : 'top-8'
                        }`}
                        role="tooltip"
                      >
                        <div className="rounded-xl border border-amber-200 bg-white/95 p-3 text-left shadow-xl backdrop-blur">
                          <p className="font-serif text-sm font-bold text-amber-900">
                            {spot.name}
                          </p>
                          <p className="mt-0.5 text-xs leading-snug text-amber-800/80">
                            {spot.description}
                          </p>
                          {spot.href && (
                            <Link
                              to={spot.href}
                              className="mt-2 inline-block text-xs font-semibold text-rose-600 underline underline-offset-2 hover:text-rose-700"
                            >
                              Visit this story →
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Directional signposts — red dot with hover tooltip (Level 1 only) */}
              {level === 1 && SIGNS.map((sign) => {
                const isActive = activeId === sign.id;
                const showAbove = sign.y > 55;
                return (
                  <div
                    key={sign.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${sign.x}%`, top: `${sign.y}%` }}
                    onMouseEnter={() => setActiveId(sign.id)}
                    onMouseLeave={() =>
                      setActiveId((current) => (current === sign.id ? null : current))
                    }
                  >
                    <button
                      type="button"
                      onClick={() => handleHotspotActivate(sign.id)}
                      aria-label={sign.label}
                      className={`group flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-rose-500/90 shadow-lg outline-none ring-rose-300 transition-transform hover:scale-125 focus-visible:ring-4 ${
                        isActive ? 'scale-125 bg-rose-600' : ''
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-white" />
                      <span className="absolute inline-flex h-6 w-6 animate-ping rounded-full bg-rose-400/50" />
                    </button>

                    {/* Tooltip with directional arrow */}
                    {isActive && (
                      <div
                        className={`absolute left-1/2 z-30 w-52 -translate-x-1/2 ${
                          showAbove ? 'bottom-8' : 'top-8'
                        }`}
                        role="tooltip"
                      >
                        <div className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-white/95 p-3 text-left shadow-xl backdrop-blur">
                          <span className="font-serif text-sm font-bold text-amber-900">
                            {sign.label}
                          </span>
                          {sign.arrow === 'up-right' ? (
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-rose-600" />
                          ) : (
                            <ArrowRight className="h-4 w-4 shrink-0 text-rose-600" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-2 rounded-full bg-amber-100/60 px-4 py-2 text-center font-serif text-sm text-amber-900">
          <span className="font-semibold">Est. 1892</span>
          <span className="text-amber-400">•</span>
          <span>Cozy</span>
          <span className="text-amber-400">•</span>
          <span>Whimsical</span>
        </div>
      </div>
    </div>
  );
};

export default TangleTailTownMap;
