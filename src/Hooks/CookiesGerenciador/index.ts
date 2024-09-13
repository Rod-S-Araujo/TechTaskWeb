// Para manter um sistema similar ao de login de um usuario decidi utilizar os cookies para armazenar o email do usuario.
const cookieGerenciador = {
  //guarda o email em um cookie chamado userEmail
  guardarCookieEmail(email: string) {
    document.cookie = `userEmail=${email}; path=/;`;
  },
  //faz a busca dentro dos cookies em um que corresponda a userEmail fazendo a leitura até o primeiro ;
  getCookieEmail(): string | null {
    const cookieEmail = document.cookie.match(
      new RegExp("(^| )userEmail=([^;]+)")
    );
    return cookieEmail ? cookieEmail[2] : null;
  },
  // transforma o userEmail em vazio e coloca um max-agr de 0 para que ele seja imediatamente excluido.
  deleteCookieEmail() {
    document.cookie = "userEmail=; path=/; max-age=0";
  },
  // verifica se existe algum usuario nos cookies e retorna um boolean
  ehConectado(): boolean {
    return this.getCookieEmail() !== null;
  },
};

export default cookieGerenciador;
