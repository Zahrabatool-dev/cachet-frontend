export function PageBackground({ fixed = true }: { fixed?: boolean }) {
  return (
    <div className={`${fixed ? "fixed" : "absolute"} inset-0 -z-10 overflow-hidden pointer-events-none`}>
      <div className="absolute inset-0 vault-grid" />
      <div className="absolute inset-0 scatter-dots opacity-50" />
      <div className="guilloche-hero" />
      <div className="radar-sweep motion-reduce:hidden" />
      <div className="absolute inset-0 vault-glow-strong" />
      <div className="absolute inset-0 vault-beam" />
      <div className="absolute inset-0 vault-noise" />
    </div>
  );
}