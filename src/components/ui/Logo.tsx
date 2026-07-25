interface LogoProps {
  /** Height in pixels — width scales proportionally. Default 36 */
  size?: number;
  className?: string;
}

/**
 * SmartAbility innovation logo — transparent SVG, scales perfectly at any size.
 */
export default function Logo({ size = 36, className = '' }: LogoProps) {
  return (
    <img
      src="/smartability-logo.png"
      alt="SmartAbility Innovation logo"
      width={size}
      height={size}
      className={className}
      draggable={false}
    />
  );
}
