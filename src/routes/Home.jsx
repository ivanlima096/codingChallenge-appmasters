import { useState, useEffect } from "react";
import gameApiFetch from "../axios/config";
import GameCard from "../components/GameCard";
import SearchForm from "../components/SearchForm";
import { FaExclamationTriangle } from 'react-icons/fa';
import { collection, getDocs, query, doc, onSnapshot, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../services/firebaseConfig';
import "./Home.css";

export default function Home() {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');

  const getGames = async () => {
    const timer = setTimeout(() => {
      setError("A requisição demorou mais de 5 segundos. Tente novamente.");
      setLoading(false);
    }, 5100);

    try {
      const res = await gameApiFetch.get("/data");
      clearTimeout(timer);
      const data = res.data;
      console.log(data);
      const gamesWithFavorites = data.map((game) => ({
        ...game,
        favoriteGames: [], // Adicione a propriedade favoriteGames aos jogos
      }));
      setGames(gamesWithFavorites);
      setLoading(false);

      const uniqueGenres = [...new Set(data.map((game) => game.genre))];
      setGenres(uniqueGenres);

    } catch (error) {
      clearTimeout(timer);
      if (
        error.response &&
        [500, 502, 503, 504, 507, 508, 509].includes(error.response.status)
      ) {
        setError("O servidor falhou em responder, tente recarregar a página");
      } else {
        console.log(error);
        setError("O servidor não conseguirá responder por agora, tente voltar novamente mais tarde");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getGames();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoritesCollection = collection(firestore, 'favorites');
        const favoritesQuery = query(favoritesCollection);
        const favoritesSnapshot = await getDocs(favoritesQuery);

        const favoriteGames = favoritesSnapshot.docs.map((doc) => doc.data().title);

        const gamesWithRating = await Promise.all(
          favoriteGames.map(async (game) => {
            const gameDocRef = doc(firestore, 'games', game);
            const gameDocSnapshot = await getDoc(gameDocRef);
            const gameData = gameDocSnapshot.data();
            return { ...gameData, title: game };
          })
        );

        setGames((prevGames) =>
          prevGames.map((game) => {
            if (favoriteGames.includes(game.title)) {
              return {
                ...game,
                favoriteGames: [game.title], // Adicione o título aos jogos favoritos
              };
            }
            return game;
          })
        );
        setLoading(false);
      } catch (error) {
        console.log('Erro ao buscar jogos favoritos:', error);
      }
    };

    if (showFavorites) {
      fetchFavorites();
    }
  }, [showFavorites]);

  const filteredGames = games.filter((game) => {
    const searchTermMatch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.genre.toLowerCase().includes(searchTerm.toLowerCase());

    const genreFilterMatch =
      selectedGenre === "" || game.genre === selectedGenre;

    return searchTermMatch && genreFilterMatch;
  });

  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.rating - b.rating;
    } else {
      return b.rating - a.rating;
    }
  });

  const displayedGames = showFavorites ? sortedGames.filter(game => game.favoriteGames.length > 0) : sortedGames;

  const handleToggleFavorites = () => {
    setShowFavorites((prevShowFavorites) => !prevShowFavorites);
  };

  const handleSortToggle = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
  };

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
      <div className="favoritesContainer">
        <button onClick={handleToggleFavorites} className="favoritesBtn">
          {showFavorites ? 'Mostrar Todos Jogos' : 'Mostrar Jogos Favoritos'}
        </button>
        <button onClick={handleSortToggle} className="sortBtn">
          {sortOrder === 'asc' ? 'Ordenar Descrescente' : 'Ordenar por Crescente'}
        </button>
      </div>

      {error ? (
        <div className="error-message"><FaExclamationTriangle />{error}</div>
      ) : loading ? (
        <div className="loader"></div>
      ) : (
        <div className="games-container">
          {displayedGames.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              genre={game.genre}
              thumbnail={game.thumbnail}
              game_url={game.game_url}
              favoriteGames={game.favoriteGames}
              rating={game.rating}
            />
          ))}
        </div>
      )}
    </div>
  );
}
