import { Link } from "react-router-dom"

import { FaLinkedinIn, FaGithub, FaFileDownload, FaGamepad } from 'react-icons/fa'

import "./navbar.css"

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <FaGamepad />
        <h2>
          <Link to={"/"}>Minha Biblioteca</Link>
        </h2>
      </div>
      <ul>
        <li><Link to={"/"}>Home</Link> </li>
        <li><Link to={"/auth"}>Login</Link> </li>
        <li><a href="https://www.linkedin.com/in/ivan-lima-dev/" target="_blank">< FaLinkedinIn /></a></li>
        <li><a href="https://github.com/ivanlima096" target="_blank">< FaGithub /></a></li>
        <li><a href="https://drive.google.com/file/d/1wEXAyjiYbv0yeUiVuH0xJaLoO9mue3GC/view?usp=drive_link" target="_blank"><FaFileDownload /></a></li>
      </ul>
    </nav>
  )
}