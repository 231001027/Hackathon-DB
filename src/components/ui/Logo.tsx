interface LogoProps {
  /** Height in pixels — width scales proportionally. Default 36 */
  size?: number;
  className?: string;
}

/**
 * SmartAbility hackathon logo — transparent SVG, scales perfectly at any size.
 */
export default function Logo({ size = 36, className = '' }: LogoProps) {
  return (
    <img
      src="/smartability-logo.png"
      alt="SmartAbility Hackathon logo"
      width={size}
      height={size}
      className={className}
      draggable={false}
    />
  );
}
