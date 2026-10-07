import { notFound } from "next/navigation";
import EditorialContent from "@/components/EditorialContent";
import ProductCard from "@/components/ProductCard";
import TeamCard from "@/components/TeamCard";
import { getContent, listContent } from "@/lib/content.mjs";

export default async function Home() {
  const empresa = await getContent("paginas", "empresa");
  if (!empresa) notFound();

  const produtos = await listContent("produtos");
  const equipe = await listContent("equipe");

  return (
    <>
      <section className="hero" aria-labelledby="hero-titulo">
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
        <a className="btn" href="#produtos">Ver produtos</a>
        <a className="btn btn--outline" href="#equipe">Conhecer a equipe</a>
      </section>

      <section id="sobre" aria-labelledby="sobre-titulo">
        <h2 id="sobre-titulo">{empresa.frontmatter.title}</h2>
        <EditorialContent source={empresa.content} />
      </section>

      <section id="produtos" aria-labelledby="produtos-titulo">
        <h2 id="produtos-titulo">Produtos</h2>
        {produtos.length === 0 ? (
          <p>Nenhum produto cadastrado ainda.</p>
        ) : (
          <ul className="grid">
            {produtos.map((produto) => (
              <li key={produto.slug}>
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
        <h2 id="equipe-titulo">Equipe</h2>
        {equipe.length === 0 ? (
          <p>Nenhum integrante cadastrado ainda.</p>
        ) : (
          <>
            <ul className="grid">
              {equipe.map((membro) => (
                <li key={membro.slug}>
                  <TeamCard
                    slug={membro.slug}
                    name={membro.frontmatter.name}
                    position={membro.frontmatter.position}
                    image={membro.frontmatter.image}
                    alt={membro.frontmatter.alt}
                  />
                </li>
              ))}
            </ul>
            <div className="team-bios">
              {equipe.map((membro) => (
                <article key={`bio-${membro.slug}`} className="team-bio">
                  <h3>{membro.frontmatter.name}</h3>
                  <EditorialContent source={membro.content} />
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
