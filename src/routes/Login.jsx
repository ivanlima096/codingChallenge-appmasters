import { FaGamepad } from 'react-icons/fa'
import './Login.css'
import { Link } from 'react-router-dom'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { useState } from 'react'
import { auth } from '../services/firebaseConfig'


export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error
  ] = useSignInWithEmailAndPassword(auth)

  function handleSignIn(e) {
    e.preventDefault()
    signInWithEmailAndPassword(email, password)
  }

  if (loading) {
    return <div className='loader'></div>
  }
  if (user) {
    return console.log(user);
  }

  return (
    <div className="login">
      <div className="loginContainer">
        <header className="header">
          <FaGamepad className='icon' />
          <p> Faça login para sua conta gamer!</p>
        </header>
        <form>
          <div className="inputContainer">
            <label htmlFor="email">Email</label>
            <input type="text" name='email' id='email' placeholder='seuemail@email.com' onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="inputContainer">
            <label htmlFor="password">Senha</label>
            <input type="password" name='password' id='password' placeholder='***********' onChange={e => setPassword(e.target.value)} />
          </div>

          <a href="">Esqueceu sua senha?</a>
          <button className='button' onClick={handleSignIn}>
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