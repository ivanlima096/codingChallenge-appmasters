import { useState, useEffect } from 'react';
import gameApiFetch from '../axios/config';
import GameCard from '../components/GameCard';
import SearchForm from '../components/SearchForm';
import { FaExclamationTriangle, FaRegHeart, FaSort } from 'react-icons/fa';
import { collection, getDocs, query, doc, onSnapshot, getDoc } from 'firebase/firestore';
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
  const [fetchingFavorites, setFetchingFavorites] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc');
  const [user, setUser] = useState(null);

  const getGames = async () => {
    const timer = setTimeout(() => {
      setError('A requisição demorou mais de 5 segundos. Tente novamente.');
      setLoading(false);
    }, 5100);

    try {
      const res = await gameApiFetch.get('/data');
      clearTimeout(timer);
      const data = res.data;
      console.log(data);
      const gamesWithFavorites = data.map((game) => ({
        ...game,
        favoriteGames: []
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

        const gamesWithRating = await Promise.all(
          favoriteGames.map(async (game) => {
            const gameDocRef = doc(firestore, 'games', game);
            const gameDocSnapshot = await getDoc(gameDocRef);
            const gameData = gameDocSnapshot.data();
            return { ...gameData, title: game };
          })
        );

        setGames(gamesWithRating);
        setFetchingFavorites(false); // Definir fetchingFavorites como false quando a busca estiver concluída
      } catch (error) {
        console.log('Erro ao buscar jogos favoritos:', error);
      }
    };

    if (fetchingFavorites) {
      fetchFavorites();
    }
  }, [fetchingFavorites]);

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

  const handleToggleFavorites = (game) => {
    if (user) {
      const gameDocRef = doc(firestore, 'favorites', game.title);

      if (game.favoriteGames.includes(user.uid)) {
        const updatedFavoriteGames = game.favoriteGames.filter((userId) => userId !== user.uid);
        setDoc(gameDocRef, { favoriteGames: updatedFavoriteGames }, { merge: true })
          .catch((error) => {
            console.log('Erro ao remover o usuário da lista de favoritos:', error);
          });
      } else {
        const updatedFavoriteGames = [...game.favoriteGames, user.uid];
        setDoc(gameDocRef, { favoriteGames: updatedFavoriteGames }, { merge: true })
          .catch((error) => {
            console.log('Erro ao adicionar o usuário à lista de favoritos:', error);
          });
      }
    } else {
      alert('Usuário não está autenticado');
    }
  };

  const handleRatingChange = async (game, value) => {
    if (user) {
      const gameDocRef = doc(firestore, 'ratings', game.title);
      await setDoc(gameDocRef, { rating: value }, { merge: true })
        .catch((error) => {
          console.log('Erro ao atualizar a nota do jogo:', error);
        });
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

  const displayedGames = showFavorites ? sortedGames.filter((game) => game.favoriteGames.length > 0) : sortedGames;

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
              favoriteGames={game.favoriteGames}
              handleToggleFavorites={() => handleToggleFavorites(game)}
              handleRatingChange={(value) => handleRatingChange(game, value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
