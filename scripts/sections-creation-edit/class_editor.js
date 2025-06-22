function createAndPopulateEquipmentSelect(selectElement, itemChoice, classData, allEquipments) {
  const defaultItemOption = document.createElement('option');
  defaultItemOption.value = '';
  defaultItemOption.textContent = `Selecione ${itemChoice.type}`;
  defaultItemOption.disabled = true;
  defaultItemOption.selected = true;
  selectElement.appendChild(defaultItemOption);

  itemChoice.options.forEach(optionText => {
    if (optionText.includes("Qualquer ")) {
      const genericType = optionText.replace("Qualquer ", "").trim();
      let itemsToAdd = [];
      let optgroupLabel = genericType;

      // Handle "Arma marcial corpo-a-corpo"
      if (genericType === "arma marcial corpo-a-corpo" && classData.weapon_proficiencies.includes("Armas marciais")) {
        itemsToAdd = allEquipments.martial_weapons_melee || [];
        optgroupLabel = "Armas Marciais Corpo-a-corpo";
      }
      // Handle "Arma marcial" (general)
      else if ((genericType === "arma marcial" || genericType === "Arma marcial") && classData.weapon_proficiencies.includes("Armas marciais")) {
        itemsToAdd = [...(allEquipments.martial_weapons_melee || []), ...(allEquipments.martial_weapon_range || [])];
        optgroupLabel = "Armas Marciais (todas)";
      }
      // Handle "Arma simples"
      else if ((genericType === "arma simples" || genericType === "Arma simples") && classData.weapon_proficiencies.includes("Armas simples")) {
        itemsToAdd = allEquipments.simple_weapons || [];
        optgroupLabel = "Armas Simples";
      }
      // Handle "Arma" (generic, for Bardo, etc.)
      else if (genericType === "Arma" || itemChoice.type === "Arma") {
          if (classData.weapon_proficiencies.includes("Armas simples")) {
              const simpleGroup = document.createElement('optgroup');
              simpleGroup.label = "Armas Simples";
              (allEquipments.simple_weapons || []).forEach(item => {
                  const opt = document.createElement('option');
                  opt.value = item;
                  opt.textContent = item;
                  simpleGroup.appendChild(opt);
              });
              if (simpleGroup.children.length > 0) selectElement.appendChild(simpleGroup);
          }
          if (classData.weapon_proficiencies.includes("Armas marciais")) {
              const martialMeleeGroup = document.createElement('optgroup');
              martialMeleeGroup.label = "Armas Marciais Corpo-a-corpo";
              (allEquipments.martial_weapons_melee || []).forEach(item => {
                  const opt = document.createElement('option');
                  opt.value = item;
                  opt.textContent = item;
                  martialMeleeGroup.appendChild(opt);
              });
              if (martialMeleeGroup.children.length > 0) selectElement.appendChild(martialMeleeGroup);

              const martialRangeGroup = document.createElement('optgroup');
              martialRangeGroup.label = "Armas Marciais à Distância";
              (allEquipments.martial_weapon_range || []).forEach(item => {
                  const opt = document.createElement('option');
                  opt.value = item;
                  opt.textContent = item;
                  martialRangeGroup.appendChild(opt);
              });
              if (martialRangeGroup.children.length > 0) selectElement.appendChild(martialRangeGroup);
          }
          itemsToAdd = [];
      }
      // Handle "Proteção" - Armaduras e Escudos
      else if (genericType === "Proteção" || itemChoice.type === "Proteção") {
          if (classData.armor_proficiencies.includes("Armaduras leves") && allEquipments.armors.light) {
              const lightArmorGroup = document.createElement('optgroup');
              lightArmorGroup.label = "Armaduras Leves";
              allEquipments.armors.light.forEach(item => {
                  const opt = document.createElement('option');
                  opt.value = item;
                  opt.textContent = item;
                  lightArmorGroup.appendChild(opt);
              });
              if (lightArmorGroup.children.length > 0) selectElement.appendChild(lightArmorGroup);
          }
          if (classData.armor_proficiencies.includes("Armaduras médias") && allEquipments.armors.medium) {
              const mediumArmorGroup = document.createElement('optgroup');
              mediumArmorGroup.label = "Armaduras Médias";
              allEquipments.armors.medium.forEach(item => {
                  const opt = document.createElement('option');
                  opt.value = item;
                  opt.textContent = item;
                  mediumArmorGroup.appendChild(opt);
              });
              if (mediumArmorGroup.children.length > 0) selectElement.appendChild(mediumArmorGroup);
          }
          if (classData.armor_proficiencies.includes("Escudos") && allEquipments.armors.shields) {
              const shieldsGroup = document.createElement('optgroup');
              shieldsGroup.label = "Escudos";
              allEquipments.armors.shields.forEach(item => {
                  const opt = document.createElement('option');
                  opt.value = item;
                  opt.textContent = item;
                  shieldsGroup.appendChild(opt);
              });
              if (shieldsGroup.children.length > 0) selectElement.appendChild(shieldsGroup);
          }
          itemsToAdd = [];
      }
      // Handle other generic types not explicitly defined (e.g., "Instrumento musical")
      else if (allEquipments[genericType.toLowerCase().replace(/\s+/g, '_')]) {
          itemsToAdd = allEquipments[genericType.toLowerCase().replace(/\s+/g, '_')] || [];
          optgroupLabel = genericType;
      }

      if (itemsToAdd.length > 0) {
        const optGroup = document.createElement('optgroup');
        optGroup.label = optgroupLabel;
        itemsToAdd.forEach(item => {
          const opt = document.createElement('option');
          opt.value = item;
          opt.textContent = item;
          optGroup.appendChild(opt);
        });
        selectElement.appendChild(optGroup);
      }
    } else {
      const opt = document.createElement('option');
      opt.value = optionText;
      opt.textContent = optionText;
      selectElement.appendChild(opt);
    }
  });
}

