import { useNavigate, useParams } from "react-router-dom";
import styles from "./EditarTarefa.module.css";
import http from "../../Http";
import { useEffect, useState } from "react";
import ITarefa from "../../Interfaces/ITarefas";

const EditarTarefa = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [tarefaRecuperada, setTarefaRecuperada] = useState<ITarefa | null>(
    null
  );
  const [tarefa, setTarefa] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urgencia, setUrgencia] = useState("");
  const insercao = tarefaRecuperada
    ? new Date(tarefaRecuperada?.insercao).toLocaleDateString("pt-br", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";
  const [prazo, setPrazo] = useState<string>("");
  const [estado, setEstado] = useState("");
  const prazoDate = new Date(prazo);
  prazoDate.setUTCHours(0, 0, 0, 0);

  const recuperarTarefaPorId = async () => {
    try {
      const tarefa = await http.get(`/Tarefas/por-id/${id}`);
      setTarefaRecuperada(tarefa.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      recuperarTarefaPorId();
    }
  }, [id]);

  useEffect(() => {
    if (tarefaRecuperada) {
      setTarefa(tarefaRecuperada.tarefa || "");
      setDescricao(tarefaRecuperada.descricao || "");
      setUrgencia(tarefaRecuperada.urgencia || "");
      setPrazo(
        tarefaRecuperada.prazo
          ? new Date(tarefaRecuperada.prazo).toISOString().split("T")[0]
          : ""
      );
      setEstado(tarefaRecuperada.estado || "");
    }
  }, [tarefaRecuperada]);

  const cancelarTarefa = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await http.put(`/Tarefas/${id}/estado`, null, {
        params: { estado: "Cancelado" },
      });
      navigate(`/usuario/${tarefaRecuperada?.idUsuario}`);
    } catch (error) {
      console.log(error);
    }
  };

  const enviarAtualização = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const tarefaAtualizada: ITarefa = {
      ...tarefaRecuperada!,
      tarefa,
      descricao,
      prazo: prazoDate,
      urgencia,
      estado,
    };

    try {
      http.put(`/Tarefas/${id}`, tarefaAtualizada);
      navigate(`/usuario/${tarefaRecuperada?.idUsuario}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className={styles.formAddTarefa} onSubmit={enviarAtualização}>
      <h2>O que podemos alterar nessa tarefa?</h2>
      <label htmlFor="id">ID da tarefa</label>
      <input type="number" name="id" value={id} disabled />
      <label htmlFor="tarefa">Tarefa:</label>
      <input
        className={styles.input}
        id="tarefa"
        name="tarefa"
        type="text"
        placeholder="Digite o nome da tarefa"
        value={tarefa}
        onChange={(e) => setTarefa(e.target.value)}
      />
      <label htmlFor="descricao"> Descrição:</label>
      <textarea
        className={styles.input}
        id="descricao"
        name="descricao"
        placeholder="Digite uma descrição da tarefa a ser realizada"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <div className={styles.containerDatas}>
        <div className={styles.data}>
          <label htmlFor="insercao">Data de criação:</label>
          <h4 className={styles.input}>{insercao}</h4>
        </div>
        <div className={styles.data}>
          <label htmlFor="prazo">Prazo para conclusão:</label>
          <input
            className={styles.input}
            id="prazo"
            name="prazo"
            type="date"
            value={prazo}
            onChange={(e) => setPrazo(e.target.value)}
          />
        </div>
      </div>
      <label htmlFor="urgencia">Nivél de urgência da tarefa</label>
      <select
        className={styles.input}
        name="urgencia"
        id="urgencia"
        value={urgencia}
        onChange={(e) => setUrgencia(e.target.value)}
      >
        <option value="" disabled>
          Escolha o nível de relevância da tarefa
        </option>
        <option value="verde">Baixa(verde)</option>
        <option value="amarelo">Média(amarela)</option>
        <option value="vermelho">Alta(vermelha)</option>
      </select>
      <label htmlFor="estado">Alterae o estado de execução da tarefa</label>
      <select
        className={styles.input}
        name="estado"
        id="estado"
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
      >
        <option value="" disabled>
          Escolha o estado de execução da tarefa
        </option>
        <option value="Não iniciado">Não iniciado</option>
        <option value="Iniciado">Iniciado</option>
        <option value="Concluído">Concluído</option>
      </select>
      <div className={styles.containerBotoes}>
        <button onClick={() => navigate(-1)} className={styles.botaoVoltar}>
          Retornar
        </button>
        <button
          className={styles.botaoAtualizar}
          onClick={(event) => cancelarTarefa(event)}
        >
          Cancelar tarefa
        </button>
        <input
          type="submit"
          className={styles.botaoAtualizar}
          value={"Atualizar tarefa."}
        />
      </div>
    </form>
  );
};

export default EditarTarefa;
