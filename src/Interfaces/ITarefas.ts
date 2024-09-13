export default interface ITarefa {
  id?: number;
  tarefa: string;
  descricao: string;
  urgencia: string;
  insercao: Date;
  prazo: Date;
  estado: string;
  idUsuario: number;
}
