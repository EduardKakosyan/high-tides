// Shared motion vocabulary — the ONLY scroll animation on the site outside
// the hero. Three primitives, applied declaratively via data attributes so
// every section speaks the same, quiet language:
//
//   data-reveal   — fade-and-rise, once, on first entering the viewport
//   data-stagger  — children fade-and-rise in sequence (quick-facts, steps)
//   data-parallax — the image inside drifts slower than scroll (large photos)
//
// Restraint rules (locked in NOTES.md): no other pins, no scrubbing, no
// bespoke choreography here — the hero owns the page's entire motion budget.
//
// prefers-reduced-motion: everything inside gsap.matchMedia simply never
// runs — the site is the calm static version.
//
// ClientRouter lifecycle: init on astro:page-load, full revert on
// astro:before-swap so ScrollTriggers never leak across navigations.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let mm: gsap.MatchMedia | null = null;

function init(): void {
  mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        autoAlpha: 0,
        y: 24,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

    document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
      gsap.from(group.children, {
        autoAlpha: 0,
        y: 18,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: { trigger: group, start: 'top 88%', once: true },
      });
    });

    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((frame) => {
      const img = frame.querySelector('img');
      if (!img) return;
      // Slight overscale so the drift never exposes the frame's edges.
      gsap.fromTo(
        img,
        { yPercent: -5, scale: 1.12 },
        {
          yPercent: 5,
          scale: 1.12,
          ease: 'none',
          scrollTrigger: {
            trigger: frame,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    });
  });
}

document.addEventListener('astro:page-load', () => {
  mm?.revert();
  init();
});

document.addEventListener('astro:before-swap', () => {
  mm?.revert();
  mm = null;
});
