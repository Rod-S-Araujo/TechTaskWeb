import { useNavigate } from "react-router-dom";
import styles from "./AdicionarTarefa.module.css";
import { useEffect, useState } from "react";
import cookieGerenciador from "../../Hooks/CookiesGerenciador";
import iUsuario from "../../Interfaces/IUsuario";
import http from "../../Http";

const AdicionarTarefa = () => {
  const [tarefa, setTarefa] = useState("");
  const [descricao, setDescricao] = useState("");
  const insercao = dataFormatada(new Date());
  const [prazo, setPrazo] = useState<string>("");
  const [urgencia, setUrgencia] = useState("");

  const [usuario, setUsuario] = useState<iUsuario | null>(null);
  const idUsuario = usuario?.id;
  const estado = "Não iniciado";
  const emailConectado = cookieGerenciador.getCookieEmail();

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
      } else {
        direcionador("/");
      }
    };
    capturaUsuario();
  }, [emailConectado]);

  function dataFormatada(date: Date): string {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const dia = String(date.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }
  const cadastrarTarefa = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await http.post("/Tarefas", {
        tarefa,
        descricao,
        urgencia,
        insercao,
        prazo,
        estado,
        idUsuario,
      });
      console.log(
        `Usuario:${usuario?.nome} Tarefa: ${tarefa}, ${descricao}, ${insercao}, ${prazo} e ${urgencia}`
      );
      direcionador(-1);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form className={styles.formAddTarefa} onSubmit={cadastrarTarefa}>
      <h2>Descreva a tarefa que deseja adicionar:</h2>
      <label htmlFor="tarefa">Tarefa:</label>
      <input
        className={styles.input}
        id="tarefa"
        name="tarefa"
        type="text"
        placeholder="Digite o nome da tarefa"
        onChange={(e) => setTarefa(e.target.value)}
        required
      />
      <label htmlFor="descricao"> Descrição:</label>
      <textarea
        className={styles.input}
        id="descricao"
        name="descricao"
        placeholder="Digite uma descrição da tarefa a ser realizada"
        onChange={(e) => setDescricao(e.target.value)}
        required
      />
      <div className={styles.containerDatas}>
        <div className={styles.data}>
          <label htmlFor="insercao">Data de criação:</label>
          <input
            type="date"
            id="insercao"
            name="insercao"
            value={insercao}
            className={styles.input}
            disabled
          />
        </div>
        <div className={styles.data}>
          <label htmlFor="prazo">Prazo para conclusão:</label>
          <input
            className={styles.input}
            id="prazo"
            name="prazo"
            type="date"
            onChange={(e) => setPrazo(e.target.value)}
            required
          />
        </div>
      </div>
      <label htmlFor="urgencia">Nivél de urgência da tarefa</label>
      <select
        className={styles.input}
        name="urgencia"
        id="urgencia"
        onChange={(e) => setUrgencia(e.target.value)}
        value={urgencia}
        required
      >
        <option value="" disabled>
          Escolha o nível de relevância da tarefa
        </option>
        <option value="verde">Baixa(verde)</option>
        <option value="amarelo">Média(amarela)</option>
        <option value="vermelho">Alta(vermelha)</option>
      </select>
      <div className={styles.containerBotoes}>
        <button onClick={() => direcionador(-1)} className={styles.botaoVoltar}>
          Cancelar
        </button>
        <input
          type="submit"
          className={styles.botaoCadastrar}
          value={"Cadastrar tarefa."}
        />
      </div>
    </form>
  );
};

export default AdicionarTarefa;
