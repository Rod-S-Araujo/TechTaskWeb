import styles from "./ListaTarefas.module.css";
import concluido from "/images/concluido.svg";
import concluir from "/images/concluir.svg";
import iniciar from "/images/iniciar.svg";
import restaurar from "/images/restaurar.svg";
import { useEffect, useState } from "react";
import cookieGerenciador from "../../Hooks/CookiesGerenciador";
import { useNavigate } from "react-router-dom";
import iUsuario from "../../Interfaces/IUsuario";
import http from "../../Http";
import ITarefa from "../../Interfaces/ITarefas";

const ListaTarefas = () => {
  const [usuario, setUsuario] = useState<iUsuario | null>(null);
  const [todasTarefas, setTodasTarefas] = useState<ITarefa[]>([]);
  const [tarefasFiltradasPorData, setTarefasFiltradasPorData] = useState<
    ITarefa[]
  >([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtrarPorEstado, setFiltrarPorEstado] = useState<ITarefa[]>([]);
  const [dataFiltro, setDataFiltro] = useState<string>("");
  const idUsuario = usuario?.id;
  const emailConectado = cookieGerenciador.getCookieEmail();

  const direcionador = useNavigate();

  const estadoImagemMap: {
    [key: string]: { imagem: string; titulo: string; funcao: string };
  } = {
    "Não iniciado": { imagem: iniciar, titulo: "Iniciar", funcao: "Iniciado" },
    Iniciado: { imagem: concluir, titulo: "Concluir", funcao: "Concluído" },
    Cancelado: {
      imagem: restaurar,
      titulo: "Restaurar",
      funcao: "Não iniciado",
    },
    Concluído: { imagem: concluido, titulo: "Concuído", funcao: "Concluído" },
  };

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
  useEffect(() => {
    if (idUsuario) {
      const retornaTarefasPorIdDoUsuario = async () => {
        try {
          const resposta = await http.get(`/Tarefas/${idUsuario}`);
          const tarefas = Array.isArray(resposta.data) ? resposta.data : [];
          setTodasTarefas(tarefas);
          setTarefasFiltradasPorData(tarefas);
        } catch (error) {
          console.log(error);
        }
      };
      retornaTarefasPorIdDoUsuario();
    }
  }, [idUsuario]);

  useEffect(() => {
    if (filtroEstado) {
      aplicarFiltroEstado();
    }
  }, [filtroEstado, tarefasFiltradasPorData]);

  const aplicarFiltroData = () => {
    if (dataFiltro) {
      const tarefasFiltradas = todasTarefas.filter((tarefa) => {
        const dataPrazo = new Date(tarefa.prazo);
        dataPrazo.setUTCHours(0, 0, 0, 0);
        const dataSelecionada = new Date(dataFiltro);
        dataSelecionada.setUTCHours(0, 0, 0, 0);
        return dataPrazo.toDateString() === dataSelecionada.toDateString();
      });
      setTarefasFiltradasPorData(tarefasFiltradas);
    } else {
      setTarefasFiltradasPorData(todasTarefas);
    }
  };

  const prioridade: Record<string, number> = {
    verde: 1,
    amarelo: 2,
    vermelho: 3,
  };

  const ordenarPorDataEUrgência = (tarefas: ITarefa[]) => {
    return tarefas.sort((a, b) => {
      const dataA = new Date(a.prazo).getTime();
      const dataB = new Date(b.prazo).getTime();

      if (dataA !== dataB) {
        return dataA - dataB;
      }

      return prioridade[b.urgencia] - prioridade[a.urgencia];
    });
  };

  const aplicarFiltroEstado = async () => {
    if (filtroEstado !== "Não Concluído") {
      const tarefasFiltradas = tarefasFiltradasPorData.filter((tarefa) => {
        const estadoDaTarefa = tarefa.estado;
        const estadoFiltrado = filtroEstado;
        return estadoDaTarefa === estadoFiltrado;
      });
      setFiltrarPorEstado(tarefasFiltradas);
    } else {
      const tarefasFiltradas = tarefasFiltradasPorData.filter((tarefa) => {
        return tarefa.estado !== "Concluído" && tarefa.estado !== "Cancelado";
      });
      setFiltrarPorEstado(tarefasFiltradas);
    }
  };

  return (
    <section className={styles.containerTarefas}>
      <div className={styles.areaSelecaoPeriodo}>
        <div>
          <h4>De quando você precisa:</h4>
          <input type="date" onChange={(e) => setDataFiltro(e.target.value)} />
          <button onClick={aplicarFiltroData}>filtrar</button>
        </div>
      </div>
      <div className={styles.containerDeListagemDasTarefas}>
        <div className={styles.containerFiltroEstado}>
          <button
            className={styles.botaoFiltroEstados}
            onClick={() => setFiltroEstado("Não Concluído")}
          >
            Não concluidas
          </button>
          <button
            className={styles.botaoFiltroEstados}
            onClick={() => setFiltroEstado("Concluído")}
          >
            Concluídas
          </button>
          <button
            className={styles.botaoFiltroEstados}
            onClick={() => setFiltroEstado("Cancelado")}
          >
            Canceladas
          </button>
        </div>
        <h3>Tudo que você tem para fazer nessa data</h3>
        {filtrarPorEstado.length > 0 ? (
          ordenarPorDataEUrgência(filtrarPorEstado).map((tarefa) => {
            const estadoImagen = estadoImagemMap[tarefa.estado];
            const novoEstado = estadoImagemMap[tarefa.estado].funcao;
            const atualizarEstadoDaTarefa = async () => {
              try {
                await http.put(`/Tarefas/${tarefa.id}/estado`, null, {
                  params: { estado: novoEstado },
                });
                window.location.reload();
              } catch (error) {
                console.log(error);
              }
            };
            return (
              <div
                key={tarefa.id}
                className={`${styles.tarefa} ${styles[tarefa.urgencia]}`}
              >
                <div
                  className={styles.conteudoDaTarefa}
                  onClick={() => direcionador(`/edittarefa/${tarefa.id}`)}
                >
                  <div className={styles.cabecalhoDaTarefa}>
                    <h6>{tarefa.tarefa}</h6>
                    <h6>
                      {" "}
                      Prazo:{" "}
                      {new Date(tarefa.prazo).toLocaleDateString("pt-br", {
                        day: "2-digit",
                        month: "2-digit",
                      })}{" "}
                    </h6>
                  </div>
                  <p>{tarefa.descricao}</p>
                </div>
                <button
                  className={styles.botaoConcluir}
                  onClick={atualizarEstadoDaTarefa}
                  disabled={tarefa.estado === "Concluído"}
                >
                  <img
                    src={estadoImagen.imagem}
                    alt={`Mudar estado para ${estadoImagen.titulo}`}
                  />
                  <h6>{estadoImagen.titulo}</h6>
                </button>
              </div>
            );
          })
        ) : (
          <h3>Informe quais tarefas você deseja visualizar:</h3>
        )}
      </div>
    </section>
  );
};

export default ListaTarefas;
