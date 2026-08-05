export function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-24 -left-24 h-72 w-72 sm:-top-32 sm:-left-32 sm:h-96 sm:w-96 rounded-full bg-emerald-900/[0.14] blur-3xl" />
      <div className="absolute -bottom-24 -right-16 h-80 w-80 sm:-bottom-32 sm:-right-24 sm:h-[28rem] sm:w-[28rem] rounded-full bg-emerald-700/[0.13] blur-3xl" />

      <div
        className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 pointer-events-none motion-reduce:hidden scale-[0.7] sm:scale-100"
        aria-hidden="true"
      >
        <div className="dial-ring dial-ring-outer" />
        <div className="dial-ring dial-ring-inner" />
        <div className="dial-tick dial-tick-0" />
        <div className="dial-tick dial-tick-1" />
        <div className="dial-tick dial-tick-2" />
        <div className="dial-tick dial-tick-3" />
      </div>

      <svg className="absolute inset-0 h-full w-full opacity-[0.44]" aria-hidden="true">
        <defs>
          <pattern id="dot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" className="fill-neutral-500/45" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_75%)]" />
    </div>
  );
}