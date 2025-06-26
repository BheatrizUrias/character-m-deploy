export const update_sheet = (personagem) => {
  //Nome
  document.querySelector(".nome-personagem .valor").textContent =
    personagem.name;
  //Classe e nível
  document.querySelector("#classe-nivel .valor").textContent =
    personagem.class.name + " " + personagem.level;
  // Antecedente
  document.querySelector("#antecedente .valor").textContent =
    personagem.background.name;
  // Raça
  document.querySelector("#raca .valor").textContent = personagem.species.name;
  //habilidades
  document.querySelector("#for .quadrado-valor").textContent =
    personagem.abilities.strength;
  document.querySelector("#dex .quadrado-valor").textContent =
    personagem.abilities.dexterity;
  document.querySelector("#con .quadrado-valor").textContent =
    personagem.abilities.constitution;
  document.querySelector("#int .quadrado-valor").textContent =
    personagem.abilities.intelligence;
  document.querySelector("#sab .quadrado-valor").textContent =
    personagem.abilities.wisdom;
  document.querySelector("#car .quadrado-valor").textContent =
    personagem.abilities.charisma;

  //modificadores
  document.querySelector("#for .modificador-habilidade").textContent =
    formatarMod(personagem.abilities.strength);
  document.querySelector("#dex .modificador-habilidade").textContent =
    formatarMod(personagem.abilities.dexterity);
  document.querySelector("#con .modificador-habilidade").textContent =
    formatarMod(personagem.abilities.constitution);
  document.querySelector("#int .modificador-habilidade").textContent =
    formatarMod(personagem.abilities.intelligence);
  document.querySelector("#sab .modificador-habilidade").textContent =
    formatarMod(personagem.abilities.wisdom);
  document.querySelector("#car .modificador-habilidade").textContent =
    formatarMod(personagem.abilities.charisma);

  //bonus de proficiencia
  document.querySelector("#proficiencia").textContent =
    calcularBonusProficiencia(personagem.level);

  //dado de vida
  document.querySelector("#dados_vida").textContent =
  "  " + personagem.class.hit_dice + "  " ;
 // pv total
 document.querySelector("#pv").textContent =
 "  " + calcularPVTotal(personagem) + "  ";
  console.log("Ficha Atualizada");
};

//calcula o modificador a partir do habilidade
function formatarMod(valor) {
  const mod = Math.floor((valor - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

//calcula bonus de proficiencia
function calcularBonusProficiencia(level) {
  let bonus = 2;
  if (level >= 17) bonus = 6;
  else if (level >= 13) bonus = 5;
  else if (level >= 9) bonus = 4;
  else if (level >= 5) bonus = 3;
  // retorna com sinal
  return `+${bonus}`;
}

function calcularPVTotal(personagem) {
  let maxDadoVida;

  switch (personagem.class.hit_dice) {
    case "d4":
      maxDadoVida = 4;
      break;
    case "d6":
      maxDadoVida = 6;
      break;
    case "d8":
      maxDadoVida = 8;
      break;
    case "d10":
      maxDadoVida = 10;
      break;
    case "d12":
      maxDadoVida = 12;
      break;
    default:
      console.warn("Dado de vida inválido:", personagem.class.hit_dice);
      return null;
  }

  const modificadorCon = Math.floor((personagem.abilities.constitution - 10) / 2);
  return maxDadoVida + modificadorCon;
}
