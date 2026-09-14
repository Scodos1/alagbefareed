type AfLogoProps = { className?: string };

export default function AfLogo({ className = '' }: AfLogoProps) {
  return (
    <img
      src="/af-logo.png"
      alt="AF"
      className={`object-contain ${className}`}
      draggable={false}
    />
  );
}
