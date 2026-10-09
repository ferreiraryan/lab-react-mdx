export default function TeamCard({ name, position, image, alt }) {
  return (
    <article className="team-card">
      <img className="team-card__image" src={image} alt={alt} />
      <h3 className="team-card__name">{name}</h3>
      <p className="team-card__position">{position}</p>
    </article>
  );
}
