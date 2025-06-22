//Importando funções
import {getCharacterFromURL} from "./sections-creation-edit/character_functions.js";
// Script simples de impressão - equivalente ao Ctrl+P
let currentCharacter;
document.addEventListener('DOMContentLoaded', function() {
    //Inicia Personagem
     currentCharacter = getCharacterFromURL();
    // Cria o botão "Editar Ficha" (estilo semelhante ao de imprimir)
    const editButton = document.createElement('button');
    editButton.id = 'btn-editar';
    editButton.innerHTML = '✏️ Editar Ficha';
    
    // Estilos do botão (ajuste conforme seu tema)
    editButton.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: linear-gradient(135deg, #4a90e2, #357abd);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    // Efeitos hover
    editButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 16px rgba(74, 144, 226, 0.4)';
        this.style.background = 'linear-gradient(135deg, #357abd, #2c5f8a)';
    });
    
    editButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.3)';
        this.style.background = 'linear-gradient(135deg, #4a90e2, #357abd)';
    });

    // Ação do botão - Redireciona para edição com ID
    editButton.addEventListener('click', function() {
        if (currentCharacter && currentCharacter.id) {
            window.location.href = `create_edit_character.html?id=${currentCharacter.id}`;
        } else {
            alert('Personagem não carregado corretamente');
        }
    });

    // Adiciona o botão ao corpo do documento
    document.body.appendChild(editButton);
    // Criar o botão de imprimir
    const printButton = document.createElement('button');
    printButton.id = 'btn-imprimir';
    printButton.innerHTML = '🖨️ Imprimir Ficha';
    
    // Estilos do botão
    printButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4a90e2, #357abd);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    
    // Efeitos hover do botão
    printButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 16px rgba(74, 144, 226, 0.4)';
        this.style.background = 'linear-gradient(135deg, #357abd, #2c5f8a)';
    });
    
    printButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.3)';
        this.style.background = 'linear-gradient(135deg, #4a90e2, #357abd)';
    });
    
    // Adicionar o botão ao body
    document.body.appendChild(printButton);
    
    // Adicionar CSS para ocultar o botão na impressão
    const printCSS = document.createElement('style');
    printCSS.innerHTML = `
        @media print {
            #btn-imprimir {
                display: none !important;
            }
            #btn-editar {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(printCSS);
    
    // Função de impressão - simplesmente chama window.print()
    printButton.addEventListener('click', function() {
        window.print();
    });
    window.addEventListener('popstate', function() {
    if (currentCharacter?.id && document.referrer.includes('create_edit_character.html')) {
        window.location.href = `create_edit_character.html?id=${currentCharacter.id}`;
    }
});
});