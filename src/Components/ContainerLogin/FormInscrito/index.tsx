import { useState } from "react";
import styles from "./FormInscrito.module.css";
import http from "../../../Http";
import cookieGerenciador from "../../../Hooks/CookiesGerenciador";
import iUsuario from "../../../Interfaces/IUsuario";

const FormInscrito = () => {
  const [email, setEmail] = useState("");

  const verificaUsuario = async (email: string) => {
    try {
      const resposta = await http.get<iUsuario>(`Usuarios/${email}`);
      const usuario = resposta.data;

      cookieGerenciador.guardarCookieEmail(usuario.email);
      window.location.reload();
    } catch (error) {
      alert(
        "Não consegui realizar seu acesso, verifique os dados ou tente novamente mais tarde"
      );
      console.log(error);
    }
  };

  const conectaUsuario = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    verificaUsuario(email);
  };
  return (
    <form className={styles.formInscritos} onSubmit={conectaUsuario}>
      <h3>Email</h3>
      <input
        type="email"
        value={email}
        name={email}
        placeholder="Informe seu E-Mail para continuarmos"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input type="submit" value="Prosseguir" />
    </form>
  );
};

export default FormInscrito;
