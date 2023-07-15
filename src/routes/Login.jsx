import { FaGamepad, FaRegCheckCircle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { useState, useEffect } from 'react'
import { auth } from '../services/firebaseConfig'

import './Login.css'

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const [
    signInWithEmailAndPassword,
  ] = useSignInWithEmailAndPassword(auth)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
        setLoading(false)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  function handleSignIn(e) {
    e.preventDefault()
    setLoading(true)
    signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user
        setUser(user)
        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
      })
  }

  function handleLogout() {
    auth.signOut()
      .then(() => {
        setUser(null)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  if (loading) {
    return <div className='loader'></div>
  }

  if (user) {
    return (
      <div className="login">
        <div className="loginContainerLogged">
          <FaRegCheckCircle className='icon-check' />
          <p>Você já está logado.</p>
          <Link to="/">Ir para a página inicial</Link>
          <br />
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    )
  }

  return (
    <div className="login">
      <div className="loginContainer">
        <header className="header">
          <FaGamepad className="icon" />
          <p>Faça login para sua conta gamer!</p>
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

          <a href="">Esqueceu sua senha?</a>
          <button className="button" onClick={handleSignIn}>
            Entrar!
          </button>


          <div className="footer">
            <p>Ainda não tem uma conta?</p>
            <Link to={"/register"}>Cadastre-se agora!</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
