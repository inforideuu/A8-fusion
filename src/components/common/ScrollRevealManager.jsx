import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Universal Site-Wide ScrollRevealManager
 * 
 * Provides end-to-end, ultra-smooth scroll reveal transitions across the entire website:
 * 1. Sections & Landmarks: All <section> tags, <footer>, and standalone page headers.
 * 2. Section Headers: Eyebrow badges, display titles, and subheadings float smoothly into place.
 * 3. Cards & Grid Items: Direct items in any grid (services, platforms, industries, insights, stats)
 *    fade and slide up with a subtle staggered delay (0ms, 75ms, 150ms...) for high-end polish.
 * 4. Lazy Route Safety: Uses MutationObserver to capture lazy-loaded routes and components whenever they mount.
 * 5. Above-the-Fold Protection: Any item already in the viewport on load is revealed immediately without delay,
 *    preventing any flashing, layout shifts, or blank hero sections.
 * 6. Interaction & Hover Safety: Cleans up reveal classes after entrance so that all Tailwind hover effects
 *    (e.g., hover:-translate-y-1, hover:shadow-xl) operate natively without CSS conflicts.
 * 7. Accessibility: Full compliance with prefers-reduced-motion.
 */
export default function ScrollRevealManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fast-path for reduced motion or non-supporting environments
    if (!('IntersectionObserver' in window) || isReducedMotion) {
      document.querySelectorAll('.reveal-init, .reveal-3d').forEach((el) => {
        el.classList.add('revealed');
        el.setAttribute('data-revealed', 'true');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            target.setAttribute('data-revealed', 'true');
            target.classList.add('revealed');
            observer.unobserve(target);

            // Clean up transition locks after the entrance completes
            // This ensures Tailwind hover styles (hover:-translate-y-1, etc.) work with zero conflicts
            const delayStr = target.getAttribute('data-reveal-delay') || '0ms';
            const delayMs = parseInt(delayStr, 10) || 0;
            const timer = setTimeout(() => {
              target.classList.remove('reveal-init');
              target.classList.remove('revealed');
              target.classList.remove('reveal-3d');
              target.style.transitionDelay = '';
            }, 750 + delayMs);

            target._revealTimer = timer;
          }
        });
      },
      {
        threshold: 0.06,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    const scanAndObserve = () => {
      const windowHeight = window.innerHeight;
      const elementsToObserve = new Set();

      // 1. Target all <section> elements
      const sections = document.querySelectorAll('section');
      sections.forEach((section) => {
        if (
          section.closest('nav') ||
          section.closest('#navbar') ||
          section.closest('.fixed') ||
          section.hasAttribute('data-no-reveal')
        ) {
          return;
        }

        // Check if section contains internal cards or grids
        const hasGridOrCards = section.querySelector('.grid, [class*="grid-cols"], .space-y-12');

        if (!hasGridOrCards) {
          // Plain section: animate the section itself
          elementsToObserve.add(section);
        } else {
          // Complex section with cards:
          // Animate the header / title block
          const header = section.querySelector('.text-center, .max-w-3xl, .max-w-4xl');
          if (header && !header.classList.contains('grid') && !header.classList.contains('absolute')) {
            elementsToObserve.add(header);
          }

          // Animate bottom CTA or summary strip if present
          const bottomAction = section.querySelector('.text-center:last-child, .mt-12, .pt-8');
          if (bottomAction && bottomAction !== header && !bottomAction.classList.contains('grid')) {
            elementsToObserve.add(bottomAction);
          }
        }
      });

      // 2. Target all CSS grid items (cards, statistics, feature blocks)
      const gridContainers = document.querySelectorAll('.grid, [class*="grid-cols"]');
      gridContainers.forEach((grid) => {
        // Exclude background grid patterns, navbars, or fixed overlays
        if (
          grid.classList.contains('bg-grid-dark') || 
          grid.classList.contains('bg-grid-slate') ||
          grid.closest('nav') ||
          grid.closest('#navbar') ||
          grid.closest('.fixed')
        ) {
          return;
        }

        const children = Array.from(grid.children);
        children.forEach((child, idx) => {
          if (
            child.tagName === 'SCRIPT' ||
            child.tagName === 'STYLE' ||
            child.classList.contains('absolute') ||
            child.classList.contains('pointer-events-none') ||
            child.hasAttribute('data-no-reveal')
          ) {
            return;
          }

          // Assign staggered delay (up to 6 columns)
          if (!child.hasAttribute('data-reveal-delay')) {
            const stagger = (idx % 6) * 75; // 0ms, 75ms, 150ms, 225ms, 300ms, 375ms
            child.setAttribute('data-reveal-delay', `${stagger}ms`);
          }

          elementsToObserve.add(child);
        });
      });

      // 3. Target stacked service/solution rows (e.g. ServicesPage)
      document.querySelectorAll('.space-y-12 > div, .space-y-10 > div').forEach((item, idx) => {
        if (!item.closest('nav') && !item.closest('.fixed') && !item.classList.contains('absolute')) {
          if (!item.hasAttribute('data-reveal-delay')) {
            const stagger = (idx % 4) * 80;
            item.setAttribute('data-reveal-delay', `${stagger}ms`);
          }
          elementsToObserve.add(item);
        }
      });

      // 4. Target Footer and Footer directory columns
      const footer = document.querySelector('footer');
      if (footer && !footer.hasAttribute('data-revealed')) {
        const footerCols = footer.querySelectorAll('.grid > div');
        if (footerCols.length > 0) {
          footerCols.forEach((col, idx) => {
            if (!col.hasAttribute('data-reveal-delay')) {
              col.setAttribute('data-reveal-delay', `${idx * 60}ms`);
            }
            elementsToObserve.add(col);
          });
        } else {
          elementsToObserve.add(footer);
        }
      }

      // Process and register elements with the observer
      elementsToObserve.forEach((el) => {
        if (el.hasAttribute('data-revealed')) return;

        const rect = el.getBoundingClientRect();

        // If element is already in the viewport on load, reveal immediately!
        if (rect.top < windowHeight * 0.95 && rect.bottom > 0) {
          el.setAttribute('data-revealed', 'true');
          el.classList.add('revealed');
          return;
        }

        // Below the fold: attach reveal-init and observe
        if (!el.classList.contains('reveal-init')) {
          el.classList.add('reveal-init');
        }

        const delay = el.getAttribute('data-reveal-delay');
        if (delay) {
          el.style.transitionDelay = delay;
        }

        observer.observe(el);
      });
    };

    // Initial scan after render
    const initialTimer = setTimeout(scanAndObserve, 40);
    const backupTimer = setTimeout(scanAndObserve, 350);

    // MutationObserver to capture lazy-loaded routes and asynchronous DOM insertions
    let debounceTimer = null;
    const mutationObserver = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(scanAndObserve, 60);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(backupTimer);
      if (debounceTimer) clearTimeout(debounceTimer);
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
