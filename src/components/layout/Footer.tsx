import { Logo } from "@/components/ui/Logo";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-deep/10 bg-foam py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-end sm:px-10">
        <div className="flex flex-col gap-1">
          <Logo className="text-2xl text-deep" />
          <p className="text-sm text-teal-900/70">{site.tagline}</p>
        </div>
        <div className="flex flex-col gap-1 text-sm text-teal-900/80 sm:items-end">
          <a
            href={`mailto:${site.email}`}
            className="underline-offset-4 hover:underline"
          >
            {site.email}
          </a>
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="underline-offset-4 hover:underline"
          >
            {site.phone}
          </a>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-teal-700">
            &copy; {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
