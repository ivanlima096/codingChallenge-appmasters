import React from "react"
import "./SearchForm.css"

const SearchForm = ({ searchTerm, handleSearchTermChange, genres, selectedGenre, handleGenreFilter }) => {
  const handleSearchTerm = (event) => {
    handleSearchTermChange(event.target.value)
  }

  const handleFilterChange = (event) => {
    handleGenreFilter(event.target.value)
  }

  return (
    <form className="search-container">
      <div className="search-term">
        <input
          id="searchTerm"
          type="text"
          value={searchTerm}
          onChange={handleSearchTerm}
          placeholder={`Buscar por título...`}
        />
      </div>
      <span></span>
      <div className="search-genre">
        <select id="genreFilter" value={selectedGenre} onChange={handleFilterChange}>
          <option value="">Filtre por Gênero</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>
    </form>
  )
}

export default SearchForm
