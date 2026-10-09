"use client";
import { useEffect, useRef, useState } from "react";
import { LazyMotion, m, useReducedMotion } from "motion/react";
import TeamCard from "./TeamCard";

const loadFeatures = () => import("motion/react").then((res) => res.domMax);

export default function TeamMemberModal({ slug, name, position, image, alt, children }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const frontRef = useRef(null);
  const backBtnRef = useRef(null);
  const recemFechado = useRef(false);
  const shouldReduce = useReducedMotion();

  const abrir = () => setIsFlipped(true);

  const fechar = (e) => {
    if (e) e.stopPropagation();
    setIsFlipped(false);
    recemFechado.current = true;
  };

  // Gerencia o foco para acessibilidade
  useEffect(() => {
    if (isFlipped) {
      setTimeout(() => backBtnRef.current?.focus(), 150);
    } else if (recemFechado.current) {
      frontRef.current?.focus();
      recemFechado.current = false;
    }
  }, [isFlipped]);

  // Aplica o hook useReducedMotion na física da animação
  const flipperVariants = {
    frente: {
      rotateY: 0,
      y: shouldReduce ? 0 : [0, -40, 0],
      scale: shouldReduce ? 1 : [1, 1.08, 1],
      transition: shouldReduce ? { duration: 0 } : {
        rotateY: { type: "spring", stiffness: 50, damping: 14 },
        y: { duration: 0.6, times: [0, 0.5, 1], ease: ["easeOut", "easeIn"] },
        scale: { duration: 0.6, times: [0, 0.5, 1], ease: ["easeOut", "easeIn"] }
      }
    },
    verso: {
      rotateY: 180,
      y: shouldReduce ? 0 : [0, -40, 0],
      scale: shouldReduce ? 1 : [1, 1.08, 1],
      transition: shouldReduce ? { duration: 0 } : {
        rotateY: { type: "spring", stiffness: 50, damping: 14 },
        y: { duration: 0.6, times: [0, 0.5, 1], ease: ["easeOut", "easeIn"] },
        scale: { duration: 0.6, times: [0, 0.5, 1], ease: ["easeOut", "easeIn"] }
      }
    }
  };

  return (
    <LazyMotion features={loadFeatures}>
      <div className="team-card-scene">
        <m.div
          className="team-card-flipper"
          variants={flipperVariants}
          initial={false}
          animate={isFlipped ? "verso" : "frente"}
        >
          {/* Frente do Card */}
          <div
            className="team-card-front"
            onClick={!isFlipped ? abrir : undefined}
            onKeyDown={(e) => {
              if (!isFlipped && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                abrir();
              }
            }}
            tabIndex={isFlipped ? -1 : 0}
            role="button"
            aria-label={`Ver biografia de ${name}`}
            ref={frontRef}
          >
            <TeamCard slug={slug} name={name} position={position} image={image} alt={alt} />
          </div>

          {/* Verso do Card */}
          <div className="team-card-back" aria-hidden={!isFlipped}>
            <h3 className="team-card-back__name">{name}</h3>
            <p className="team-card-back__position">{position}</p>
            <div className="team-card-back__bio">{children}</div>
            <button
              type="button"
              className="team-card-back__close"
              onClick={fechar}
              tabIndex={isFlipped ? 0 : -1}
              ref={backBtnRef}
            >
              Voltar
            </button>
          </div>
        </m.div>
      </div>
    </LazyMotion>
  );
}
