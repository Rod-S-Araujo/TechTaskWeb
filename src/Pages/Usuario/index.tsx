import styles from "./Usuario.module.css";
import BotaoAtividades from "../../Components/BotaoAtividadesTarefas";
import ListaTarefas from "../../Components/ListaTarefas";
import logoAdicionar from "/images/adicionar.svg";
import { useEffect } from "react";
import cookieGerenciador from "../../Hooks/CookiesGerenciador";
import iUsuario from "../../Interfaces/IUsuario";
import { useNavigate } from "react-router-dom";
import http from "../../Http";

const Usuario = () => {
  const emailConectado = cookieGerenciador.getCookieEmail();
  const ehConectado = cookieGerenciador.ehConectado();

  const direcionador = useNavigate();

  useEffect(() => {
    if (ehConectado) {
      const capturaUsuario = async () => {
        if (emailConectado) {
          try {
            const resposta = await http.get<iUsuario>(
              `Usuarios/${emailConectado}`
            );
            console.log(resposta.data);
          } catch (error) {
            console.log(error);
          }
        }
      };
      capturaUsuario();
    } else {
      direcionador("/");
    }
  }, [emailConectado]);

  const BotaoAdicionarTarefa = () => {
    direcionador(`/addtarefa`);
  };
  return (
    <main className={styles.conteudoUsuario}>
      <ListaTarefas />
      <section className={styles.containerAcoes}>
        <BotaoAtividades logo={logoAdicionar} onCLick={BotaoAdicionarTarefa}>
          Adicionar uma tarefa
        </BotaoAtividades>
      </section>
    </main>
  );
};

export default Usuario;
