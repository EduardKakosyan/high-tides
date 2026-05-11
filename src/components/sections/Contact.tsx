import { Mail, Phone } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { site } from "@/lib/site";

export function Contact() {
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(site.inquirySubject)}`;
  const tel = `tel:${site.phone.replace(/\s/g, "")}`;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-navy-900 py-28 text-foam sm:py-40"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10 px-6 text-center sm:px-10">
        <RevealOnScroll
          direction="up"
          className="flex flex-col items-center gap-6"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-navy-300">
            Write to us
          </p>
          <h2
            id="contact-heading"
            className="font-display text-display-xl leading-[1.02] text-foam"
          >
            Say hello, ask anything
          </h2>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-foam/85">
            One of us reads every email and writes back within a day. Dates, how
            many of you, what you&rsquo;re hoping for — that&rsquo;s plenty to
            start. Questions about the kitchen, the dog rules, or whether the
            lobster suppers are still on? Ask.
          </p>
        </RevealOnScroll>

        <RevealOnScroll
          direction="up"
          delay={0.1}
          className="flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href={mailto}
            className="inline-flex items-center gap-3 rounded-full bg-foam px-8 py-4 text-sm font-medium uppercase tracking-[0.25em] text-deep transition-transform duration-300 hover:scale-[1.02] hover:bg-sand-50"
          >
            <Mail className="size-4" aria-hidden />
            Email us
          </a>
          <a
            href={tel}
            className="inline-flex items-center gap-3 rounded-full border border-foam/40 px-8 py-4 text-sm font-medium uppercase tracking-[0.25em] text-foam transition-colors duration-300 hover:bg-foam/10"
          >
            <Phone className="size-4" aria-hidden />
            Call us
          </a>
        </RevealOnScroll>

        <RevealOnScroll
          direction="up"
          delay={0.2}
          className="flex flex-col items-center gap-1 text-sm text-foam/75"
        >
          <a href={mailto} className="underline-offset-4 hover:underline">
            {site.email}
          </a>
          <a href={tel} className="underline-offset-4 hover:underline">
            {site.phone}
          </a>
        </RevealOnScroll>
      </div>
    </section>
  );
}
