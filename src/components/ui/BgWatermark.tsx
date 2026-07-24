/**
 * Fixed, centred, transparent logo watermark — rendered behind all page content.
 * Use inside any page/layout root that doesn't already inherit one from a layout wrapper.
 */
export default function BgWatermark() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
      <img
        src="/smartability-logo.png"
        alt=""
        aria-hidden="true"
        className="h-[520px] w-[520px] select-none object-contain opacity-[0.04] dark:opacity-[0.06]"
      />
    </div>
  );
}
