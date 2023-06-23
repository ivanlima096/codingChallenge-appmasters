import "./GameCard.css"

export default function GameCard({ title, genre, thumbnail }) {
  return (
    <div className="game">
      <button>Ver Detalhes</button>
      <h2>{title}</h2>
      <h5>{genre}</h5>
      <img src={thumbnail} alt={title} />
    </div>
  )
}