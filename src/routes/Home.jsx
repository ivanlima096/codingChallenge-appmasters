import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import gameApiFetch from "../axios/config"
import GameCard from "../components/GameCard"
import SearchForm from "../components/SearchForm"
import { FaExclamationTriangle } from 'react-icons/fa'
import "./Home.css"

export default function Home() {
  const [games, setGames] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState("")

  const getGames = async () => {
    const timer = setTimeout(() => {
      setError("A requisição demorou mais de 5 segundos. Tente novamente.")
      setLoading(false)
    }, 5100)

    try {
      const res = await gameApiFetch.get("/data")
      clearTimeout(timer)
      const data = res.data
      console.log(data);
      setGames(data)
      setLoading(false)

      const uniqueGenres = [...new Set(data.map((game) => game.genre))]
      setGenres(uniqueGenres)

    } catch (error) {
      clearTimeout(timer)
      if (
        error.response &&
        [500, 502, 503, 504, 507, 508, 509].includes(error.response.status)
      ) {
        setError("O servidor falhou em responder, tente recarregar a página")
      } else {
        console.log(error)
        setError("O servidor não conseguirá responder por agora, tente voltar novamente mais tarde")
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    getGames()
  }, [])

  const filteredGames = games.filter((game) => {
    const searchTermMatch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.genre.toLowerCase().includes(searchTerm.toLowerCase())

    const genreFilterMatch =
      selectedGenre === "" || game.genre === selectedGenre

    return searchTermMatch && genreFilterMatch
  })

  return (
    <div className="container">
      <h1>Biblioteca de Jogos</h1>
      <SearchForm
        searchTerm={searchTerm}
        handleSearchTermChange={setSearchTerm}
        genres={genres}
        selectedGenre={selectedGenre}
        handleGenreFilter={setSelectedGenre}
      />
      {error ? (
        <div className="error-message"><FaExclamationTriangle />{error}</div>
      ) : loading ? (
        <div className="loader"></div>
      ) : (
        <div className="games-container">
          {filteredGames.map((game) => (
            <GameCard key={game.id} title={game.title} genre={game.genre} thumbnail={game.thumbnail} />
          ))}
        </div>
      )}
    </div>
  )
}
