import { pageNav, bindClickNavigation } from "./components.js";

// Quando o DOM estiver pronto, carrega o header no container
document.addEventListener('DOMContentLoaded', () => {
 
  // Navbar
bindClickNavigation("#link-salvos", "saved_characters.html");
bindClickNavigation("#link-login", "login.html");


// Landing Page
bindClickNavigation("#CriarFicha", "create_edit_character.html");
bindClickNavigation("#Cadastre-se", "login.html");



});