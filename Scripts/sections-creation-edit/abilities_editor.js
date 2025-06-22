export function populateAbilitiesSection(currentCharacter) {
  console.log('Seção de Atributos carregada');

  const distributionSelect = document.getElementById('distribution-select');
  const attributeCards = document.querySelectorAll('.attribute-card');
  const attributeOrder = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
  const pointBuyInfo = document.getElementById('pointbuy-info');
  const pointsRemainingSpan = document.getElementById('points-remaining');

  const pointBuyCosts = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
  const maxPoints = 27;
  const standardValues = [15, 14, 13, 12, 10, 8];

  if (!currentCharacter.abilities) {
    currentCharacter.abilities = {};
    attributeOrder.forEach(attr => {
      currentCharacter.abilities[attr] = 8;
    });
  }

  if (!currentCharacter.abilityDistributionMethod) {
    currentCharacter.abilityDistributionMethod = '';
  }

  if (!currentCharacter.rolledValues && currentCharacter.abilityDistributionMethod === "rolling") {
    currentCharacter.rolledValues = [];
  }

  function updateAttributeDisplay(card, base, bonus) {
    const total = base + (bonus || 0);
    const modifier = total > 0 ? Math.floor((total - 10) / 2) : 0;

    card.querySelector('.value-base').textContent = base || '0';
    card.querySelector('.value-bonus').textContent = bonus !== 0 ? `+${bonus}` : '0';
    card.querySelector('.value-total').textContent = total || '0';
    card.querySelector('.value-modifier').textContent = modifier >= 0 ? `+${modifier}` : modifier;
  }

  function getUsedStandardValues() {
    const used = {};
    attributeOrder.forEach(attr => {
      const val = currentCharacter.abilities[attr];
      if (!used[val]) used[val] = 0;
      used[val]++;
    });
    return used;
  }

  function populateSelects(method) {
    attributeCards.forEach((card) => {
      const attr = card.dataset.attribute;
      const select = card.querySelector('.attribute-base-select');
      const racialBonus = currentCharacter.species?.ability_bonus?.[attr] || 0;
      const currentValue = currentCharacter.abilities[attr] || 0;

      select.innerHTML = '';

      // Placeholder option
      const placeholder = document.createElement("option");
      placeholder.value = '';
      placeholder.textContent = '—';
      placeholder.disabled = false;
      select.appendChild(placeholder);

      if (method === "pointbuy") {
        for (let i = 8; i <= 15; i++) {
          const option = document.createElement("option");
          option.value = i;
          option.textContent = i;

          const tempAbilities = { ...currentCharacter.abilities, [attr]: i };
          const simulatedPoints = attributeOrder.reduce((total, key) =>
              total + (pointBuyCosts[tempAbilities[key]] || 0), 0);
          option.disabled = simulatedPoints > maxPoints;

          select.appendChild(option);
        }
      } else if (method === "standard") {
        const usedValues = attributeOrder.reduce((acc, a) => {
          const val = currentCharacter.abilities[a];
          if (val && val !== currentValue) acc.add(val);
          return acc;
        }, new Set());

        standardValues.forEach(val => {
          const option = document.createElement("option");
          option.value = val;
          option.textContent = val;
          option.disabled = usedValues.has(val);
          select.appendChild(option);
        });
      } else if (method === "rolling") {
        if (!currentCharacter.rolledValues || currentCharacter.rolledValues.length === 0) {
          return;
        }

        // Conta quantas vezes cada valor está sendo usado atualmente
        const usedValues = {};
        attributeOrder.forEach(attr => {
          const val = currentCharacter.abilities[attr];
          if (val) usedValues[val] = (usedValues[val] || 0) + 1;
        });

        // Para este atributo específico, conta quantas vezes o valor atual está sendo usado
        const currentValue = currentCharacter.abilities[attr] || 0;
        const currentValueUsage = usedValues[currentValue] || 0;

        // Prepara todos os valores rolados ordenados
        const allRolledValues = [...currentCharacter.rolledValues].sort((a, b) => b - a);

        // Conta quantas vezes cada valor aparece nos resultados rolados
        const rolledCounts = {};
        currentCharacter.rolledValues.forEach(val => {
          rolledCounts[val] = (rolledCounts[val] || 0) + 1;
        });

        // Adiciona todos os valores rolados ao select
        allRolledValues.forEach(val => {
          const option = document.createElement("option");
          option.value = val;
          option.textContent = val;

          // Calcula quantas cópias deste valor já foram usadas
          const usedCopies = usedValues[val] || 0;

          // Habilita a opção se:
          // 1. É o valor atual deste atributo OU
          // 2. Ainda há cópias disponíveis (rolledCounts > usedCopies)
          const isCurrentValue = val === currentValue;
          const hasAvailableCopies = (rolledCounts[val] || 0) > usedCopies;

          option.disabled = !(isCurrentValue || hasAvailableCopies);

          select.appendChild(option);
        });

        // Adiciona o placeholder no início
        select.insertBefore(placeholder, select.firstChild);
      }

      select.value = currentValue || '';
      updateAttributeDisplay(card, currentValue, racialBonus);
    });
  }

  function calculateUsedPoints() {
    return attributeOrder.reduce((total, attr) => {
      return total + (pointBuyCosts[currentCharacter.abilities[attr]] || 0);
    }, 0);
  }

  function setupSelectListeners() {
    attributeCards.forEach((card) => {
      const select = card.querySelector('.attribute-base-select');
      const attr = card.dataset.attribute;

      select.addEventListener('change', (e) => {
        const newValue = e.target.value === '' ? null : parseInt(e.target.value);
        currentCharacter.abilities[attr] = newValue || 0;

        const racialBonus = currentCharacter.species?.ability_bonus?.[attr] || 0;
        updateAttributeDisplay(card, currentCharacter.abilities[attr], racialBonus);

        // Atualiza todos os selects para refletir as mudanças
        attributeCards.forEach(c => {
          const s = c.querySelector('.attribute-base-select');
          const a = c.dataset.attribute;
          if (a !== attr) { // Não atualiza o select que acabou de ser modificado
            const currentVal = currentCharacter.abilities[a] || 0;
            s.value = currentVal;
          }
        });

        if (distributionSelect.value === "pointbuy") {
          pointsRemainingSpan.textContent = maxPoints - calculateUsedPoints();
        }

        // Força a repopulação de todos os selects
        populateSelects(distributionSelect.value);
      });
    });
  }

  function rollAttributes() {
    if (!currentCharacter.rolledValues || currentCharacter.rolledValues.length === 0) {
      currentCharacter.rolledValues = [];
      for (let i = 0; i < 6; i++) {
        const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
        rolls.sort((a, b) => a - b);
        currentCharacter.rolledValues.push(rolls.slice(1).reduce((a, b) => a + b, 0));
      }
      currentCharacter.rolledValues.sort((a, b) => b - a);
    }
  }

  distributionSelect.addEventListener('change', (e) => {
    const method = e.target.value;
    currentCharacter.abilityDistributionMethod = method;

    if (method === "pointbuy") {
      pointBuyInfo.style.display = 'block';
      pointsRemainingSpan.textContent = maxPoints - calculateUsedPoints();
    } else {
      pointBuyInfo.style.display = 'none';
    }

    if (method === "rolling") {
      rollAttributes();
    }

    populateSelects(method);
  });

  // Inicialização
  distributionSelect.value = currentCharacter.abilityDistributionMethod || '';

  if (currentCharacter.abilityDistributionMethod === "rolling") {
    rollAttributes();
  }

  if (currentCharacter.abilityDistributionMethod) {
    distributionSelect.dispatchEvent(new Event('change'));
  } else {
    pointBuyInfo.style.display = 'none';
    pointsRemainingSpan.textContent = '--';
    attributeCards.forEach(card => {
      const attr = card.dataset.attribute;
      const racialBonus = currentCharacter.species?.ability_bonus?.[attr] || 0;
      updateAttributeDisplay(card, currentCharacter.abilities[attr], racialBonus);
    });
  }

  setupSelectListeners();
}