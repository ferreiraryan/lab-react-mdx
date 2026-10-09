"use client";
import { useEffect } from "react";

export default function RevealOnScroll() {
  useEffect(() => {
    // Acessibilidade: remove animações completas se requisitado
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      document.querySelectorAll('[data-animate]').forEach(el => {
        el.classList.add('is-visible');
      });
      return;
    }

    let staggerIndex = 0;
    let staggerTimer = null;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.hasAttribute('data-stagger')) {
            entry.target.style.transitionDelay = (staggerIndex * 0.15) + 's';
            staggerIndex++;
            clearTimeout(staggerTimer);
            staggerTimer = setTimeout(() => { staggerIndex = 0; }, 100);
          }

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    // Observa elementos já no DOM
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

    // Observa novos elementos adicionados (ex: via Client Routes)
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.hasAttribute && node.hasAttribute('data-animate')) observer.observe(node);
            const children = node.querySelectorAll ? node.querySelectorAll('[data-animate]') : [];
            children.forEach(el => observer.observe(el));
          }
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Cleanup dos observers
    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      clearTimeout(staggerTimer);
    };
  }, []);

  return null;
}
