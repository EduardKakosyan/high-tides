"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const sections = [
  { id: "about", label: "The place" },
  { id: "gallery", label: "Gallery" },
  { id: "amenities", label: "Amenities" },
  { id: "location", label: "Location" },
  { id: "contact", label: "Contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500 data-[scrolled=true]:bg-foam/85 data-[scrolled=true]:backdrop-blur-md data-[scrolled=true]:shadow-[0_1px_0_0_rgba(14,31,36,0.06)]"
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 sm:px-10"
      >
        <a
          href="#top"
          className="font-display text-xl tracking-tight text-foam data-[scrolled=true]:text-deep transition-colors duration-500"
          data-scrolled={scrolled}
        >
          {site.name}
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                data-scrolled={scrolled}
                className="text-sm tracking-wide text-foam/85 hover:text-foam data-[scrolled=true]:text-sea-900/80 data-[scrolled=true]:hover:text-deep transition-colors duration-500"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={`mailto:${site.email}?subject=${encodeURIComponent(site.inquirySubject)}`}
          data-scrolled={scrolled}
          className="rounded-full border border-foam/40 px-4 py-2 text-xs uppercase tracking-[0.25em] text-foam transition-colors duration-500 hover:bg-foam hover:text-deep data-[scrolled=true]:border-deep/20 data-[scrolled=true]:text-deep data-[scrolled=true]:hover:bg-deep data-[scrolled=true]:hover:text-foam"
        >
          Enquire
        </a>
      </nav>
    </header>
  );
}
