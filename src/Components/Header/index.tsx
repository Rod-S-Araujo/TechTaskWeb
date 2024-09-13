import styles from "./Header.module.css";
import logo from "/images/logo.png";
import avatar from "/images/avatar.svg";
import edit from "/images/edit.svg";
import logout from "/images/logout.svg";
import cookieGerenciador from "../../Hooks/CookiesGerenciador";
import http from "../../Http";
import iUsuario from "../../Interfaces/IUsuario";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [menu, setMenu] = useState<boolean>(false);
  const [usuario, setUsuario] = useState<iUsuario | null>(null);
  const emailConectado = cookieGerenciador.getCookieEmail();
  const ehConectado = cookieGerenciador.ehConectado();

  const direcionador = useNavigate();

  useEffect(() => {
    const capturaUsuario = async () => {
      if (emailConectado) {
        try {
          const resposta = await http.get<iUsuario>(
            `Usuarios/${emailConectado}`
          );
          setUsuario(resposta.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    capturaUsuario();
  }, [emailConectado]);

  const mudaMenu = () => {
    setMenu((prevMenu) => !prevMenu);
  };

  const atualizaUsuario = () => {
    direcionador(`/editusuario/${usuario?.id}`);
  };

  const botaoLogout = () => {
    cookieGerenciador.deleteCookieEmail();
    direcionador("");
    window.location.reload;
  };

  return (
    <header className={styles.Header}>
      <img className={styles.logoTechTask} src={logo} alt="Logo da TechTask" />
      <div
        className={`${styles.userArea} ${
          ehConectado ? styles.ehConectado : ""
        }`}
        onClick={mudaMenu}
      >
        <div>
          <h4>{usuario?.nome}</h4>
          <p>{usuario?.organizacao}</p>
        </div>
        <img src={avatar} alt="Avatar do usuario logado" />
        <div
          className={`${styles.menuHamburguer} ${menu ? styles.menuAtivo : ""}`}
        >
          <button onClick={atualizaUsuario}>
            <h3>Atualizar</h3>
            <img src={edit} alt="Icone para editar usuario" />
          </button>
          <button onClick={botaoLogout}>
            <h3>Desconectar</h3>
            <img src={logout} alt="Icone para desconectar desse usuario" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
