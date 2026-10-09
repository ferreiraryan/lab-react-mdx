import { notFound } from "next/navigation";
import Link from "next/link";
import EditorialContent from "@/components/EditorialContent";
import { getContent, listContent } from "@/lib/content.mjs";

export async function generateStaticParams() {
  const produtos = await listContent("produtos");
  return produtos.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  if (!slug) return { title: "Produto não encontrado" };

  const produto = await getContent("produtos", slug);
  return produto
    ? { title: produto.frontmatter.name, description: produto.frontmatter.description }
    : { title: "Produto não encontrado" };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  if (!slug) notFound();

  const produto = await getContent("produtos", slug);
  if (!produto) notFound();

  const { name, category, description, image, alt } = produto.frontmatter;

  return (
    <article className="product-detail">
      <div className="product-detail__media">
        <img src={image} alt={alt} />
      </div>

      <div className="product-detail__content">
        <header>
          <p className="eyebrow">{category}</p>
          <h1>{name}</h1>
          <p className="lead">{description}</p>
        </header>

        <EditorialContent source={produto.content} />

        <div className="product-detail__actions">
          <Link href="/#produtos" className="btn btn--outline">
            ← Voltar aos produtos
          </Link>
        </div>
      </div>
    </article>
  );
}
