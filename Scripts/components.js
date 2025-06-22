// Carrega um arquivo HTML parcial e insere o conteúdo dentro de um elemento da página de acordo com o id fornecido
export async function loadPartial(url, elementId) {
  const response = await fetch(url);
  const html = await response.text();
  document.getElementById(elementId).innerHTML = html;
}


// Navegação com verificação de existência da página
export function pageNav(pagePath) {
  fetch(pagePath, { method: 'HEAD' })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Página não encontrada: ${response.status}`);
      }
      window.location.href = pagePath;
    })
    .catch((error) => {
      console.error('Erro ao navegar:', error);
      alert('Erro ao carregar a página. Verifique se o caminho está correto.');
    });
}

// Vincula eventos de clique para navegar
export function bindClickNavigation(selector, targetPage) {
  const element = document.querySelector(selector);
  if (element) {
    element.addEventListener("click", () => pageNav(targetPage));
  }
}

