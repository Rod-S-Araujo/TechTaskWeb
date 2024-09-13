import styles from "./Footer.module.css";
import logo from "../../../public/images/logo.png";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <img src={logo} alt="Logo TechTask" />
      <div>
        <h4>TechTask</h4>
        <h5>App ficticio desenvolvido por Rodrigo Araujo</h5>
        <h6>Code chalenge aplicado por Stefanini</h6>
      </div>
    </footer>
  );
};

export default Footer;
