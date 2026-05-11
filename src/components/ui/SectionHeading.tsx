import { RevealOnScroll } from "./RevealOnScroll";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  id,
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <RevealOnScroll
      className={`flex max-w-2xl flex-col gap-4 ${alignment}`}
      direction="up"
    >
      {eyebrow ? (
        <p
          id={id ? `${id}-eyebrow` : undefined}
          className="text-xs uppercase tracking-[0.4em] text-navy-700"
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="font-display text-display-lg leading-[1.05] text-deep"
      >
        {title}
      </h2>
      {description ? (
        <p className="text-pretty text-base leading-relaxed text-navy-900/80 sm:text-lg">
          {description}
        </p>
      ) : null}
    </RevealOnScroll>
  );
}
