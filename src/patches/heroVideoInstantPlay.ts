/* Prompt 2A: Hero video instant play (additive, no markup edits) */

export function initHeroVideoInstantPlay() {
  const run = () => {
    const video =
      document.querySelector('#hero video, .hero video, [data-hero] video') as HTMLVideoElement ||
      document.querySelector('video') as HTMLVideoElement;

    if (!video) return;

    const heroContainer =
      video.closest('#hero, .hero, [data-hero]') ||
      video.parentElement ||
      document.body;

    heroContainer.classList.add('dandle-hero-video');
    video.classList.add('dandle-hero-video-el');

    // Fastest autoplay setup
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;

    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'auto');

    // Poster strategy (avoid black flash)
    const posterAttr = (video.getAttribute('poster') || '').trim();
    if (!posterAttr) {
      const fallbackImg = heroContainer.querySelector('img');
      const posterUrl =
        (fallbackImg && ((fallbackImg as HTMLImageElement).currentSrc || (fallbackImg as HTMLImageElement).src)) ||
        '/dandle-og-image.jpg';

      if (posterUrl) video.poster = posterUrl;
    }

    // Start almost invisible until frames are ready
    video.style.opacity = '0.001';

    const markReady = () => video.classList.add('is-ready');
    video.addEventListener('loadeddata', markReady, { once: true });
    video.addEventListener('canplay', markReady, { once: true });

    // Force first frame sooner
    try {
      video.load();
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch (_) {}
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
}
