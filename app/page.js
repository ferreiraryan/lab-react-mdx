import { notFound } from "next/navigation";
import EditorialContent from "@/components/EditorialContent";
import ProductCard from "@/components/ProductCard";
import TeamMemberModal from "@/components/TeamMemberModal";
import { getContent, listContent } from "@/lib/content.mjs";

export default async function Home() {
  const empresa = await getContent("paginas", "empresa");
  if (!empresa) notFound();

  const produtos = await listContent("produtos");
  const equipe = await listContent("equipe");

  return (
    <div id="glow-container">
      <section className="hero" aria-labelledby="hero-titulo" data-animate>
        <p className="eyebrow">Vestuário oversized · Edição limitada</p>
        <h1 id="hero-titulo">
          <img src="/images/marca/logo.jpeg" alt="HEXXED" className="hero__logo" />
        </h1>
        <p className="lead">{empresa.frontmatter.lead}</p>
        <div className="hero__countdown" aria-label="Contagem regressiva (decorativa)">
          <div><b>00</b> DIAS</div>
          <div><b>00</b> HORAS</div>
          <div><b>00</b> MIN</div>
          <div><b>00</b> SEG</div>
        </div>
        <div>
          <a className="btn" href="#produtos">Ver produtos</a>
          <a className="btn btn--outline" href="#equipe">Conhecer a equipe</a>
        </div>

        {/* Indicador animado pedindo scroll reposicionado para o fim da tela */}
        <div className="scroll-indicator" aria-hidden="true">
          <span>Explorar</span>
        </div>
      </section>

      <section id="sobre" aria-labelledby="sobre-titulo">
        {/* Animando os filhos em cascata para evidenciar o efeito no scroll */}
        <h2 id="sobre-titulo" data-animate data-stagger>{empresa.frontmatter.title}</h2>
        <div data-animate data-stagger>
          <EditorialContent source={empresa.content} />
        </div>
      </section>

      <section id="produtos" aria-labelledby="produtos-titulo">
        <h2 id="produtos-titulo" data-animate>Produtos</h2>
        {produtos.length === 0 ? (
          <p>Nenhum produto cadastrado ainda.</p>
        ) : (
          <ul className="grid">
            {produtos.map((produto) => (
              <li key={produto.slug} data-animate data-stagger>
                <ProductCard
                  slug={produto.slug}
                  name={produto.frontmatter.name}
                  category={produto.frontmatter.category}
                  description={produto.frontmatter.description}
                  image={produto.frontmatter.image}
                  alt={produto.frontmatter.alt}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="equipe" aria-labelledby="equipe-titulo">
        <h2 id="equipe-titulo" data-animate>Equipe</h2>
        {equipe.length === 0 ? (
          <p>Nenhum integrante cadastrado ainda.</p>
        ) : (
          <ul className="grid">
            {equipe.map((membro) => (
              <li key={membro.slug} data-animate data-stagger>
                <TeamMemberModal
                  slug={membro.slug}
                  name={membro.frontmatter.name}
                  position={membro.frontmatter.position}
                  image={membro.frontmatter.image}
                  alt={membro.frontmatter.alt}
                >
                  <EditorialContent source={membro.content} />
                </TeamMemberModal>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Script otimizado com Blur Reveal + Stagger Effect e Glow */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              if (window.__hexxed_effects) {
                setTimeout(() => {
                  if (window.__hexxed_observer) {
                    document.querySelectorAll('[data-animate]:not(.is-visible)').forEach(el => window.__hexxed_observer.observe(el));
                  }
                }, 100);
                return;
              }
              window.__hexxed_effects = true;

              // Setup: Efeito Delay do Mouse (Lerp Glow)
              let targetX = window.innerWidth / 2;
              let targetY = window.innerHeight / 2;
              let currentX = targetX;
              let currentY = targetY;

              window.addEventListener('mousemove', (e) => {
                targetX = e.clientX;
                targetY = e.clientY;
              });

              function animateGlow() {
                currentX += (targetX - currentX) * 0.06;
                currentY += (targetY - currentY) * 0.06;
                
                const glow = document.getElementById('glow-container');
                if (glow) {
                  glow.style.setProperty('--mouse-x', currentX + 'px');
                  glow.style.setProperty('--mouse-y', currentY + 'px');
                }
                requestAnimationFrame(animateGlow);
              }

              // Setup: Intersection Observer com Cascata (Stagger)
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
              
              window.__hexxed_observer = observer;

              function initEffects() {
                animateGlow();
                document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

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
              }

              setTimeout(initEffects, 150);
            })();
          `
        }}
      />
    </div>
  );
}
