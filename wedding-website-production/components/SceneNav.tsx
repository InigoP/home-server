import Link from "next/link";

interface SceneRef {
  href: string;
  label: string;
}

interface Props {
  prev?: SceneRef;
  next?: SceneRef;
}

const kickerStyle = {
  fontFamily: "var(--font-se)",
  fontSize: "0.78rem",
  letterSpacing: "0.25em",
  textTransform: "uppercase" as const,
  color: "rgba(26,21,16,0.4)",
};

const labelStyle = {
  fontSize: "clamp(2.34rem, 6.5vw, 3.9rem)",
  color: "var(--black)",
  lineHeight: 1,
};

export default function SceneNav({ prev, next }: Props) {
  return (
    <div
      className="flex justify-between items-start gap-6 px-6 py-16"
      style={{ borderTop: "1.5px dashed rgba(26,21,16,0.15)" }}
    >
      {prev ? (
        <Link
          href={prev.href}
          data-direction="back"
          className="group flex flex-col items-start gap-1"
          style={{ textDecoration: "none" }}
        >
          <span style={kickerStyle}>previous scene</span>
          <span className="font-display flex items-center gap-3" style={labelStyle}>
            <span
              className="inline-block transition-transform duration-300 group-hover:-translate-x-2"
              style={{ color: "var(--pink)" }}
            >
              ←
            </span>
            {prev.label}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col items-end gap-1"
          style={{ textDecoration: "none" }}
        >
          <span style={kickerStyle}>next scene</span>
          <span className="font-display flex items-center gap-3" style={labelStyle}>
            {next.label}
            <span
              className="inline-block transition-transform duration-300 group-hover:translate-x-2"
              style={{ color: "var(--pink)" }}
            >
              →
            </span>
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
