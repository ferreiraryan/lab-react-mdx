import { notFound } from "next/navigation";
import EditorialContent from "@/components/EditorialContent";
import ProductCard from "@/components/ProductCard";
import TeamMemberModal from "@/components/TeamMemberModal";
import GlowEffect from "@/components/GlowEffect";
import RevealOnScroll from "@/components/RevealOnScroll";
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

      {/* Renderizamos os efeitos como Client Components perto do fechamento para espelhar a lógica de injeção anterior, garantindo boa organização lógica. */}
      <GlowEffect />
      <RevealOnScroll />
    </div>
  );
}
