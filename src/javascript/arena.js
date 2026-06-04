/*
  ================================================================
  arena.js — Motor de Batalha Tática D&D Cards
  ================================================================
  Versão 1.0 — Funcionalidades:
    • HP real por carta, com barra visual
    • Ataque básico calculado por atributos (STR/DEX + posição)
    • Habilidades com custo de energia e efeitos mecânicos
    • IA inimiga: escolhe alvos e habilidades estrategicamente
    • Log de batalha com tipos (dano, cura, especial, sistema)
    • Animações de acerto, cura e morte
    • Fim de jogo com overlay (vitória / derrota)
  ================================================================
*/

// ─── Aguarda o script.js carregar os dados das cartas ───────────
document.addEventListener('DOMContentLoaded', () => {

  // ── ESTADO DO JOGO ──────────────────────────────────────────
  let energiaMaxima = 5;
  let energiaAtual  = 5;
  let faseBatalha   = false;
  let turnoNum      = 1;
  let cartasPosicionadas = 0;
  let cartaSelecionada   = null;

  // HP atual de cada carta em campo (chave: slot data-pos)
  const hpAtual = {};

  // Referências inimigos em campo: [{card, slot, hp}]
  const inimigosEmCampo = [];

  // ── REFERÊNCIAS DOM ─────────────────────────────────────────
  const rosterEl        = document.getElementById('roster');
  const playerSlots     = document.querySelectorAll('.player-slot');
  const btnStart        = document.getElementById('btn-start');
  const btnEndTurn      = document.getElementById('btn-end-turn');
  const energyHud       = document.getElementById('energy-hud');
  const energyCrystals  = document.getElementById('energy-crystals');
  const energyCount     = document.getElementById('energy-count');
  const battleControls  = document.getElementById('battle-controls');
  const battleLog       = document.getElementById('battle-log');
  const turnIndicator   = document.getElementById('turn-indicator');
  const phaseBadge      = document.getElementById('phase-badge');
  const progressText    = document.getElementById('progress-text');
  const gameOverOverlay = document.getElementById('game-over-overlay');
  const gameOverTitle   = document.getElementById('game-over-title');
  const gameOverSub     = document.getElementById('game-over-sub');

  // ── UTILITÁRIOS ─────────────────────────────────────────────

  function rolar(n, lados) {
    let total = 0;
    for (let i = 0; i < n; i++) total += Math.floor(Math.random() * lados) + 1;
    return total;
  }

  function mod(attr) { return Math.floor((attr - 10) / 2); }

  function addLog(msg, tipo = 'system') {
    const el = document.createElement('div');
    el.className = `log-entry ${tipo}`;
    el.textContent = msg;
    battleLog.appendChild(el);
    battleLog.scrollTop = battleLog.scrollHeight;
  }

  function addSep(label = '') {
    addLog(label ? `── Turno ${label} ──` : '────────────────', 'sep');
  }

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  // ── TAB SWITCH ───────────────────────────────────────────────
  window.switchTab = function(tab) {
    document.getElementById('tab-selection').classList.toggle('active', tab === 'selection');
    document.getElementById('tab-log').classList.toggle('active', tab === 'log');
    document.getElementById('panel-selection').style.display = tab === 'selection' ? 'flex' : 'none';
    battleLog.style.display = tab === 'log' ? 'flex' : 'none';
  };

  // ── GERAÇÃO DE CARTA REAL (HTML completo) ────────────────────
  function gerarHTMLCartaReal(card, uid) {
    const t = card.theme;
    const c1 = parseCusto(card.abilities[0].cost);
    const c2 = parseCusto(card.abilities[1].cost);
    return `
      <div class="card" id="card-${uid}" style="background-color:${t.card};border-color:${t.border};outline-color:${t.outline};">
        <div class="card-header" style="background:${t.header};border-color:${t.border};">
          <h2 class="card-title" style="color:${t.title};">${card.name}</h2>
          <div class="card-hp" style="color:${t.hp};">♥ <span class="hp-display">${card.hp}</span></div>
        </div>
        <div class="card-image-container" style="background-color:${t.imgBg};border-color:${t.border};">
          <img class="card-char-img" src="${card.img}" alt="${card.name}" onerror="this.style.display='none'">
          <div class="card-type-banner"><span style="color:#dcc8a0">${card.type}</span></div>
        </div>
        <div class="card-stats" style="background:${t.stats};border-color:${t.statsBorder};">
          ${['str','dex','con','int','wis','cha'].map((s,i,a) => `
            <div class="stat-item">
              <span class="stat-val" style="color:${t.statVal};">${card.stats[s]}</span>
              <span class="stat-lbl" style="color:${t.statLbl};">${s.toUpperCase()}</span>
            </div>${i<a.length-1?`<div class="stat-divider" style="background:${t.div};"></div>`:''}`).join('')}
        </div>
        <div class="card-abilities" style="background:${t.ab};border-color:${t.abBorder};">
          <div class="ability" data-cost="${c1}" data-uid="${uid}" onclick="selecionarHabilidade(this)">
            <div class="ability-cost" style="background:${t.abCost};color:${t.abCostText};">${card.abilities[0].cost}</div>
            <div class="ability-body" style="border-left-color:${t.abBl};">
              <span class="ability-name" style="color:${t.abName};">${card.abilities[0].name}</span>
              <span class="ability-desc" style="color:${t.abDesc};">${card.abilities[0].desc}</span>
            </div>
          </div>
          <div class="ability" data-cost="${c2}" data-uid="${uid}" onclick="selecionarHabilidade(this)">
            <div class="ability-cost" style="background:${t.abCost};color:${t.abCostText};">${card.abilities[1].cost}</div>
            <div class="ability-body" style="border-left-color:${t.abBl};">
              <span class="ability-name" style="color:${t.abName};">${card.abilities[1].name}</span>
              <span class="ability-desc" style="color:${t.abDesc};">${card.abilities[1].desc}</span>
            </div>
          </div>
        </div>
        <div class="flavor-text" style="color:${t.flavor};border-color:${t.flavorBorder};">${card.flavor}</div>
      </div>`;
  }

  function parseCusto(custo) {
    if (typeof custo === 'number') return custo;
    if (custo.includes('★')) return custo.length;
    const n = parseInt(custo);
    return isNaN(n) ? 1 : n;
  }

  // ── HP BAR ───────────────────────────────────────────────────
  function criarHpBar(slot, hpMax) {
    let bar = slot.querySelector('.hp-bar-overlay');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'hp-bar-overlay';
      bar.innerHTML = '<div class="hp-bar-fill"></div>';
      slot.appendChild(bar);
    }
    atualizarHpBar(slot, hpMax, hpMax);
    return bar;
  }

  function atualizarHpBar(slot, hpCur, hpMax) {
    const fill = slot.querySelector('.hp-bar-fill');
    if (!fill) return;
    const pct = Math.max(0, hpCur / hpMax * 100);
    fill.style.width = pct + '%';
    if (pct > 50) fill.style.background = '#50c878';
    else if (pct > 25) fill.style.background = '#d4a017';
    else fill.style.background = '#c04040';
    // Atualiza o display de HP dentro da carta
    const hpDisplay = slot.querySelector('.hp-display');
    if (hpDisplay) hpDisplay.textContent = Math.max(0, hpCur);
  }

  // ── MINI-CARDS (ROSTER) ──────────────────────────────────────
  cards.forEach((card, idx) => {
    const el = document.createElement('div');
    el.className = 'mini-card';
    el.dataset.id = idx;
    el.style.borderLeftColor = card.theme.border;
    el.innerHTML = `
      <div class="mini-card-info">
        <div class="mini-card-name" style="color:${card.theme.title}">${card.name}</div>
        <div class="mini-card-type">${card.type}</div>
      </div>
      <div class="mini-card-hp">♥${card.hp}</div>`;
    el.addEventListener('click', () => {
      if (faseBatalha) return;
      document.querySelectorAll('.mini-card').forEach(c => c.classList.remove('selected'));
      cartaSelecionada = card;
      cartaSelecionada._elId = idx;
      el.classList.add('selected');
    });
    rosterEl.appendChild(el);
  });

  // ── COLOCAR CARTA NO SLOT ───────────────────────────────────
  playerSlots.forEach((slot, idx) => {
    slot.addEventListener('click', () => {
      if (faseBatalha) return;

      // Remover carta do slot
      if (slot.dataset.cardId !== undefined) {
        const oldId = slot.dataset.cardId;
        document.querySelector(`.mini-card[data-id="${oldId}"]`)?.classList.remove('used');
        slot.innerHTML = '';
        delete slot.dataset.cardId;
        delete hpAtual[slot.dataset.pos];
        cartasPosicionadas--;
        atualizarProgresso();
        return;
      }

      if (!cartaSelecionada) return;

      const uid = `p${idx}`;
      slot.innerHTML = gerarHTMLCartaReal(cartaSelecionada, uid);
      slot.dataset.cardId = cartaSelecionada._elId;
      slot.dataset.cardIndex = cards.indexOf(cartaSelecionada);
      slot.classList.add('occupied');

      // Animação de entrada
      const cardEl = slot.querySelector('.card');
      cardEl.classList.add('entering');
      setTimeout(() => cardEl.classList.remove('entering'), 500);

      // HP
      hpAtual[slot.dataset.pos] = { cur: cartaSelecionada.hp, max: cartaSelecionada.hp };
      criarHpBar(slot, cartaSelecionada.hp);

      const mini = document.querySelector(`.mini-card[data-id="${cartaSelecionada._elId}"]`);
      mini.classList.remove('selected');
      mini.classList.add('used');
      cartaSelecionada = null;

      cartasPosicionadas++;
      atualizarProgresso();
    });
  });

  function atualizarProgresso() {
    progressText.textContent = `${cartasPosicionadas} / 5 posicionados`;
    btnStart.disabled = cartasPosicionadas < 5;
  }

  // ── INICIAR BATALHA ──────────────────────────────────────────
  btnStart.addEventListener('click', () => {
    faseBatalha = true;

    // Esconde seleção, mostra log
    document.getElementById('panel-selection').style.display = 'none';
    battleLog.style.display = 'flex';
    document.getElementById('tab-selection').classList.remove('active');
    document.getElementById('tab-log').classList.add('active');

    energyHud.style.display = 'flex';
    battleControls.style.display = 'flex';
    document.body.classList.add('battle-active');

    // Popula inimigos
    popularInimigos();

    atualizarHUD();
    atualizarIndicador();
    addSep(turnoNum);
    addLog('A batalha começou! Escolha suas habilidades e encerre o turno.', 'system');
  });

  // ── POPULAR INIMIGOS (IA) ────────────────────────────────────
  function popularInimigos() {
    const enemySlots = document.querySelectorAll('.enemy-slot');
    // Seleciona 5 cartas aleatórias para o inimigo
    const shuffled = [...cards].sort(() => Math.random() - 0.5).slice(0, 5);
    const slotOrder = [3, 4, 0, 1, 2]; // frente primeiro no display (slots 3,4 são frente)
    
    // Mapeia: front slots = índices 3,4 / back slots = 0,1,2
    const frontSlots = [enemySlots[3], enemySlots[4]];
    const backSlots  = [enemySlots[0], enemySlots[1], enemySlots[2]];
    const allEnemySlots = [...backSlots, ...frontSlots]; // back first for visual order

    shuffled.forEach((card, i) => {
      const slot = allEnemySlots[i];
      if (!slot) return;
      const uid = `e${i}`;
      slot.innerHTML = gerarHTMLCartaReal(card, uid);
      slot.dataset.cardIndex = cards.indexOf(card);
      slot.dataset.enemyUid  = uid;
      slot.classList.add('has-enemy', 'occupied');

      const cardEl = slot.querySelector('.card');
      cardEl.classList.add('entering');
      setTimeout(() => cardEl.classList.remove('entering'), 500);

      const hpObj = { cur: card.hp, max: card.hp };
      hpAtual[uid] = hpObj;
      criarHpBar(slot, card.hp);

      inimigosEmCampo.push({ card, slot, uid, hp: hpObj });
    });
  }

  // ── SELECIONAR HABILIDADE ────────────────────────────────────
  window.selecionarHabilidade = function(div) {
    if (!faseBatalha) return;
    const custo = parseInt(div.dataset.cost);
    const uid   = div.dataset.uid;

    // Cancelar se já está na fila
    if (div.classList.contains('queued')) {
      div.classList.remove('queued');
      energiaAtual += custo;
      atualizarHUD();
      addLog(`Habilidade cancelada (+${custo} energia recuperada).`, 'system');
      return;
    }

    // Verificar se outra habilidade desta carta já está na fila
    const irmãs = document.querySelectorAll(`.ability[data-uid="${uid}"]`);
    let temAcao = false;
    irmãs.forEach(ab => { if (ab.classList.contains('queued')) temAcao = true; });
    if (temAcao) {
      addLog('Esta carta já tem uma habilidade engatilhada neste turno!', 'system');
      return;
    }

    if (energiaAtual < custo) {
      addLog(`Energia insuficiente! Necessário: ${custo}, disponível: ${energiaAtual}.`, 'system');
      return;
    }

    div.classList.add('queued');
    energiaAtual -= custo;
    const nome = div.querySelector('.ability-name')?.textContent || 'Habilidade';
    addLog(`⚡ [${nome}] engatilhada. (−${custo} energia)`, 'special');
    atualizarHUD();
  };

  // ── HUD DE ENERGIA ───────────────────────────────────────────
  function atualizarHUD() {
    energyCount.textContent = `${energiaAtual}/${energiaMaxima}`;
    const cristais = energyCrystals.querySelectorAll('.crystal');
    cristais.forEach((c, i) => c.classList.toggle('active', i < energiaAtual));
  }

  function atualizarIndicador() {
    turnIndicator.textContent = `Turno ${turnoNum}`;
    phaseBadge.textContent    = faseBatalha ? 'Fase do Jogador' : 'Posicionamento';
  }

  // ── ENCERRAR TURNO ───────────────────────────────────────────
  btnEndTurn.addEventListener('click', async () => {
    if (!faseBatalha) return;
    btnEndTurn.disabled = true;

    addSep();
    addLog(`▶ Fase de Resolução — Turno ${turnoNum}`, 'system');

    // 1. Ações do jogador
    await resolverAcoesJogador();
    if (verificarFimDeJogo()) return;

    await delay(600);

    // 2. Ações do inimigo (IA)
    addSep();
    addLog('▶ Turno Inimigo', 'system');
    await resolverAcoesInimigo();
    if (verificarFimDeJogo()) return;

    // 3. Resetar energia
    await delay(400);
    turnoNum++;
    energiaAtual = energiaMaxima;
    atualizarHUD();
    atualizarIndicador();
    addSep(turnoNum);
    addLog('Seu turno! Escolha suas ações.', 'system');
    btnEndTurn.disabled = false;
  });

  // ── RESOLVER AÇÕES DO JOGADOR ────────────────────────────────
  async function resolverAcoesJogador() {
    const slotsFront = [...document.querySelectorAll('.player-slot[data-pos="front-1"], .player-slot[data-pos="front-2"]')];
    const slotsBack  = [...document.querySelectorAll('.player-slot[data-pos="back-1"], .player-slot[data-pos="back-2"], .player-slot[data-pos="back-3"]')];
    const todosSlots = [...playerSlots];

    for (const slot of todosSlots) {
      if (!slot.dataset.cardIndex) continue;
      const pos        = slot.dataset.pos;
      const hpObj      = hpAtual[pos];
      if (!hpObj || hpObj.cur <= 0) continue;

      const cardIdx  = parseInt(slot.dataset.cardIndex);
      const card     = cards[cardIdx];
      const abQueued = slot.querySelector('.ability.queued');

      if (abQueued) {
        await resolverHabilidadeJogador(card, slot, abQueued);
        abQueued.classList.remove('queued');
      } else {
        await resolverAtaqueBasico(card, slot, true);
      }
      await delay(350);
    }
  }

  // ── HABILIDADE DO JOGADOR ────────────────────────────────────
  async function resolverHabilidadeJogador(card, slot, abDiv) {
    const nome = abDiv.querySelector('.ability-name')?.textContent || 'Habilidade';
    const desc = abDiv.querySelector('.ability-desc')?.textContent || '';
    const custo = parseInt(abDiv.dataset.cost);

    // Detecta tipo de habilidade pela descrição
    const ehCura = /cura|restaura|recupera|cura\b/i.test(desc + nome);
    const ehAoe  = /área|todos|criaturas hostis/i.test(desc);

    if (ehCura) {
      // Cura: alvo é o aliado com menos HP
      const alvoSlot = encontrarAliadoMaisInjuriado();
      if (alvoSlot) {
        const pos     = alvoSlot.dataset.pos;
        const hpObj   = hpAtual[pos];
        const cura    = rolar(2, 8) + Math.max(0, mod(card.stats.wis || 10) + mod(card.stats.cha || 10));
        hpObj.cur     = Math.min(hpObj.max, hpObj.cur + cura);
        atualizarHpBar(alvoSlot, hpObj.cur, hpObj.max);
        flashSlot(alvoSlot, 'heal-anim');
        addLog(`✦ ${card.name} usou [${nome}] → cura ${cura} HP em ${getNomeCartaSlot(alvoSlot)}.`, 'heal');
      }
    } else if (ehAoe) {
      // Dano em área: atinge todos os inimigos vivos
      const dmg = rolar(2, 6) + Math.max(0, mod(card.stats.int || 10));
      const vivos = inimigosEmCampo.filter(e => e.hp.cur > 0);
      addLog(`✦ ${card.name} usou [${nome}] → AoE ${dmg} de dano!`, 'special');
      for (const inimigo of vivos) {
        aplicarDanoInimigo(inimigo, dmg, card.name);
        await delay(150);
      }
    } else {
      // Dano único: alvo inimigo mais fraco (ou primeiro vivo)
      const alvo = escolherAlvoInimigo();
      if (!alvo) { addLog(`Sem alvos inimigos!`, 'system'); return; }
      const atk  = mod(card.stats.int || 10) + mod(card.stats.cha || 10);
      const dmg  = Math.max(1, rolar(2, 8) + atk + custo);
      addLog(`✦ ${card.name} usou [${nome}] → ${dmg} de dano em ${alvo.card.name}.`, 'special');
      aplicarDanoInimigo(alvo, dmg, card.name);
      shakeSlot(alvo.slot);
    }
  }

  // ── ATAQUE BÁSICO ────────────────────────────────────────────
  async function resolverAtaqueBasico(card, slot, isPlayer) {
    const isFront = slot.dataset.pos?.includes('front') || slot.dataset.pos?.includes('front');
    
    if (isPlayer) {
      const alvo = escolherAlvoInimigo(isFront);
      if (!alvo) { addLog(`${card.name} não tem alvos.`, 'system'); return; }
      const atrib = card.stats.str > card.stats.dex ? card.stats.str : card.stats.dex;
      const dmg   = Math.max(1, rolar(1, 6) + mod(atrib));
      addLog(`⚔ ${card.name} ataca ${alvo.card.name} → ${dmg} de dano.`, 'dmg');
      aplicarDanoInimigo(alvo, dmg, card.name);
      shakeSlot(alvo.slot);
    } else {
      const alvoSlot = escolherAlvoJogador();
      if (!alvoSlot) { addLog(`Inimigo ${card.name} não tem alvos.`, 'system'); return; }
      const pos    = alvoSlot.dataset.pos;
      const hpObj  = hpAtual[pos];
      const atrib  = card.stats.str > card.stats.dex ? card.stats.str : card.stats.dex;
      const dmg    = Math.max(1, rolar(1, 6) + mod(atrib));
      hpObj.cur    = Math.max(0, hpObj.cur - dmg);
      atualizarHpBar(alvoSlot, hpObj.cur, hpObj.max);
      flashSlot(alvoSlot, 'hit-anim');
      shakeSlot(alvoSlot);
      addLog(`👹 ${card.name} ataca ${getNomeCartaSlot(alvoSlot)} → ${dmg} de dano.`, 'enemy');
      if (hpObj.cur <= 0) matarCartaSlot(alvoSlot);
    }
  }

  // ── IA INIMIGA ───────────────────────────────────────────────
  async function resolverAcoesInimigo() {
    for (const inimigo of inimigosEmCampo) {
      if (inimigo.hp.cur <= 0) continue;

      const card = inimigo.card;
      // IA: usa habilidade se tem "sorte" (40%) e tiver um alvo
      const usarHab = Math.random() < 0.40;
      const abIdx   = Math.random() < 0.5 ? 0 : 1;
      const ab      = card.abilities[abIdx];
      const custo   = parseCusto(ab.cost);
      const ehCura  = /cura|restaura|recupera/i.test(ab.desc + ab.name);

      if (usarHab) {
        if (ehCura) {
          // Cura o inimigo mais machucado
          const alvo = inimigosEmCampo.filter(e => e.hp.cur > 0).sort((a,b) => a.hp.cur - b.hp.cur)[0];
          if (alvo) {
            const cura = rolar(1, 8) + Math.max(0, mod(card.stats.wis || 10));
            alvo.hp.cur = Math.min(alvo.hp.max, alvo.hp.cur + cura);
            atualizarHpBar(alvo.slot, alvo.hp.cur, alvo.hp.max);
            flashSlot(alvo.slot, 'heal-anim');
            addLog(`✦ ${card.name} usou [${ab.name}] → cura ${cura} HP em ${alvo.card.name}.`, 'enemy');
            await delay(400);
            continue;
          }
        } else {
          const alvoSlot = escolherAlvoJogador();
          if (alvoSlot) {
            const dmg = Math.max(1, rolar(1, 8) + mod(card.stats.int || 10) + custo);
            const pos   = alvoSlot.dataset.pos;
            const hpObj = hpAtual[pos];
            hpObj.cur   = Math.max(0, hpObj.cur - dmg);
            atualizarHpBar(alvoSlot, hpObj.cur, hpObj.max);
            flashSlot(alvoSlot, 'hit-anim');
            shakeSlot(alvoSlot);
            addLog(`✦ ${card.name} usou [${ab.name}] → ${dmg} de dano em ${getNomeCartaSlot(alvoSlot)}.`, 'enemy');
            if (hpObj.cur <= 0) matarCartaSlot(alvoSlot);
            await delay(450);
            continue;
          }
        }
      }

      // Ataque básico
      await resolverAtaqueBasico(card, inimigo.slot, false);
      await delay(400);
    }
  }

  // ── HELPERS DE ALVO ─────────────────────────────────────────
  function escolherAlvoInimigo(prefereFront = false) {
    const vivos = inimigosEmCampo.filter(e => e.hp.cur > 0);
    if (!vivos.length) return null;
    // Prefere a frente (slots 3,4 = front)
    const front = vivos.filter(e => {
      const pos = e.slot.dataset.pos || '';
      return pos.includes('front');
    });
    const pool = (prefereFront && front.length) ? front : vivos;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function escolherAlvoJogador() {
    // Prefere frente do jogador
    const slotsFront = [...document.querySelectorAll('.player-slot[data-pos^="front"]')];
    const slotsBack  = [...document.querySelectorAll('.player-slot[data-pos^="back"]')];
    const frente = slotsFront.filter(s => s.dataset.cardId !== undefined && (hpAtual[s.dataset.pos]?.cur ?? 0) > 0);
    const tras   = slotsBack.filter(s  => s.dataset.cardId !== undefined && (hpAtual[s.dataset.pos]?.cur ?? 0) > 0);
    const pool   = frente.length ? frente : tras;
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function encontrarAliadoMaisInjuriado() {
    let pior = null, piorPct = 1;
    playerSlots.forEach(slot => {
      const pos  = slot.dataset.pos;
      const hpObj = hpAtual[pos];
      if (!hpObj || hpObj.cur <= 0) return;
      const pct = hpObj.cur / hpObj.max;
      if (pct < piorPct) { piorPct = pct; pior = slot; }
    });
    return pior;
  }

  function aplicarDanoInimigo(inimigo, dmg, atacante) {
    inimigo.hp.cur = Math.max(0, inimigo.hp.cur - dmg);
    atualizarHpBar(inimigo.slot, inimigo.hp.cur, inimigo.hp.max);
    flashSlot(inimigo.slot, 'hit-anim');
    if (inimigo.hp.cur <= 0) matarInimigo(inimigo);
  }

  function matarInimigo(inimigo) {
    addLog(`💀 ${inimigo.card.name} foi derrotado!`, 'dmg');
    inimigo.slot.classList.add('card-dead');
  }

  function matarCartaSlot(slot) {
    const nome = getNomeCartaSlot(slot) || 'Carta';
    addLog(`💀 ${nome} foi derrotado!`, 'dmg');
    slot.classList.add('card-dead');
  }

  function getNomeCartaSlot(slot) {
    return slot.querySelector('.card-title')?.textContent || '?';
  }

  // ── ANIMAÇÕES ────────────────────────────────────────────────
  function flashSlot(slot, cls) {
    slot.classList.remove(cls);
    void slot.offsetWidth;
    slot.classList.add(cls);
    setTimeout(() => slot.classList.remove(cls), 600);
  }

  function shakeSlot(slot) {
    slot.classList.remove('shake-anim');
    void slot.offsetWidth;
    slot.classList.add('shake-anim');
    setTimeout(() => slot.classList.remove('shake-anim'), 400);
  }

  // ── FIM DE JOGO ──────────────────────────────────────────────
  function verificarFimDeJogo() {
    const inimigosVivos = inimigosEmCampo.filter(e => e.hp.cur > 0).length;
    const jogadoresVivos = [...playerSlots].filter(s =>
      s.dataset.cardId !== undefined && !s.classList.contains('card-dead')).length;

    if (inimigosVivos === 0) {
      setTimeout(() => exibirGameOver(true), 800);
      return true;
    }
    if (jogadoresVivos === 0) {
      setTimeout(() => exibirGameOver(false), 800);
      return true;
    }
    return false;
  }

  function exibirGameOver(vitoria) {
    faseBatalha = false;
    addLog(vitoria ? '🏆 VITÓRIA! Seu esquadrão prevaleceu!' : '☠ DERROTA. A escuridão venceu.', 'victory');
    gameOverTitle.textContent = vitoria ? 'Vitória!' : 'Derrota...';
    gameOverTitle.className   = `game-over-title ${vitoria ? 'win' : 'lose'}`;
    document.getElementById('game-over-sub').textContent = vitoria
      ? 'Seu esquadrão conquistou a arena!'
      : 'Todos os seus guerreiros caíram.';
    gameOverOverlay.classList.add('active');
  }

}); // DOMContentLoaded