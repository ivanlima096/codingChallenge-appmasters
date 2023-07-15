import { FaGamepad } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '../services/firebaseConfig'

import './Login.css'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const [
    createUserWithEmailAndPassword,
  ] = useCreateUserWithEmailAndPassword(auth)

  function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user
        setUser(user)
        setLoading(false)
      })
      .catch((error) => {
        setError("Erro ao criar conta, tente novamente!")
        setLoading(false)
      })
  }


  if (loading) {
    return <div className='loader'></div>
  }

  if (user) {
    return (
      <div className="login">
        <div className="loginContainerLogged">
          <p>Sua conta foi criada com sucesso!</p>
          <Link to="/">Veja a lista de jogos!</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="login">
      <div className="loginContainer">
        <header className="header">
          <FaGamepad className="icon" />
          <p>Preencha os dados para criar sua conta gamer!</p>
        </header>
        <form>
          <div className="inputContainer">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="seuemail@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="***********"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="button" onClick={handleRegister}>
            Criar!
          </button>

          {error && <p className="error">{error}</p>}
          {!user && !error && (
            <div className="footer">
              <p>Já possui uma conta?</p>
              <Link to="/auth">Fazer login agora!</Link>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
