

// Estrutura base de um personagem
export const createNewCharacter = () => {
  const newCharacter = {
    id: Date.now().toString(),
    name: "Novo Personagem",
    class: {
      id: null,
      name: null,
    },
    background: {
      id: null,
      name: null,
      description: null,
    },
    species: {
      id: null,
      name: null,
      subrace_id: null,
      subrace_name: null,
      ability_bonus: {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0
      }
    },
    abilities: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0
    },
    total_abilities: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0
    },
    equipment: [],
    skills: [],
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  };

  // Log para testes
  console.log("Personagem criado:", newCharacter);
  return newCharacter;
};

// Salva um personagem no LocalStorage
export const saveCharacter = (character) => {
  try {
    const characters = getAllCharacters();
    const existingIndex = characters.findIndex(c => c.id === character.id);

    character.lastModified = new Date().toISOString();

    if (existingIndex >= 0) {
      characters[existingIndex] = character;
      console.log(`Personagem com ID ${character.id} atualizado com sucesso!`);
    } else {
      characters.push(character);
      console.log(`Novo personagem com ID ${character.id} adicionado com sucesso!`);
    }

    localStorage.setItem('characters', JSON.stringify(characters));
    console.log("Lista de personagens salva no localStorage."); // Log adicional
    return true;
  } catch (error) {
    console.error("Erro ao salvar personagem:", error);
    return false;
  }
};

// Carrega todos os personagens do LocalStorage
export const getAllCharacters = () => {
  try {
    const characters = localStorage.getItem('characters');
    return characters ? JSON.parse(characters) : [];
  } catch (error) {
    console.error("Erro ao carregar personagens:", error);
    return [];
  }
};

// Carrega um personagem específico por ID
export const getCharacterById = (id) => {
  const characters = getAllCharacters();
  return characters.find(c => c.id === id) || null;
};

// Remove um personagem do LocalStorage
export const deleteCharacter = (id) => {
  try {
    const characters = getAllCharacters();
    const updatedCharacters = characters.filter(c => c.id !== id);
    localStorage.setItem('characters', JSON.stringify(updatedCharacters));
    return true;
  } catch (error) {
    console.error("Erro ao deletar personagem:", error);
    return false;
  }
};

// Atualiza propriedades específicas de um personagem
export const updateCharacter = (id, updates) => {
  try {
    const characters = getAllCharacters();
    const characterIndex = characters.findIndex(c => c.id === id);

    if (characterIndex >= 0) {
      characters[characterIndex] = {
        ...characters[characterIndex],
        ...updates,
        lastModified: new Date().toISOString()
      };
      localStorage.setItem('characters', JSON.stringify(characters));
      return characters[characterIndex];
    }
    return null;
  } catch (error) {
    console.error("Erro ao atualizar personagem:", error);
    return null;
  }
};

export const getCharacterFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get('id');
  
  if (!characterId) {
    console.error('ID não encontrado na URL');
    return null;
  }
  
  const character = getCharacterById(characterId);
  
  if (character) {
    console.log('Personagem importado');
    console.log('Personagem:', character);
    return character;
  }
  
  console.error(`Personagem ID ${characterId} não encontrado`);
  return null;
};