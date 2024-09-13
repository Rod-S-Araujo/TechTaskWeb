import ITarefa from "./ITarefas";

export default interface iUsuario {
  id?: number;
  nome: string;
  email: string;
  organizacao?: string;
  tarefas?: ITarefa[];
}
