import { bindClickNavigation } from "./components.js";
import { createNewCharacter,saveCharacter, getCharacterFromURL} from "./sections-creation-edit/character_functions.js";

// Importar as funções específicas de cada seção
import { populateClassSection } from "./sections-creation-edit/class_editor.js";
import { populateBackgroundSection } from "./sections-creation-edit/background_editor.js";
import { populateSpeciesSection } from "./sections-creation-edit/species_editor.js";
import { populateAbilitiesSection } from "./sections-creation-edit/abilities_editor.js";
import { populateEquipmentSection } from "./sections-creation-edit/equipment_editor.js";

let currentCharacter;

// Cache para armazenar os conteúdos parciais já carregados
const partialsCache = new Map();

// Função que decide qual função específica chamar conforme a seção
function populateData(section) {
  switch (section) {
    case 'class':
      populateClassSection(currentCharacter);
      break;
    case 'background':
      populateBackgroundSection(currentCharacter);
      break;
    case 'species':
      populateSpeciesSection(currentCharacter);
      break;
    case 'abilities':
      populateAbilitiesSection(currentCharacter);
      break;
    case 'equipment':
      populateEquipmentSection(currentCharacter);
      break;
  }
}

// Função para carregar seções parciais com cache
async function loadPartialContent(section) {
  // Mapeamento MANUAL dos arquivos HTML
  const htmlFiles = {
    'class': './partials/escolha-classe.html',
    'background': './partials/escolha-antecedente.html',
    'species': './partials/escolha-raca.html',
    'abilities': './partials/escolha-atributos.html',
    'equipment': './partials/escolha-equipamentos.html'
  };

  const main = document.querySelector('main');
  if (!main || !htmlFiles[section]) return;

  // Verifica se o conteúdo já está em cache
  if (partialsCache.has(section)) {
    main.innerHTML = partialsCache.get(section);

    // Chama a função que popula os dados da seção ativa
    populateData(section);
    return;
  }

  try {
    const response = await fetch(htmlFiles[section]);
    const htmlContent = await response.text();

    // Armazena no cache
    partialsCache.set(section, htmlContent);

    main.innerHTML = htmlContent;

    // Chama a função que popula os dados da seção ativa
    populateData(section);
  } catch {
    const errorContent = `<div>Erro ao carregar: ${section}</div>`;
    partialsCache.set(section, errorContent);
    main.innerHTML = errorContent;
  }
}


document.addEventListener('DOMContentLoaded', () => {
  // Criar personagem
  // Verifica se há um ID na URL, se sim, carrega o personagem existente
  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get('id');
  
  if (characterId) {
    currentCharacter = getCharacterFromURL();
    if (!currentCharacter) {
      // Se não encontrar o personagem, cria um novo
      currentCharacter = createNewCharacter();
    }
  } else {
    // Se não houver ID na URL, cria um novo personagem
    currentCharacter = createNewCharacter();
  }

  // Navbar principal
  bindClickNavigation("#link-salvos", "saved_characters.html");
  bindClickNavigation("#link-login", "login.html");

  // Navegação secundária - Listeners para cada botão
  const buttons = document.querySelectorAll('.secondary-nav .button-container .button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove a classe 'selected' de todos os botões
      buttons.forEach(btn => btn.classList.remove('selected'));

      // Adiciona a classe 'selected' no botão clicado
      button.classList.add('selected');

      // Carrega o conteúdo parcial correspondente
      const section = button.id.replace('-btn', '');
      loadPartialContent(section);
    });
  });

  // Carrega a primeira seção por padrão
  if (buttons.length > 0) {
    buttons[0].classList.add('selected');
    loadPartialContent(buttons[0].id.replace('-btn', ''));
  }
 //Funções do botão de visualizar a ficha
document.querySelector('.next-button').addEventListener('click', () => {
  if (currentCharacter) {
    if (confirm("Deseja salvar o personagem localmente e visualizar a ficha?")) {
      saveCharacter(currentCharacter); // Salva no localStorage
      // Redireciona com o ID do personagem na URL
      window.location.href = `view_character_sheet.html?id=${currentCharacter.id}`;
    }
  }
});

});
