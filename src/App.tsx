import styles from "./App.module.css";

import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Usuario from "./Pages/Usuario";
import AdicionarTarefa from "./Pages/AdicionarTarefa";
import EditarTarefa from "./Pages/EditarTarefa";
import Pagina404 from "./Pages/Pagina404";
import UsuarioCadastro from "./Pages/UsuarioCadastrado";

function App() {
  return (
    <>
      <Header />
      <main className={styles.body}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/usuario/:id" element={<Usuario />} />
          <Route path="/addtarefa" element={<AdicionarTarefa />} />
          <Route path="/edittarefa/:id" element={<EditarTarefa />} />
          <Route path="/editusuario/:id" element={<UsuarioCadastro />} />
          <Route path="*" element={<Pagina404 />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
