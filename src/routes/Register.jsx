import { FaGamepad } from 'react-icons/fa'
import './Login.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '../services/firebaseConfig'


export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error
  ] = useCreateUserWithEmailAndPassword(auth)

  function handleRegister(e) {
    e.preventDefault()
    createUserWithEmailAndPassword(email, password)
  }

  if (loading) {
    return <p>carregando...</p>
  }

  return (
    <div className="login">
      <div className="loginContainer">
        <header className="header">
          <FaGamepad className='icon' />
          <p> Preencha os dados para criar sua conta gamer!</p>
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

          <button className='button' onClick={handleRegister}>
            Criar!

          </button>

          <div className="footer">
            <p>Já possui uma conta?</p>
            <Link to={"/auth"}>Fazer login agora!</Link>
          </div>
        </form>
      </div>
    </div>
  )
}