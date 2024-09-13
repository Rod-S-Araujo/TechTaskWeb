import { useState } from "react";
import iUsuario from "../../../Interfaces/IUsuario";
import styles from "./FormPrimeiroAcesso.module.css";
import http from "../../../Http";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import cookieGerenciador from "../../../Hooks/CookiesGerenciador";

const FormPrimeiroAcesso = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [organizacao, setOrganizacao] = useState("");

  const direcionador = useNavigate();

  const verificaUsuarioCadastrado = async (email: string) => {
    try {
      const resposta = await http.get<iUsuario>(`Usuarios/${email}`);
      const usuario = resposta.data;

      alert(
        "Eita! já encontrei esse e-mail no nosso banco de dados, vou te direcionar para uma janela de atualização do usuário"
      );

      direcionador(`/editusuario/${usuario.id}`);
    } catch (error) {
      //se o Front-end tentar fazer uma requisição ao Back-end e o axios encontrar o erro 404 (que significa que a conex]ao foi bem sucedida mas não encontrou o resultado da busca) ele executa a função de cadastrar usuario
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        registrarUsuario();
        console.log(`${nome} - ${email} - ${organizacao}`);
      } else {
        console.error(error);
      }
    }
  };
  const registrarUsuario = async () => {
    try {
      await http.post("/usuarios", { nome, email, organizacao });
      console.log(`${nome},${email} e ${organizacao}`);
      cookieGerenciador.guardarCookieEmail(email);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const enviarFormulario = (e: React.FormEvent) => {
    e.preventDefault();

    verificaUsuarioCadastrado(email);
  };

  return (
    <form
      method="post"
      className={styles.formPrimeiro}
      onSubmit={enviarFormulario}
    >
      <h3>Nome:</h3>
      <input
        type="text"
        name="nome"
        placeholder="Digite seu Nome aqui"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <h3>E-Mail:</h3>
      <input
        type="email"
        name="email"
        placeholder="Digite um email genérico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <h3>Organização:</h3>
      <input
        type="text"
        name="organizacao"
        placeholder="Digite a organização que pardicipa"
        value={organizacao}
        onChange={(e) => setOrganizacao(e.target.value)}
      />
      <input type="submit" value="Registrar" />
    </form>
  );
};

export default FormPrimeiroAcesso;
