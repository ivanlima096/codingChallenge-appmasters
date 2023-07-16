import { useState, useEffect } from 'react';
import gameApiFetch from '../axios/config';
import GameCard from '../components/GameCard';
import SearchForm from '../components/SearchForm';
import { FaExclamationTriangle, FaRegHeart, FaSort } from 'react-icons/fa';
import {
  collection,
  getDocs,
  query,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { firestore, auth } from '../services/firebaseConfig';
import './Home.css';

export default function Home() {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [user, setUser] = useState(null);

  const getGames = async () => {
    try {
      const res = await gameApiFetch.get('/data');
      const data = res.data;
      const gamesWithFavorites = data.map((game) => ({
        ...game,
        favorite: false,
      }));
      setGames(gamesWithFavorites);
      setLoading(false);

      const uniqueGenres = [...new Set(data.map((game) => game.genre))];
      setGenres(uniqueGenres);
    } catch (error) {
      if (
        error.response &&
        [500, 502, 503, 504, 507, 508, 509].includes(error.response.status)
      ) {
        setError('O servidor falhou em responder, tente recarregar a página');
      } else {
        console.log(error);
        setError('O servidor não conseguirá responder por agora, tente voltar novamente mais tarde');
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

        const gamesWithFavorites = games.map((game) => ({
          ...game,
          favorite: favoriteGames.includes(game.title),
        }));

        setGames(gamesWithFavorites);
      } catch (error) {
        console.log('Erro ao buscar jogos favoritos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const filteredGames = games.filter((game) => {
    const searchTermMatch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.genre.toLowerCase().includes(searchTerm.toLowerCase());

    const genreFilterMatch = selectedGenre === '' || game.genre === selectedGenre;

    return searchTermMatch && genreFilterMatch;
  });

  const handleToggleFavorites = () => {
    if (user) {
      setShowFavorites((prevShowFavorites) => !prevShowFavorites);
    } else {
      alert('Usuário não está autenticado');
    }
  };

  const handleSortToggle = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
  };

  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.rating - b.rating;
    } else {
      return b.rating - a.rating;
    }
  });

  const displayedGames = showFavorites
    ? sortedGames.filter((game) => game.favorite)
    : sortedGames;

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
          {showFavorites ? (
            <>
              <FaRegHeart className="icon-heart" />
              <p>Mostrar todos</p>
            </>
          ) : (
            <>
              <FaRegHeart className="icon-heart" />
              <p>Mostrar Favoritos</p>
            </>
          )}
        </button>
        <button onClick={handleSortToggle} className="sortBtn">
          {sortOrder === 'asc' ? (
            <>
              <FaSort className="icon-sort" />
              <p>Ordenar Descrescente</p>
            </>
          ) : (
            <>
              <FaSort className="icon-sort" />
              <p>Ordenar por Crescente</p>
            </>
          )}
        </button>
      </div>

      {error ? (
        <div className="error-message">
          <FaExclamationTriangle />
          {error}
        </div>
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
              favorite={game.favorite}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
}
