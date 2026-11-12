import { useId } from "react";

/**
 * The GCI mark: an edge-on disc (the economy) crossed by a lobe above (public mandate)
 * and a lobe below (institutional capital), meeting at a gold core (the apex node).
 * Same geometry as brand/logo/gci-mark.svg. Depth comes from masks, so it sits on any background.
 */
const CX = 100;
const LOBE_RX = 31;
const LOBE_RY = 42;
const DISC_RX = 94;
const DISC_RY = 14;
const STROKE = 6.2;
const CORE = 12.5;
const GAP = STROKE + 6;
const FRONT = `M${CX - DISC_RX},${CX} A${DISC_RX},${DISC_RY} 0 0 0 ${CX + DISC_RX},${CX}`;
const BACK = `M${CX - DISC_RX},${CX} A${DISC_RX},${DISC_RY} 0 0 1 ${CX + DISC_RX},${CX}`;

function Lobes({ stroke, width }: { stroke: string; width: number }) {
  return (
    <>
      <ellipse cx={CX} cy={CX - LOBE_RY} rx={LOBE_RX} ry={LOBE_RY} fill="none" stroke={stroke} strokeWidth={width} />
      <ellipse cx={CX} cy={CX + LOBE_RY} rx={LOBE_RX} ry={LOBE_RY} fill="none" stroke={stroke} strokeWidth={width} />
    </>
  );
}

export function GciMark({
  size = 28,
  lobe = "#C8A24A",
  disc = "#C9CED6",
  core = "#C8A24A",
  className,
}: {
  size?: number;
  lobe?: string;
  disc?: string;
  core?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const knockout = <circle cx={CX} cy={CX} r={CORE + 6.5} fill="black" />;
  const maskBox = { maskUnits: "userSpaceOnUse" as const, x: -20, y: -20, width: 240, height: 240 };

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      aria-hidden
      focusable="false"
    >
      <defs>
        <mask id={`${id}-back`} {...maskBox}>
          <rect x={-20} y={-20} width={240} height={240} fill="white" />
          <Lobes stroke="black" width={GAP} />
          {knockout}
        </mask>
        <mask id={`${id}-lobes`} {...maskBox}>
          <rect x={-20} y={-20} width={240} height={240} fill="white" />
          <path d={FRONT} fill="none" stroke="black" strokeWidth={GAP} />
          {knockout}
          <ellipse cx={CX} cy={CX} rx={CORE + 15} ry={CORE + 6.5} fill="black" />
        </mask>
        <mask id={`${id}-front`} {...maskBox}>
          <rect x={-20} y={-20} width={240} height={240} fill="white" />
          {knockout}
        </mask>
      </defs>
      <g transform="rotate(-12 100 100)">
        <path d={BACK} fill="none" stroke={disc} strokeWidth={STROKE} mask={`url(#${id}-back)`} />
        <g mask={`url(#${id}-lobes)`}>
          <Lobes stroke={lobe} width={STROKE} />
        </g>
        <path d={FRONT} fill="none" stroke={disc} strokeWidth={STROKE} mask={`url(#${id}-front)`} />
        <circle cx={CX} cy={CX} r={CORE} fill={core} />
      </g>
    </svg>
  );
}
