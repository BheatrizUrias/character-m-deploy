export async function populateBackgroundSection(currentCharacter) {
  const select = document.getElementById('background-select');
  const nameDiv = document.querySelector('.details-title');
  const descDiv = document.querySelector('.details-description');
  const skillsDescription = document.querySelector('.skills-description')
  const equipmentDescription = document.querySelector('.equipment-description')
  const languageDiv = document.querySelector('.languages')
  const languageOptions = document.querySelector('.languages-options')

  if (!select || !nameDiv || !descDiv) {
    console.error('Elementos não encontrados!');
    return;
  }

  // Limpa e prepara o select
  select.innerHTML = '<option value="" disabled selected>Selecione seu Antecedente</option>';

  try {
    const response = await fetch('./data/background.json');
    const backgrounds = await response.json();

    const languagesList = {
      "common": ["Comum", "Anão", "Élfico", "Gigante", "Gnômico", "Goblin", "Halfling", "Orc"],
      "exotic": ["Abissal", "Celestial", "Primordial (Auran)", "Primordial (Aquan)", "Primordial (Ignan)", "Primordial (Terran)", "Dracônico", "Infernal", "Subcomum", "Silvestre", "Deep Speech", "Undercommon"]
    };

    // Popula as opções do select
    backgrounds.forEach(background => {
      const option = new Option(background.name, background.id);
      select.add(option);
    });

    // Restaura seleção existente
    if (currentCharacter.background?.id) {
      const selectedId = currentCharacter.background.id.toString();
      select.value = selectedId;
      updateDisplay(selectedId);
    }

    // Configura o listener para mudanças
    select.addEventListener('change', (e) => {
      const selectedId = e.target.value;
      updateDisplay(selectedId);

      // Atualiza o personagem
      const selectedBg = backgrounds.find(b => b.id.toString() === selectedId);
      if (selectedBg) {
        currentCharacter.background = {
          id: selectedBg.id,
          name: selectedBg.name,
          description: selectedBg.description
        };
        console.log('Personagem atualizado:', currentCharacter);
      }
    });

    // Função para atualizar a exibição
    function updateDisplay(selectedId) {
      const selected = backgrounds.find(b => b.id.toString() === selectedId);
      if (selected) {
        nameDiv.textContent = selected.name;
        descDiv.textContent = selected.description;
        skillsDescription.textContent = selected.skills.join(', ');
        equipmentDescription.textContent = selected.equipment.join(', ');

        currentCharacter.equipment.fromBackground = [] 
        currentCharacter.equipment.fromBackground.push(selected.equipment)

        console.log(currentCharacter)

        // Limpa as opções de língua anteriores
        languageOptions.innerHTML = '';
        languageDiv.textContent = '';

        // Cria os selects de língua (se o antecedente conceder)
        if (selected.languages && selected.languages > 0) {
          const languageTitle = document.createElement('h4');
          languageDiv.textContent = "Idiomas";
          languageTitle.textContent = 'Escolha suas línguas:';
          languageOptions.appendChild(languageTitle);

          for (let i = 0; i < selected.languages; i++) {
            const languageGroup = document.createElement('div');
            languageGroup.className = 'language-select-group';

            const label = document.createElement('label');
            label.textContent = `Língua ${i + 1}:`;
            label.htmlFor = `language-select-${i}`;

            const select = document.createElement('select');
            select.className = 'language-select';
            select.id = `language-select-${i}`;
            select.name = `language-select-${i}`;
            select.dataset.index = i;


            // Adiciona opções padrão ("Comum" como default)
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Selecione uma língua';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            select.appendChild(defaultOption);

            // Adiciona línguas comuns
            const commonGroup = document.createElement('optgroup');
            commonGroup.label = 'Comuns';
            languagesList.common.forEach(lang => {
              const option = document.createElement('option');
              option.value = lang;
              option.textContent = lang;
              commonGroup.appendChild(option);
            });
            select.appendChild(commonGroup);

            // Adiciona línguas exóticas (se permitido)
            const exoticGroup = document.createElement('optgroup');
            exoticGroup.label = 'Exóticas';
            languagesList.exotic.forEach(lang => {
              const option = document.createElement('option');
              option.value = lang;
              option.textContent = lang;
              exoticGroup.appendChild(option);
            });
            select.appendChild(exoticGroup);

            // Adiciona ao DOM
            languageGroup.appendChild(label);
            languageGroup.appendChild(select);
            languageOptions.appendChild(languageGroup);

            select.addEventListener('change', (e) => {
              if (!currentCharacter.background.languages) {
                currentCharacter.background.languages = [];
              }
              const index = parseInt(e.target.dataset.index);
              currentCharacter.background.languages[index] = e.target.value;
            });
          }
        }
      } else {
        nameDiv.textContent = "Nome do Antecedente";
        descDiv.textContent = "Descrição";
        languageOptions.innerHTML = '';
      }
    }

  } catch (error) {
    console.error("Erro ao carregar antecedentes:", error);
    nameDiv.textContent = "Erro ao carregar dados";
    descDiv.textContent = "";
  }
}
