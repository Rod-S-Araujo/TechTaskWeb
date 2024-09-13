import { useNavigate, useParams } from "react-router-dom";
import styles from "./UsuarioCadastrado.module.css";
import avatar from "/images/avatar.svg";
import iUsuario from "../../Interfaces/IUsuario";
import http from "../../Http";
import { useEffect, useState } from "react";
import cookieGerenciador from "../../Hooks/CookiesGerenciador";

const UsuarioCadastro = () => {
  const { id } = useParams();

  const [usuario, setUsuario] = useState<iUsuario | null>(null);
  const [nome, setNome] = useState("");
  const [organizacao, setOrganizacao] = useState("");

  const navegador = useNavigate();

  const buscaUsuarioCadastrado = async () => {
    try {
      const resposta = await http.get<iUsuario>(`Usuarios/por-id/${id}`);
      setUsuario(resposta.data);
      setNome(resposta.data.nome);
      setOrganizacao(resposta.data.organizacao ?? "");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      buscaUsuarioCadastrado();
    } else {
      navegador("/");
    }
  }, [id, navegador]);

  const enviarAtualizacaoDeUsuario = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const usuarioAtualizado = { ...usuario, nome, organizacao };
    try {
      await http.put(`Usuarios/${usuario?.email}`, usuarioAtualizado);
      if (usuario) {
        cookieGerenciador.guardarCookieEmail(usuario?.email);
      }
      alert("Usuário atualizado com sucesso.");
      navegador("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={enviarAtualizacaoDeUsuario}
      className={styles.formAtualizacao}
    >
      <img src={avatar} alt="Imagem do avatar generico do usuário" />
      <h2>Informe os dados que deseja atualizar:</h2>
      <h3>Nome:</h3>
      <input
        type="text"
        name="nome"
        value={nome}
        placeholder="Digite seu Nome aqui"
        onChange={(e) => setNome(e.target.value)}
      />
      <h3>E-Mail:</h3>
      <input
        type="email"
        name="email"
        placeholder="Digite um email genérico"
        value={usuario?.email || ""}
        disabled
      />
      <h3>Organização:</h3>
      <input
        type="text"
        name="organizacao"
        placeholder="Digite a organização que pardicipa"
        value={organizacao}
        onChange={(e) => setOrganizacao(e.target.value)}
      />
      <input type="submit" value="Atualizar" />
    </form>
  );
};

export default UsuarioCadastro;
