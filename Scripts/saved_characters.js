// scripts/character-list.js
import { getAllCharacters, deleteCharacter } from './sections-creation-edit/character_functions.js';

document.addEventListener('DOMContentLoaded', () => {
  // Carrega e exibe os personagens
  loadCharacters();
});

// Função para carregar e exibir os personagens
function loadCharacters() {
  const characters = getAllCharacters();
  const charactersList = document.getElementById('characters-list');
  
  // Limpa a lista atual
  charactersList.innerHTML = '';
  
  if (characters.length === 0) {
    // Exibe mensagem quando não há personagens
    const row = document.createElement('tr');
    row.className = 'no-characters';
    const cell = document.createElement('td');
    cell.colSpan = 4;
    cell.textContent = 'Nenhum personagem salvo ainda.';
    row.appendChild(cell);
    charactersList.appendChild(row);
    return;
  }
  
  // Ordena personagens por data de modificação (mais recente primeiro)
  characters.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
  
  // Adiciona cada personagem à tabela
  characters.forEach(character => {
    const row = document.createElement('tr');
    
    // Célula do Nome
    const nameCell = document.createElement('td');
    nameCell.textContent = character.name;
    row.appendChild(nameCell);
    
    // Célula da Raça
    const speciesCell = document.createElement('td');
    speciesCell.textContent = character.species.name || 'Não definido';
    row.appendChild(speciesCell);
    
    // Célula da Classe
    const classCell = document.createElement('td');
    classCell.textContent = character.class.name || 'Não definido';
    row.appendChild(classCell);
    
    // Célula de Ações
    const actionsCell = document.createElement('td');
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'action-buttons';
    
    // Botão Ver Ficha
    const viewBtn = document.createElement('button');
    viewBtn.className = 'action-button';
    viewBtn.textContent = 'Ver ficha';
    viewBtn.addEventListener('click', () => viewCharacterSheet(character.id));
    actionsDiv.appendChild(viewBtn);
    
    // Botão Editar
    const editBtn = document.createElement('button');
    editBtn.className = 'action-button';
    editBtn.textContent = 'Editar';
    editBtn.addEventListener('click', () => editCharacter(character.id));
    actionsDiv.appendChild(editBtn);
    
    // Botão Deletar
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-button delete-btn';
    deleteBtn.textContent = 'Deletar';
    deleteBtn.addEventListener('click', () => confirmDelete(character.id, character.name));
    actionsDiv.appendChild(deleteBtn);
    
    actionsCell.appendChild(actionsDiv);
    row.appendChild(actionsCell);
    
    charactersList.appendChild(row);
  });
}

// Função para confirmar a exclusão de um personagem
function confirmDelete(characterId, characterName) {
  if (confirm(`Tem certeza que deseja excluir o personagem "${characterName}"? Esta ação não pode ser desfeita.`)) {
    const success = deleteCharacter(characterId);
    if (success) {
      alert('Personagem excluído com sucesso!');
      loadCharacters(); // Recarrega a lista
    } else {
      alert('Ocorreu um erro ao excluir o personagem.');
    }
  }
}

// Função para editar um personagem
function editCharacter(characterId) {
  console.log(`Editar personagem com ID: ${characterId}`);
  // Redirecionar para a página de edição com o ID do personagem
  window.location.href = `create_edit_character.html?id=${characterId}`;
}

// Função para visualizar a ficha do personagem
function viewCharacterSheet(characterId) {
  console.log(`Visualizar ficha do personagem com ID: ${characterId}`);
  // Redirecionar para a página de visualização com o ID do personagem
  window.location.href = `view_character_sheet.html?id=${characterId}`;
}