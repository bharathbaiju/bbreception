import { lazy, Suspense, useEffect, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";

const RingsScene = lazy(() => import("./RingsScene"));

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function Scene() {
  const reducedMotion = useReducedMotion();
  return <RingsScene reducedMotion={reducedMotion} />;
}

/** Floating gold rings — the hero's 3D centerpiece. Renders only after the
 * gate opens (so guests who never open the invitation never pay for the
 * three.js download), client-only (WebGL can't run during SSR), and falls
 * back to a plain gold glow on the server pass / while the chunk loads so
 * there's no layout jump. */
export function Rings3D({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ClientOnly
        fallback={<div className="h-full w-full rounded-full" style={{ background: "var(--gradient-gold)", opacity: 0.25, filter: "blur(30px)" }} />}
      >
        <Suspense
          fallback={<div className="h-full w-full rounded-full" style={{ background: "var(--gradient-gold)", opacity: 0.25, filter: "blur(30px)" }} />}
        >
          <Scene />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
