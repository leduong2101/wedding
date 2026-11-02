// Motion is progressive enhancement: content stays available without this module.
export function revealOnScroll() {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.08 });

  const elements = document.querySelectorAll('.section-heading, .family-grid, .event-intro, .event-card, .gallery-heading, .gallery-grid figure, .gift-card, .thanks h2');
  elements.forEach(element => {
    observer.observe(element);
    element.classList.add('reveal');
  });
}

export async function dismissCover(cover, onComplete) {
  cover.classList.add('is-opening');
  cover.setAttribute('aria-hidden', 'true');
  cover.inert = true;
  try {
    const animations = cover.getAnimations?.({ subtree: true }) ?? [];
    await Promise.allSettled(animations.map(animation => animation.finished));
  } finally {
    cover.hidden = true;
    onComplete();
  }
}
