// Renders a single-colour Figma SVG asset as a mask so it can take currentColor.
export function MaskIcon({ name, size = 20, className = "" }) {
  return (
    <span
      className={`wj-mask-icon ${className}`}
      style={{
        "--icon": `url(${import.meta.env.BASE_URL}figma-assets/v3/${name})`,
        width: size,
        height: size,
      }}
      aria-hidden="true"
    />
  );
}
