import { useState, useEffect } from 'react';
import { FaHeart, FaExternalLinkAlt, FaStar } from 'react-icons/fa';

import {
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDoc,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { firestore, auth } from '../services/firebaseConfig';

import './GameCard.css';

export default function GameCard({ title, genre, thumbnail, game_url, favoriteGames }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(false);
  const [user, setUser] = useState(null);

  const handleRatingChange = async (value) => {
    try {
      const gameDocRef = doc(firestore, 'games', title);
      await setDoc(gameDocRef, { rating: value }, { merge: true });
    } catch (error) {
      console.log('Erro ao atualizar a nota do jogo:', error);
    }
  };

  const fetchRating = async () => {
    try {
      const gameDocRef = doc(firestore, 'games', title);
      const gameDocSnapshot = await getDoc(gameDocRef);
      const gameData = gameDocSnapshot.data();
      if (gameData && gameData.rating) {
        setRating(gameData.rating);
        setIsRated(true);
      }
    } catch (error) {
      console.log('Erro ao buscar a nota do jogo:', error);
    }
  };

  useEffect(() => {
    const gameDocRef = doc(firestore, 'favorites', title);
    const unsubscribe = onSnapshot(gameDocRef, (docSnapshot) => {
      setIsFavorite(docSnapshot.exists());
    });

    return () => unsubscribe();
  }, [title]);

  useEffect(() => {
    fetchRating();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleFavorite = () => {
    if (user) {
      const gameDocRef = doc(firestore, 'favorites', title);

      if (isFavorite) {
        // Remove the favorite game from Firestore
        deleteDoc(gameDocRef).catch((error) => {
          console.log('Erro ao remover o jogo favorito:', error);
        });
      } else {
        // Add the game as a favorite to Firestore
        setDoc(gameDocRef, {
          title,
          genre,
          thumbnail,
          game_url,
        }).catch((error) => {
          console.log('Erro ao adicionar o jogo favorito:', error);
        });
      }
    } else {
      console.log('Usuário não está autenticado');
    }
  };

  return (
    <div className="game">
      <img className="image" src={thumbnail} alt={title} />
      <h2>{title}</h2>
      <hr></hr>
      <div className="upperPart">
        <div className="leftPart">
          <h5>{genre}</h5>
        </div>
        <div className="rightPart">
          <div className="rating">
            {[1, 2, 3, 4].map((value) => (
              <FaStar
                key={value}
                className={isRated && value <= rating ? 'star-filled' : 'star-empty'}
                onClick={() => handleRatingChange(value)}
              />
            ))}
          </div>
          <button onClick={handleToggleFavorite} className="heartBtn">
            {isFavorite ? <FaHeart className="icon-full" /> : <FaHeart className="icon-empty" />}
          </button>
        </div>
      </div>
      <a href={game_url} target="_blank" rel="noopener noreferrer">
        <button className="details">
          Ver Detalhes <FaExternalLinkAlt className="icon" />
        </button>
      </a>
    </div>
  );
}
