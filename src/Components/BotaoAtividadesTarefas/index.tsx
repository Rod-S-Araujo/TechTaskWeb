import styles from "./BotaoAtividadesTarefas.module.css";

interface BotaoAtividadesProps {
  logo: string;
  children: string;
  onCLick: () => void;
}

const BotaoAtividades = ({ logo, children, onCLick }: BotaoAtividadesProps) => {
  return (
    <button className={styles.botaoAtividades} onClick={onCLick}>
      <img src={logo} alt={`Imagem para reaalizar a fução de ${children}`} />
      {children}
    </button>
  );
};

export default BotaoAtividades;