export async function populateClassSection(currentCharacter) {
  const select = document.getElementById('class-select');
  const className = document.querySelector('.class-name');
  const classDescription = document.querySelector('.class-description');
  const hitDice = document.querySelector('.hit-dice-description');
  const primaryAbility = document.querySelector('.primary-ability-description');
  const proficiencies = document.querySelector('.proficiencies-description');
  const equipmentContainer = document.querySelector('.equipment-options');

  if (!select || !className || !classDescription) {
    console.error('Elementos não encontrados!');
    return;
  }

  select.innerHTML = '<option value="" disabled selected>Selecione sua Classe</option>';

  try {
    const classResponse = await fetch('./data/class.json');
    const classes = await classResponse.json();

    const equipResponse = await fetch('./data/equipments.json');
    const equipmentsData = await equipResponse.json();
    const allEquipments = equipmentsData[0];

    classes.forEach(classe => {
      const option = new Option(classe.name, classe.id);
      select.add(option);
    });

    const createEquipmentSelects = (classData) => {
      if (!equipmentContainer) return;
      equipmentContainer.innerHTML = '';

      currentCharacter.equipment.fromClass = {};

      // Adiciona itens fixos
      if (classData.starting_equipment.fixed) {
        classData.starting_equipment.fixed.forEach(item => {
          currentCharacter.equipment.fromClass[`fixed_${item.replace(/\s+/g, '_')}`] = item;
          const fixedItemDiv = document.createElement('div');
          fixedItemDiv.className = 'fixed-equipment-item';
          fixedItemDiv.textContent = item;
          equipmentContainer.appendChild(fixedItemDiv);
        });
      }

      // Processa as escolhas
      if (classData.starting_equipment.choices && classData.starting_equipment.choices.length > 0) {
        classData.starting_equipment.choices.forEach((choice, choiceIndex) => {

          if (choice.or_groups && choice.or_groups.length > 0) {
            const orGroupWrapper = document.createElement('div');
            orGroupWrapper.className = 'equipment-or-group-wrapper';

            const orGroupTitle = document.createElement('h4');
            orGroupTitle.className = "details-title";
            orGroupTitle.textContent = `Escolha ${choiceIndex + 1}: Selecione uma das opções de equipamento abaixo:`;
            orGroupWrapper.appendChild(orGroupTitle);

            const orGroupSelect = document.createElement('select');
            orGroupSelect.className = 'or-group-selector';
            orGroupSelect.id = `or-group-select-${choiceIndex}`;
            orGroupSelect.dataset.choiceIndex = choiceIndex;

            const defaultOrOption = document.createElement('option');
            defaultOrOption.value = '';
            defaultOrOption.textContent = `Selecione uma opção de grupo`;
            defaultOrOption.disabled = true;
            defaultOrOption.selected = true;
            orGroupSelect.appendChild(defaultOrOption);

            choice.or_groups.forEach((orOption, orOptionIndex) => {
              const option = document.createElement('option');
              option.value = orOptionIndex;
              option.textContent = orOption.description;
              orGroupSelect.appendChild(option);
            });

            orGroupWrapper.appendChild(orGroupSelect);

            const selectedOrGroupItemsContainer = document.createElement('div');
            selectedOrGroupItemsContainer.className = 'selected-or-group-items-container';
            selectedOrGroupItemsContainer.id = `selected-or-group-items-${choiceIndex}`;
            orGroupWrapper.appendChild(selectedOrGroupItemsContainer);

            orGroupSelect.addEventListener('change', (e) => {
              const selectedOrIndex = parseInt(e.target.value);
              const selectedOrGroup = choice.or_groups[selectedOrIndex];

              currentCharacter.equipment.fromClass[`choice_group_${choiceIndex}`] = [];
              selectedOrGroupItemsContainer.innerHTML = '';

              selectedOrGroup.items.forEach((itemChoice, itemIndex) => {
                for (let i = 0; i < itemChoice.quantity; i++) {
                  const selectContainer = document.createElement('div');
                  selectContainer.className = 'equipment-select-item';

                  const label = document.createElement('label');
                  label.textContent = `${itemChoice.type} ${i + 1}:`;
                  label.htmlFor = `or-group-item-${choiceIndex}-${selectedOrIndex}-${itemIndex}-${i}`; // Use selectedOrIndex

                  const selectElement = document.createElement('select');
                  selectElement.className = 'equipment-select';
                  selectElement.id = `or-group-item-${choiceIndex}-${selectedOrIndex}-${itemIndex}-${i}`;
                  selectElement.name = `or-group-item-${choiceIndex}-${selectedOrIndex}-${itemIndex}-${i}`;
                  selectElement.dataset.choiceIndex = choiceIndex;
                  selectElement.dataset.orOptionIndex = selectedOrIndex;
                  selectElement.dataset.itemChoiceIndex = itemIndex;
                  selectElement.dataset.itemInstanceIndex = i;

                  createAndPopulateEquipmentSelect(selectElement, itemChoice, classData, allEquipments);

                  selectElement.addEventListener('change', (e) => {
                    const currentOrChoiceIndex = parseInt(e.target.dataset.choiceIndex);
                    const currentOrGroupOptionIndex = parseInt(e.target.dataset.orOptionIndex);
                    const currentItemChoiceIndex = parseInt(e.target.dataset.itemChoiceIndex);
                    const currentItemInstanceIndex = parseInt(e.target.dataset.itemInstanceIndex);
                    const selectedValue = e.target.value;
                    const itemType = itemChoice.type;

                    // Ensure the nested structure exists for tracking
                    if (!currentCharacter.equipment.fromClass[`choice_group_${currentOrChoiceIndex}`][currentOrGroupOptionIndex]) {
                      currentCharacter.equipment.fromClass[`choice_group_${currentOrChoiceIndex}`][currentOrGroupOptionIndex] = {};
                    }
                     if (!currentCharacter.equipment.fromClass[`choice_group_${currentOrChoiceIndex}`][currentOrGroupOptionIndex][currentItemChoiceIndex]) {
                      currentCharacter.equipment.fromClass[`choice_group_${currentOrChoiceIndex}`][currentOrGroupOptionIndex][currentItemChoiceIndex] = [];
                    }
                    currentCharacter.equipment.fromClass[`choice_group_${currentOrChoiceIndex}`][currentOrGroupOptionIndex][currentItemChoiceIndex][currentItemInstanceIndex] = `${selectedValue} (${itemType})`;
                    console.log('Equipamentos atualizados (classe):', currentCharacter.equipment.fromClass);
                  });

                  selectContainer.appendChild(label);
                  selectContainer.appendChild(selectElement);
                  selectedOrGroupItemsContainer.appendChild(selectContainer);
                }
              });
            });

            equipmentContainer.appendChild(orGroupWrapper);

          } else {
            const choiceGroupWrapper = document.createElement('div');
            choiceGroupWrapper.className = 'equipment-choice-wrapper';

            const choiceLabel = document.createElement('h4');
            choiceLabel.className = "details-title"
            choiceLabel.textContent = `Escolha ${choiceIndex + 1}: (${choice.quantity} ${choice.type})`;
            choiceGroupWrapper.appendChild(choiceLabel);

            for (let i = 0; i < choice.quantity; i++) {
              const selectContainer = document.createElement('div');
              selectContainer.className = 'equipment-select-item';

              const selectElement = document.createElement('select');
              selectElement.className = 'equipment-select';
              selectElement.id = `equipment-select-${choiceIndex}-${i}`;
              selectElement.name = `equipment-select-${choiceIndex}-${i}`;
              selectElement.dataset.choiceIndex = choiceIndex;
              selectElement.dataset.itemIndex = i;

              createAndPopulateEquipmentSelect(selectElement, choice, classData, allEquipments);

              selectElement.addEventListener('change', (e) => {
                const currentChoiceIndex = parseInt(e.target.dataset.choiceIndex);
                const currentItemIndex = parseInt(e.target.dataset.itemIndex);
                const selectedValue = e.target.value;

                if (!currentCharacter.equipment.fromClass[`choice_group_${currentChoiceIndex}`]) {
                    currentCharacter.equipment.fromClass[`choice_group_${currentChoiceIndex}`] = [];
                }
                currentCharacter.equipment.fromClass[`choice_group_${currentChoiceIndex}`][currentItemIndex] = `${selectedValue} (${choice.type})`;
                console.log('Equipamentos atualizados (classe):', currentCharacter.equipment.fromClass);
              });

              selectContainer.appendChild(selectElement);
              choiceGroupWrapper.appendChild(selectContainer);
            }
            equipmentContainer.appendChild(choiceGroupWrapper);
          }
        });
      }
    };

    const updateDisplay = (selectedId) => {
      const selected = classes.find(c => c.id.toString() === selectedId);

      if (selected) {
        className.textContent = selected.name;
        classDescription.textContent = selected.description;
        hitDice.textContent = selected.hit_dice;
        primaryAbility.textContent = selected.primary_ability;

        const allProficiencies = [...selected.weapon_proficiencies, ...selected.armor_proficiencies];
        proficiencies.textContent = allProficiencies.join(', ');

        currentCharacter.class = {
          id: selected.id,
          name: selected.name,
          description: selected.description,
          hit_dice: selected.hit_dice,
          primary_ability: selected.primary_ability,
          weapon_proficiencies: selected.weapon_proficiencies,
          armor_proficiencies: selected.armor_proficiencies
        };

        createEquipmentSelects(selected);
      } else {
        className.textContent = "Nome da Classe";
        classDescription.textContent = "Descrição";
        hitDice.textContent = "";
        primaryAbility.textContent = "";
        proficiencies.textContent = "";
        if (equipmentContainer) equipmentContainer.innerHTML = '';
      }
    };

    if (currentCharacter.class?.id) {
      const selectedId = currentCharacter.class.id.toString();
      select.value = selectedId;
      updateDisplay(selectedId);
    }

    select.addEventListener('change', (e) => {
      updateDisplay(e.target.value);
    });

  } catch (error) {
    console.error("Erro ao carregar classes:", error);
    className.textContent = "Erro ao carregar dados";
    classDescription.textContent = "";
    if (equipmentContainer) equipmentContainer.innerHTML = '';
  }
}