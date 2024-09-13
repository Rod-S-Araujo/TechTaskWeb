import { useEffect, useState } from "react";
import styles from "./ContainerLogin.module.css";
import FormInscrito from "./FormInscrito/index";
import FormPrimeiroAcesso from "./FormPrimeiroAcesso";
import cookieGerenciador from "../../Hooks/CookiesGerenciador";
import { useNavigate } from "react-router-dom";
import http from "../../Http";
import iUsuario from "../../Interfaces/IUsuario";

const ContainerLogin = () => {
  const [ehPrimeiroAcesso, setEhPrimeiroAcesso] = useState<boolean>(true);

  const ehConectado = cookieGerenciador.ehConectado();
  const direcionador = useNavigate();

  const email = cookieGerenciador.getCookieEmail();

  const direcionaUsuario = async (email: string) => {
    try {
      const resposta = await http.get<iUsuario>(`Usuarios/${email}`);
      const usuario = resposta.data;
      direcionador(`/usuario/${usuario.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (ehConectado && email) {
      direcionaUsuario(email);
    }
  }, [ehConectado, email]);
  return (
    <section className={styles.containerLogin}>
      <div>
        <button
          onClick={() => setEhPrimeiroAcesso(true)}
          className={ehPrimeiroAcesso ? styles.botaoAtivo : styles.botaoInativo}
        >
          1° Acesso
        </button>
        <button
          onClick={() => setEhPrimeiroAcesso(false)}
          className={
            !ehPrimeiroAcesso ? styles.botaoAtivo : styles.botaoInativo
          }
        >
          Ja inscrito
        </button>
      </div>
      <h3>Bem vindo ao TechTask</h3>
      <h4>Que tal organizarmos sua agenda?</h4>
      {ehPrimeiroAcesso ? <FormPrimeiroAcesso /> : <FormInscrito />}
    </section>
  );
};

export default ContainerLogin;
