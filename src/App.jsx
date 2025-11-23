import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/home"
import Menu from "./pages/menu"
import Login from "./pages/login"
import Registrarse from "./pages/registrarse"
import Pendings from "./pages/pendings"
import Resenas from "./pages/resenas"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resenas" element={<Resenas />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrarse" element={<Registrarse />} />
        <Route path="/pendings" element={<Pendings />} />
      </Routes>
    </BrowserRouter>
  )
}