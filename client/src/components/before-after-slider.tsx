import { useState, useRef, useCallback, useEffect } from "react";
import { GripVertical } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Avant",
  afterLabel = "Après",
  alt = "",
  className = "",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    updatePosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    updatePosition(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      updatePosition(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      updatePosition(e.touches[0].clientX);
    };
    const handleEnd = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleEnd);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [updatePosition]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + 5));
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none rounded-lg cursor-ew-resize ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      data-testid="before-after-slider"
    >
      <img
        src={afterImage}
        alt={`${afterLabel} - ${alt}`}
        className="block w-full h-full object-cover pointer-events-none"
        draggable={false}
        loading="lazy"
        decoding="async"
      />

      <div
        className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
        style={{ width: `${position}%` }}
      >
        <img
          src={beforeImage}
          alt={`${beforeLabel} - ${alt}`}
          className="block h-full object-cover pointer-events-none"
          style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%", maxWidth: "none" }}
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full pointer-events-none">
        {beforeLabel}
      </div>
      <div className="absolute top-3 right-3 bg-auto-red text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full pointer-events-none">
        {afterLabel}
      </div>

      <div
        className="absolute inset-y-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `calc(${position}% - 2px)` }}
      />

      <button
        type="button"
        role="slider"
        aria-label="Glisser pour comparer avant et après"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-ew-resize ring-2 ring-auto-red focus:outline-none focus:ring-4 focus:ring-auto-red/50"
        style={{ left: `${position}%` }}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleMouseDown(e);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          handleTouchStart(e);
        }}
        data-testid="slider-handle"
      >
        <GripVertical className="w-4 h-4 sm:w-5 sm:h-5 text-auto-red" />
      </button>
    </div>
  );
}
