import Link from "next/link";

export default function ProductCard({ slug, name, category, description, image, alt }) {
  return (
    <article className="product-card">
      <Link className="product-card__link" href={`/produtos/${slug}`}>
        <img className="product-card__image" src={image} alt={alt} />
        <p className="product-card__category">{category}</p>
        <h3 className="product-card__name">{name}</h3>
        <p className="product-card__description">{description}</p>
      </Link>
    </article>
  );
}
