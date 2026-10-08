"use client";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, m } from "motion/react";
import TeamCard from "./TeamCard";

const loadFeatures = () => import("motion/react").then((res) => res.domMax);

// Curva de física idêntica para o Layout (escala/posição) e o Rotate (3D)
const transicaoFluida = {
  type: "spring",
  stiffness: 260,
  damping: 28
};

export default function TeamMemberModal({ slug, name, position, image, alt, children }) {
  const [aberto, setAberto] = useState(false);
  const dialogId = useId();
  const tituloId = useId();
  const cardRef = useRef(null);
  const dialogRef = useRef(null);
  const recemFechado = useRef(false);

  const abrir = () => setAberto(true);
  const fechar = () => {
    setAberto(false);
    recemFechado.current = true;
  };

  useEffect(() => {
    if (!aberto) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") fechar(); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusaveis = dialog.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusaveis.length) focusaveis[0].focus();

    const onTab = (e) => {
      if (e.key !== "Tab" || !focusaveis.length) return;
      const primeiro = focusaveis[0];
      const ultimo = focusaveis[focusaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    dialog.addEventListener("keydown", onTab);
    return () => dialog.removeEventListener("keydown", onTab);
  }, [aberto]);

  useEffect(() => {
    if (!aberto && recemFechado.current && cardRef.current) {
      cardRef.current.focus();
      recemFechado.current = false;
    }
  }, [aberto]);

  return (
    <LazyMotion features={loadFeatures}>
      <m.div
        layoutId={`team-card-${slug}`}
        className="team-card-wrap"
        onClick={abrir}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); } }}
        tabIndex={0}
        role="button"
        aria-label={`Ver biografia de ${name}`}
        ref={cardRef}
        transition={transicaoFluida}
      >
        <TeamCard slug={slug} name={name} position={position} image={image} alt={alt} />
      </m.div>

      <AnimatePresence>
        {aberto && (
          <>
            <m.div
              className="team-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={fechar}
              aria-hidden="true"
            />
            {/* O container projeta a escala/posição com a mesma transição */}
            <m.div
              layoutId={`team-card-${slug}`}
              className="team-modal"
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={tituloId}
              id={dialogId}
              style={{ perspective: 1200 }}
              transition={transicaoFluida}
            >
              {/* O flipper gira com a mesma transição em perfeita sincronia */}
              <m.div
                className="team-modal__flipper"
                initial={{ rotateY: 180 }}
                animate={{ rotateY: 0 }}
                exit={{ rotateY: 180 }}
                transition={transicaoFluida}
              >
                <div className="team-modal__front" aria-hidden="true">
                  <TeamCard slug={slug} name={name} position={position} image={image} alt={alt} />
                </div>

                <div className="team-modal__inner">
                  <h3 id={tituloId} className="team-modal__name">{name}</h3>
                  <p className="team-modal__position">{position}</p>
                  <div className="team-modal__bio">{children}</div>
                  <button type="button" className="team-modal__close" onClick={fechar}>
                    Fechar
                  </button>
                </div>
              </m.div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
