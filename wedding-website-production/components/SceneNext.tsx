import Link from "next/link";

interface Props {
  href: string;
  label: string;
}

export default function SceneNext({ href, label }: Props) {
  return (
    <div
      className="flex justify-end px-6 py-16"
      style={{ borderTop: "1.5px dashed rgba(26,21,16,0.15)" }}
    >
      <Link
        href={href}
        className="group flex flex-col items-end gap-1"
        style={{ textDecoration: "none" }}
      >
        <span
          style={{
            fontFamily: "var(--font-se)",
            fontSize: "0.78rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(26,21,16,0.4)",
          }}
        >
          next scene
        </span>
        <span
          className="font-display flex items-center gap-3 transition-gap"
          style={{
            fontSize: "clamp(2.34rem, 6.5vw, 3.9rem)",
            color: "var(--black)",
            lineHeight: 1,
          }}
        >
          {label}
          <span
            className="inline-block transition-transform duration-300 group-hover:translate-x-2"
            style={{ color: "var(--pink)" }}
          >
            →
          </span>
        </span>
      </Link>
    </div>
  );
}
