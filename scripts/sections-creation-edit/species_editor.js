export async function populateSpeciesSection(currentCharacter) {
  const select = document.getElementById('species-select');
  const nameDiv = document.querySelector('.details-title');
  const descDiv = document.querySelector('.details-description');
  const traitDiv = document.querySelector('.details-traits');
  const subraceContainer = document.getElementById('subrace-container');
  const subraceSelect = document.getElementById('subrace-select');
  const subraceDescDiv = document.querySelector('.subrace-description');
  const subraceTraitDiv = document.querySelector('.subrace-traits');

  if (!select || !nameDiv || !descDiv) {
    console.error('Elementos não encontrados!');
    return;
  }

  // Limpa e prepara o select
  select.innerHTML = '<option value="" disabled selected>Selecione sua Raça:</option>';

  try {
    const response = await fetch('./Data/species.json');
    const speciesList = await response.json();

    speciesList.forEach(species => {
      const option = new Option(species.name, species.id);
      select.add(option);
    });

    if (currentCharacter.species?.id) {
      const selectedId = currentCharacter.species.id.toString();
      select.value = selectedId;
      updateDisplay(selectedId, true); // true = restaurar sub-raça
    }

    select.addEventListener('change', (e) => {
      const selectedId = e.target.value;
      updateDisplay(selectedId, false); // false = resetar sub-raça
      applySpeciesBonuses(selectedId);
    });

    function applySpeciesBonuses(selectedId) {
      const selectedSpecies = speciesList.find(s => s.id.toString() === selectedId);
      if (!selectedSpecies) return;

      // 1. Preserva os valores existentes ou inicializa corretamente
      if (!currentCharacter.abilities) {
        currentCharacter.abilities = {};
      }

      // 2. Aplica apenas os bônus sem modificar os valores base
      const newBonuses = {
        strength: 0, dexterity: 0, constitution: 0,
        intelligence: 0, wisdom: 0, charisma: 0
      };

      // Processa bônus da espécie
      if (Array.isArray(selectedSpecies.ability_bonus)) {
        selectedSpecies.ability_bonus.forEach(bonus => {
          const key = bonus.ability_name?.toLowerCase();
          if (key in newBonuses) newBonuses[key] = bonus.bonus;
        });
      }

      // 3. Atualiza o objeto species mantendo os valores base
      currentCharacter.species = {
        id: selectedSpecies.id,
        name: selectedSpecies.name,
        subrace_id: null,
        subrace_name: null,
        ability_bonus: newBonuses
      };

      console.log('Bônus da espécie aplicados:', newBonuses);
      console.log('Valores atuais:', currentCharacter.abilities);
    }

    // Função para aplicar bônus de sub-raça SEM resetar valores
    function applySubraceBonuses(subrace) {
      if (!subrace || !Array.isArray(subrace.ability_bonus)) return;

      // 1. Cria cópia dos bônus atuais
      const subraceBonuses = { ...currentCharacter.species.ability_bonus };

      // 2. Aplica bônus adicionais da sub-raça
      subrace.ability_bonus.forEach(bonus => {
        const key = bonus.ability_name?.toLowerCase();
        if (key in subraceBonuses) {
          subraceBonuses[key] += bonus.bonus;
        }
      });

      // 3. Atualiza apenas os bônus
      currentCharacter.species.ability_bonus = subraceBonuses;
      currentCharacter.species.subrace_id = subrace.id;
      currentCharacter.species.subrace_name = subrace.subrace_name;

      console.log('Bônus da sub-raça aplicados:', subraceBonuses);
      console.log('Valores atuais:', currentCharacter.abilities);
    }


    function updateDisplay(selectedId, restoreSubrace) {
      const selected = speciesList.find(s => s.id.toString() === selectedId);
      if (!selected) return;

      nameDiv.textContent = selected.name;
      descDiv.textContent = selected.description;

      traitDiv.innerHTML = Array.isArray(selected.traits)
          ? selected.traits.map(trait =>
              `<p><strong class="details-title">${trait.trait_name}:</strong> ${trait.trait_description}</p>`
          ).join('<br>')
          : "Sem traits disponíveis.";

      if (Array.isArray(selected.subraces) && selected.subraces.length > 0) {
        subraceContainer.style.display = 'block';
        subraceSelect.innerHTML = '<option value="" disabled selected>Selecione uma sub-raça:</option>';

        selected.subraces.forEach(sub => {
          const option = new Option(sub.subrace_name, sub.id);
          subraceSelect.add(option);
        });

        subraceDescDiv.textContent = '';
        subraceTraitDiv.textContent = '';

        if (restoreSubrace && currentCharacter.species?.subrace_id) {
          const savedSubrace = selected.subraces.find(s => s.id === currentCharacter.species.subrace_id);
          if (savedSubrace) {
            subraceSelect.value = savedSubrace.id;
            subraceDescDiv.textContent = savedSubrace.subrace_description;
            subraceTraitDiv.innerHTML = savedSubrace.subrace_trait.map(trait =>
                `<p><strong class="details-title">${trait.trait_name}:</strong> ${trait.trait_description}</p>`
            ).join('<br>');

            applySpeciesBonuses(selectedId); // Reset antes de aplicar bônus de sub-raça
            applySubraceBonuses(savedSubrace);
          }
        }

        subraceSelect.onchange = () => {
          const selectedSub = selected.subraces.find(s => s.id.toString() === subraceSelect.value);
          if (selectedSub) {
            // Reset species bonuses antes de aplicar sub-raça
            applySpeciesBonuses(selectedId);
            applySubraceBonuses(selectedSub);

            subraceDescDiv.textContent = selectedSub.subrace_description;
            subraceTraitDiv.innerHTML = selectedSub.subrace_trait.map(trait =>
                `<p><strong class="details-title">${trait.trait_name}:</strong> ${trait.trait_description}</p>`
            ).join('<br>');

            console.log('Personagem atualizado:', currentCharacter);
          }
        };

      } else {
        subraceContainer.style.display = 'none';
        subraceSelect.innerHTML = '';
        subraceDescDiv.textContent = '';
        subraceTraitDiv.textContent = '';
      }
    }

  } catch (error) {
    console.error("Erro ao carregar raças:", error);
    nameDiv.textContent = "Erro ao carregar dados";
    descDiv.textContent = "";
  }
}