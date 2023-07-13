import { FaGamepad } from 'react-icons/fa'
import './Login.css'
export default function Login() {
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
            <input type="text" name='email' id='email' placeholder='seuemail@email.com' />
          </div>
          <div className="inputContainer">
            <label htmlFor="password">Senha</label>
            <input type="text" name='password' id='password' placeholder='********' />
          </div>

          <a href="">Esqueceu sua senha?</a>
          <button className='button'>
            Entrar!

          </button>

          <div className="footer">
            <p>Ainda não tem uma conta?</p>
            <a href="">Cadastre-se agora!</a>
          </div>
        </form>
      </div>
    </div>
  )
}