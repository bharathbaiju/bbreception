import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Wraps children in a card that tilts toward the cursor in 3D (mouse only —
 * touch devices get no pointermove "hover", so they simply see no tilt) with
 * a soft light-glare following the pointer for a glass/foil feel.
 */
export function Tilt({
  children,
  className,
  max = 10,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * max * 2;
    const rx = (0.5 - py) * max * 2;
    card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(12px)`;
    card.style.boxShadow = "0 28px 45px -18px oklch(0.32 0.06 60 / 0.45)";
    if (glare) {
      glare.style.opacity = "1";
      glare.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, oklch(1 0 0 / 0.4), transparent 60%)`;
    }
  };

  const handleLeave = () => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (card) {
      card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)";
      card.style.boxShadow = "";
    }
    if (glare) glare.style.opacity = "0";
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn(
        "relative transition-[transform,box-shadow] duration-500 ease-out will-change-transform",
        className,
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
        style={{ transform: "translateZ(1px)" }}
      />
    </div>
  );
}
