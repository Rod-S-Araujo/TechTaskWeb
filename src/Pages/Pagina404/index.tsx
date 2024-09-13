import styles from "./Pagina404.module.css";

import { useNavigate } from "react-router-dom";

const Pagina404 = () => {
  const navigate = useNavigate();
  return (
    <section className={styles.pagina404}>
      <h1>404 - Pagina não encontrada</h1>
      <h2>
        "Ops algo deu errado... " clique em voltar ali em baixo e vamos tentar
        de novo...
      </h2>
      <button onClick={() => navigate(-1)}>VOLTAR</button>
    </section>
  );
};

export default Pagina404;
