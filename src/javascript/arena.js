// Uma lista simulada de cartas apenas com nomes para prototipar
const rosterCards = [
  "Guerreiro", "Mago", "Ladino", "Clérigo", "Paladino", 
  "Ranger", "Bárbaro", "Bardo", "Druida", "Feiticeiro"
];

let cartaSelecionada = null;
let cartasPosicionadas = 0;

const rosterContainer = document.getElementById('roster');
const playerSlots = document.querySelectorAll('.player-slot');
const btnStart = document.getElementById('btn-start');

// 1. Renderiza as opções de cartas na mão
rosterCards.forEach((nome, index) => {
  const cardEl = document.createElement('div');
  cardEl.className = 'mini-card';
  cardEl.textContent = nome;
  cardEl.dataset.name = nome;
  cardEl.dataset.id = index;

  // Evento de selecionar a carta da mão
  cardEl.addEventListener('click', () => {
    // Tira a seleção das outras
    document.querySelectorAll('.mini-card').forEach(c => c.classList.remove('selected'));
    
    cartaSelecionada = cardEl;
    cardEl.classList.add('selected');
  });

  rosterContainer.appendChild(cardEl);
});

// 2. Lógica de colocar a carta no slot da Arena
playerSlots.forEach(slot => {
  slot.addEventListener('click', () => {
    
    // Se o slot já tiver uma carta, podemos removê-la para o deck
    if (slot.innerHTML !== '') {
      const idDevolvido = slot.dataset.cardId;
      document.querySelector(`.mini-card[data-id="${idDevolvido}"]`).classList.remove('used');
      slot.innerHTML = '';
      delete slot.dataset.cardId;
      cartasPosicionadas--;
      verificaProntidao();
      return;
    }

    // Se o slot estiver vazio e tivermos uma carta selecionada na mão
    if (cartaSelecionada) {
      // Clona o visual da miniatura pro slot
      slot.innerHTML = cartaSelecionada.innerHTML;
      slot.style.color = '#fff';
      slot.dataset.cardId = cartaSelecionada.dataset.id;
      
      // Marca a carta da mão como "usada"
      cartaSelecionada.classList.remove('selected');
      cartaSelecionada.classList.add('used');
      cartaSelecionada = null; // Reseta a seleção
      
      cartasPosicionadas++;
      verificaProntidao();
    }
  });
});

// 3. Libera o botão de Batalha quando tiver 5 cartas em campo
function verificaProntidao() {
  if (cartasPosicionadas === 5) {
    btnStart.disabled = false;
  } else {
    btnStart.disabled = true;
  }
}

// 4. Iniciar Batalha
btnStart.addEventListener('click', () => {
  alert("Deck travado! A batalha vai começar.");
  // Aqui no futuro você oculta a div 'selection-area' e revela as cartas do inimigo
  document.getElementById('selection-area').style.display = 'none';
});