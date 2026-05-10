interface ScrollIndicatorProps {
  label?: string;
}

export function ScrollIndicator({ label = "Scroll" }: ScrollIndicatorProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-foam/80">
      <span className="text-[10px] uppercase tracking-[0.4em]">{label}</span>
      <span
        aria-hidden
        className="block h-12 w-px animate-[scrollHint_2.4s_ease-in-out_infinite] bg-foam/60"
      />
      <style>{`
        @keyframes scrollHint {
          0% { transform: scaleY(0); transform-origin: top; }
          40% { transform: scaleY(1); transform-origin: top; }
          60% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[scrollHint_2\\.4s_ease-in-out_infinite\\] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
