import { notFound } from "next/navigation";
import Link from "next/link";
import EditorialContent from "@/components/EditorialContent";
import { getContent, listContent } from "@/lib/content.mjs";

export async function generateStaticParams() {
  return (await listContent("produtos")).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const produto = await getContent("produtos", slug);
  return produto
    ? { title: produto.frontmatter.name, description: produto.frontmatter.description }
    : { title: "Produto não encontrado" };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const produto = await getContent("produtos", slug);
  if (!produto) notFound();

  const { name, category, description, image, alt } = produto.frontmatter;

  return (
    <article>
      <p className="eyebrow">{category}</p>
      <h1>{name}</h1>
      <p className="lead">{description}</p>
      <img src={image} alt={alt} />
      <EditorialContent source={produto.content} />
      <p>
        <Link href="/#produtos">← Voltar aos produtos</Link>
      </p>
    </article>
  );
}
