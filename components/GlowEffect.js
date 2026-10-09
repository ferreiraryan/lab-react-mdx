"use client";
import { useEffect } from "react";

export default function GlowEffect() {
  useEffect(() => {
    // Respeita acessibilidade: se movimento reduzido estiver ativo, cancela o efeito
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let animationFrameId;

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animateGlow = () => {
      // Lerp (Interpolação Linear) para suavidade
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      const glow = document.getElementById('glow-container');
      if (glow) {
        glow.style.setProperty('--mouse-x', currentX + 'px');
        glow.style.setProperty('--mouse-y', currentY + 'px');
      }
      animationFrameId = requestAnimationFrame(animateGlow);
    };

    window.addEventListener('mousemove', onMouseMove);
    animationFrameId = requestAnimationFrame(animateGlow);

    // Cleanup: Remove listeners e zera a task no unmount
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return null;
}
