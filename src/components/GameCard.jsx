import "./GameCard.css"
import { FaExternalLinkAlt } from 'react-icons/fa'

export default function GameCard({ title, genre, thumbnail, game_url }) {
  return (
    <div className="game">
      <a href={game_url} target="_blank">
        <button>Ver Detalhes  <FaExternalLinkAlt className="icon" /> </button>
      </a>
      <h2>{title}</h2>
      <h5>{genre}</h5>
      <img className="image" src={thumbnail} alt={title} />
    </div >
  )
}