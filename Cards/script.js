/*
  ================================================================
  D&D RPG Cards — script.js
  ================================================================
  COMO ADICIONAR IMAGENS DOS PERSONAGENS:
    1. Crie uma pasta "images/" ao lado do index.html
    2. Coloque os arquivos com o nome da propriedade `img` de cada carta
       Exemplo: images/guerreiro.png, images/mago.png, etc.

  COMO ADICIONAR ÍCONES PERSONALIZADOS PARA OS STATS:
    1. Crie uma pasta "icons/" ao lado do index.html
    2. Coloque os SVGs com os nomes: str.svg, dex.svg, con.svg,
       int.svg, wis.svg, cha.svg, heart.svg
    Os <img> no HTML já apontam para esses caminhos.
  ================================================================
*/

const cards = [
    {
      name: "Guerreiro", hp: 30, type: "Guerreiro — Humano",
      img: "images/guerreiro.png",
      stats: { str: 18, dex: 12, con: 14, int: 16, wis: 10, cha: 8 },
      abilities: [
        { cost: "★", name: "Segundo Fôlego",  desc: "Recupera 1d10+nível de HP como ação bônus." },
        { cost: "★★", name: "Surto de Ação",  desc: "Realiza uma ação extra neste turno. Recarrega no descanso." }
      ],
      flavor: '"A batalha é minha arte, e minha arte nunca erra."',
      theme: {
        bg: "#1a1218", card: "#221820", border: "#7a3060", outline: "#3a1030",
        header: "#2e1828", title: "#e090c8", hp: "#e87070",
        imgBg: "#110d14", stats: "#2a1a20", statsBorder: "#5a2040",
        statVal: "#e8c0d8", statLbl: "rgba(200,140,180,0.6)", div: "#7a3060",
        ab: "#2a1a1e", abBorder: "#5a2040", abCost: "#7a3060", abCostText: "#fff",
        abBl: "rgba(200,140,180,0.3)", abName: "#e090c8", abDesc: "rgba(220,170,200,0.65)",
        flavor: "rgba(180,120,160,0.5)", flavorBorder: "rgba(100,50,80,0.3)",
        tab: "#7a3060", tabText: "#e090c8"
      }
    },
    {
      name: "Mago", hp: 15, type: "Mago — Humano",
      img: "images/mago.png",
      stats: { str: 8, dex: 16, con: 14, int: 18, wis: 12, cha: 10 },
      abilities: [
        { cost: "2", name: "Bola de Fogo",     desc: "Causa 8d6 de dano em área. CD DEX 15." },
        { cost: "1", name: "Míssil Mágico",    desc: "3 dardos de força, 1d4+1 cada. Acerto automático." }
      ],
      flavor: '"O conhecimento é a magia mais poderosa."',
      theme: {
        bg: "#10101a", card: "#181828", border: "#4a3caa", outline: "#201838",
        header: "#201c38", title: "#b0a0f0", hp: "#e87070",
        imgBg: "#0d0a18", stats: "#1e1c34", statsBorder: "#3a3278",
        statVal: "#c0b8f0", statLbl: "rgba(160,148,220,0.6)", div: "#4a3caa",
        ab: "#1c1a30", abBorder: "#3a3278", abCost: "#4a3caa", abCostText: "#fff",
        abBl: "rgba(160,148,220,0.3)", abName: "#b0a0f0", abDesc: "rgba(180,170,230,0.65)",
        flavor: "rgba(140,130,200,0.5)", flavorBorder: "rgba(70,60,140,0.3)",
        tab: "#4a3caa", tabText: "#b0a0f0"
      }
    },
    {
      name: "Ladino", hp: 20, type: "Ladino — Meio-Elfo",
      img: "images/ladino.png",
      stats: { str: 8, dex: 18, con: 14, int: 16, wis: 10, cha: 12 },
      abilities: [
        { cost: "★", name: "Ataque Furtivo",   desc: "Causa 3d6 extra se tiver vantagem ou aliado adjacente." },
        { cost: "★", name: "Ação Ardilosa",    desc: "Toma Disparada, Desengajar ou Esconder como ação bônus." }
      ],
      flavor: '"Nas sombras vivo; nas sombras prospero."',
      theme: {
        bg: "#0e100a", card: "#161810", border: "#4a6020", outline: "#202810",
        header: "#1e2414", title: "#a0c060", hp: "#e87070",
        imgBg: "#0a0e06", stats: "#1a2010", statsBorder: "#3a5018",
        statVal: "#b0d070", statLbl: "rgba(140,180,80,0.6)", div: "#4a6020",
        ab: "#181e0e", abBorder: "#3a5018", abCost: "#4a6020", abCostText: "#fff",
        abBl: "rgba(140,180,80,0.3)", abName: "#a0c060", abDesc: "rgba(160,200,100,0.65)",
        flavor: "rgba(120,160,60,0.5)", flavorBorder: "rgba(60,90,20,0.3)",
        tab: "#4a6020", tabText: "#a0c060"
      }
    },
    {
      name: "Clérigo", hp: 25, type: "Clérigo — Anão",
      img: "images/clerigo.png",
      stats: { str: 16, dex: 8, con: 14, int: 10, wis: 18, cha: 12 },
      abilities: [
        { cost: "1", name: "Curar Ferimentos", desc: "Restaura 1d8+SAB de HP a uma criatura tocada." },
        { cost: "3", name: "Palavra Sagrada",  desc: "Criaturas hostis a até 9m ficam ensurdecidas e cegas." }
      ],
      flavor: '"A fé move montanhas; a prece cura almas."',
      theme: {
        bg: "#181408", card: "#231e0c", border: "#aa8820", outline: "#382e08",
        header: "#302810", title: "#f0d060", hp: "#e87070",
        imgBg: "#120e04", stats: "#282210", statsBorder: "#806a18",
        statVal: "#f0d060", statLbl: "rgba(220,190,80,0.6)", div: "#aa8820",
        ab: "#24200c", abBorder: "#806a18", abCost: "#aa8820", abCostText: "#fff",
        abBl: "rgba(220,190,80,0.3)", abName: "#f0d060", abDesc: "rgba(230,210,120,0.65)",
        flavor: "rgba(200,170,80,0.5)", flavorBorder: "rgba(130,100,20,0.3)",
        tab: "#aa8820", tabText: "#f0d060"
      }
    },
    {
      name: "Paladino", hp: 28, type: "Paladino — Humano",
      img: "images/paladino.png",
      stats: { str: 18, dex: 8, con: 14, int: 10, wis: 12, cha: 16 },
      abilities: [
        { cost: "2", name: "Golpe Divino",     desc: "Adiciona 2d8 de dano radiante ao próximo ataque bem-sucedido." },
        { cost: "★", name: "Imposição de Mãos",desc: "Cura um total de 5×nível de HP por descanso longo." }
      ],
      flavor: '"Minha honra é meu escudo; minha fé, minha espada."',
      theme: {
        bg: "#181410", card: "#221c14", border: "#c07830", outline: "#382810",
        header: "#2e2418", title: "#f0a860", hp: "#e87070",
        imgBg: "#120e08", stats: "#281e14", statsBorder: "#906028",
        statVal: "#f0b870", statLbl: "rgba(230,180,100,0.6)", div: "#c07830",
        ab: "#241c10", abBorder: "#906028", abCost: "#c07830", abCostText: "#fff",
        abBl: "rgba(230,180,100,0.3)", abName: "#f0a860", abDesc: "rgba(230,190,130,0.65)",
        flavor: "rgba(200,150,80,0.5)", flavorBorder: "rgba(140,90,30,0.3)",
        tab: "#c07830", tabText: "#f0a860"
      }
    },
    {
      name: "Ranger", hp: 22, type: "Ranger — Elfo",
      img: "images/ranger.png",
      stats: { str: 10, dex: 18, con: 14, int: 12, wis: 16, cha: 8 },
      abilities: [
        { cost: "★", name: "Inimigo Favorito", desc: "+2 de dano e vantagem em Percepção contra seu tipo escolhido." },
        { cost: "1", name: "Marca do Caçador", desc: "Alvo recebe 1d6 extra de dano. Move a marca como bônus." }
      ],
      flavor: '"A floresta me guia; a presa nunca escapa."',
      theme: {
        bg: "#0c1208", card: "#121a0c", border: "#387840", outline: "#182a18",
        header: "#182210", title: "#80d888", hp: "#e87070",
        imgBg: "#080e06", stats: "#16201a", statsBorder: "#286830",
        statVal: "#90d890", statLbl: "rgba(120,200,130,0.6)", div: "#387840",
        ab: "#141e10", abBorder: "#286830", abCost: "#387840", abCostText: "#fff",
        abBl: "rgba(120,200,130,0.3)", abName: "#80d888", abDesc: "rgba(140,210,150,0.65)",
        flavor: "rgba(100,180,110,0.5)", flavorBorder: "rgba(40,100,50,0.3)",
        tab: "#387840", tabText: "#80d888"
      }
    },
    {
      name: "Bárbaro", hp: 35, type: "Bárbaro — Meio-Orc",
      img: "images/barbaro.png",
      stats: { str: 18, dex: 14, con: 16, int: 8, wis: 12, cha: 10 },
      abilities: [
        { cost: "★", name: "Fúria",             desc: "+2 ATK, resistência a dano físico. Dura 1 minuto." },
        { cost: "★", name: "Defesa sem Armadura",desc: "CA = 10 + DES + CON sem armadura equipada." }
      ],
      flavor: '"A raiva é minha força; o medo é do inimigo."',
      theme: {
        bg: "#1a0c08", card: "#241410", border: "#c04020", outline: "#381808",
        header: "#2e1810", title: "#f08060", hp: "#e87070",
        imgBg: "#120806", stats: "#281410", statsBorder: "#903018",
        statVal: "#f09070", statLbl: "rgba(230,150,120,0.6)", div: "#c04020",
        ab: "#221210", abBorder: "#903018", abCost: "#c04020", abCostText: "#fff",
        abBl: "rgba(230,150,120,0.3)", abName: "#f08060", abDesc: "rgba(230,170,140,0.65)",
        flavor: "rgba(200,120,90,0.5)", flavorBorder: "rgba(140,60,30,0.3)",
        tab: "#c04020", tabText: "#f08060"
      }
    },
    {
      name: "Bardo", hp: 18, type: "Bardo — Gnomo",
      img: "images/bardo.png",
      stats: { str: 8, dex: 16, con: 12, int: 14, wis: 10, cha: 18 },
      abilities: [
        { cost: "★", name: "Inspiração Bárdica",desc: "Aliado ganha 1d8 extra em rolagem como ação bônus." },
        { cost: "2", name: "Palavra de Cura",   desc: "Cura 1d4+CAR a aliado a até 18m como ação bônus." }
      ],
      flavor: '"Minha música reescreve o destino."',
      theme: {
        bg: "#100a18", card: "#181024", border: "#8040b0", outline: "#281840",
        header: "#201830", title: "#c080e8", hp: "#e87070",
        imgBg: "#0c0810", stats: "#1c1430", statsBorder: "#603090",
        statVal: "#d090f0", statLbl: "rgba(190,140,230,0.6)", div: "#8040b0",
        ab: "#181230", abBorder: "#603090", abCost: "#8040b0", abCostText: "#fff",
        abBl: "rgba(190,140,230,0.3)", abName: "#c080e8", abDesc: "rgba(200,160,240,0.65)",
        flavor: "rgba(160,110,200,0.5)", flavorBorder: "rgba(90,50,140,0.3)",
        tab: "#8040b0", tabText: "#c080e8"
      }
    },
    {
      name: "Druida", hp: 20, type: "Druida — Elfo",
      img: "images/druida.png",
      stats: { str: 8, dex: 14, con: 16, int: 12, wis: 18, cha: 10 },
      abilities: [
        { cost: "★", name: "Forma Selvagem",    desc: "Transforma-se em besta CR 1/4 ou menor como ação bônus." },
        { cost: "2", name: "Encantamento de Cura",desc: "Cura 2d8+SAB de HP a criatura tocada." }
      ],
      flavor: '"A natureza não precisa de palavras — apenas de respeito."',
      theme: {
        bg: "#0a1410", card: "#101e16", border: "#208060", outline: "#102a1e",
        header: "#162818", title: "#60d0a0", hp: "#e87070",
        imgBg: "#070f0b", stats: "#162418", statsBorder: "#187050",
        statVal: "#70d8a8", statLbl: "rgba(100,200,160,0.6)", div: "#208060",
        ab: "#121e16", abBorder: "#187050", abCost: "#208060", abCostText: "#fff",
        abBl: "rgba(100,200,160,0.3)", abName: "#60d0a0", abDesc: "rgba(120,210,170,0.65)",
        flavor: "rgba(80,180,130,0.5)", flavorBorder: "rgba(30,110,70,0.3)",
        tab: "#208060", tabText: "#60d0a0"
      }
    },
    {
      name: "Feiticeiro", hp: 16, type: "Feiticeiro — Tiefling",
      img: "images/feiticeiro.png",
      stats: { str: 8, dex: 16, con: 14, int: 10, wis: 12, cha: 18 },
      abilities: [
        { cost: "★", name: "Magia Metamórfica", desc: "Usa um Ponto de Feitiçaria para alterar qualquer magia." },
        { cost: "2", name: "Raio de Carga",     desc: "1d6 por nível. Causa 1d6 trovão em falha de CON." }
      ],
      flavor: '"O poder corre em meu sangue — literalmente."',
      theme: {
        bg: "#180808", card: "#220c0c", border: "#b02020", outline: "#361010",
        header: "#2c1010", title: "#f06060", hp: "#e87070",
        imgBg: "#100606", stats: "#261010", statsBorder: "#881818",
        statVal: "#f07070", statLbl: "rgba(230,130,130,0.6)", div: "#b02020",
        ab: "#200e0e", abBorder: "#881818", abCost: "#b02020", abCostText: "#fff",
        abBl: "rgba(230,130,130,0.3)", abName: "#f06060", abDesc: "rgba(230,160,160,0.65)",
        flavor: "rgba(200,100,100,0.5)", flavorBorder: "rgba(130,40,40,0.3)",
        tab: "#b02020", tabText: "#f06060"
      }
    },
    {
      name: "Bruxo", hp: 18, type: "Bruxo — Humano",
      img: "images/bruxo.png",
      stats: { str: 8, dex: 12, con: 16, int: 14, wis: 10, cha: 18 },
      abilities: [
        { cost: "★", name: "Maldição do Bruxo", desc: "Marca alvo: +1d6 dano e vantagem em Percepção contra ele." },
        { cost: "2", name: "Explosão Eldritch", desc: "1d10 de força. Empurra 3m em falha de STR." }
      ],
      flavor: '"Fiz um pacto. O preço foi justo... talvez."',
      theme: {
        bg: "#0e0c14", card: "#141220", border: "#503880", outline: "#201630",
        header: "#1c1830", title: "#9878d0", hp: "#e87070",
        imgBg: "#09080f", stats: "#181528", statsBorder: "#402e68",
        statVal: "#a888e0", statLbl: "rgba(160,130,210,0.6)", div: "#503880",
        ab: "#14102c", abBorder: "#402e68", abCost: "#503880", abCostText: "#fff",
        abBl: "rgba(160,130,210,0.3)", abName: "#9878d0", abDesc: "rgba(170,148,220,0.65)",
        flavor: "rgba(130,100,190,0.5)", flavorBorder: "rgba(70,50,120,0.3)",
        tab: "#503880", tabText: "#9878d0"
      }
    },
    {
      name: "Monge", hp: 22, type: "Monge — Humano",
      img: "images/monge.png",
      stats: { str: 12, dex: 18, con: 14, int: 8, wis: 16, cha: 10 },
      abilities: [
        { cost: "★", name: "Artes Marciais",     desc: "Ataque desarmado como bônus após ataque de Ataque." },
        { cost: "★", name: "Deflexão de Mísseis",desc: "Reação: reduz dano de projétil em 1d10+DES+nível." }
      ],
      flavor: '"Corpo e mente são uma só arma."',
      theme: {
        bg: "#100e08", card: "#181608", border: "#988020", outline: "#2a2408",
        header: "#24200c", title: "#e8d060", hp: "#e87070",
        imgBg: "#0c0a04", stats: "#201c0c", statsBorder: "#706018",
        statVal: "#e0c858", statLbl: "rgba(210,190,80,0.6)", div: "#988020",
        ab: "#1c180c", abBorder: "#706018", abCost: "#988020", abCostText: "#fff",
        abBl: "rgba(210,190,80,0.3)", abName: "#e8d060", abDesc: "rgba(225,210,120,0.65)",
        flavor: "rgba(190,160,60,0.5)", flavorBorder: "rgba(120,100,20,0.3)",
        tab: "#988020", tabText: "#e8d060"
      }
    }
  ];
  
  /* ══════════════════════════════════════════
     Estado
  ══════════════════════════════════════════ */
  let current  = 0;
  let zoomed   = false;
  
  /* ══════════════════════════════════════════
     Helpers
  ══════════════════════════════════════════ */
  const $ = id => document.getElementById(id);
  
  /* ══════════════════════════════════════════
     Aplicar tema / dados na carta
  ══════════════════════════════════════════ */
  function applyCard(card) {
    const t = card.theme;
  
    /* Carta */
    const c = $('card');
    c.style.backgroundColor = t.card;
    c.style.borderColor     = t.border;
    c.style.outlineColor    = t.outline;
    c.style.boxShadow       = `0 0 0 4px ${t.bg}, 0 12px 40px rgba(0,0,0,0.85)`;
  
    /* Header */
    const ch = $('ch');
    ch.style.background  = t.header;
    ch.style.borderColor = t.border;
    $('c-name').style.color   = t.title;
    $('c-name').textContent   = card.name;
    document.querySelector('.card-hp').style.color = t.hp;
    $('c-hp').textContent = card.hp;
  
    /* Imagem */
    const imgBox = $('c-img-box');
    imgBox.style.borderColor     = t.border;
    imgBox.style.backgroundColor = t.imgBg;
    const charImg = $('c-char-img');
    charImg.src = card.img;
    charImg.alt = card.name;
    charImg.style.display = 'block';
    $('c-type').textContent = card.type;
  
    /* Stats */
    const sb = $('c-stats-box');
    sb.style.background  = t.stats;
    sb.style.borderColor = t.statsBorder;
  
    const statMap = { str:'s-str', dex:'s-dex', con:'s-con', int:'s-int', wis:'s-wis', cha:'s-cha' };
    for (const [key, elId] of Object.entries(statMap)) {
      const el = $(elId);
      el.style.color  = t.statVal;
      el.textContent  = card.stats[key];
      el.nextElementSibling && (el.nextElementSibling.style.color = t.statLbl);
    }
  
    /* Divisores */
    document.querySelectorAll('.stat-divider').forEach(d => d.style.background = t.div);
  
    /* Habilidades */
    const ab = $('c-ab-box');
    ab.style.background  = t.ab;
    ab.style.borderColor = t.abBorder;
  
    [1, 2].forEach(i => {
      const ability = card.abilities[i - 1];
      const cost = $(`ab${i}-cost`);
      cost.style.backgroundColor = t.abCost;
      cost.style.color            = t.abCostText;
      cost.textContent            = ability.cost;
  
      $(`ab${i}-body`).style.borderLeftColor = t.abBl;
      $(`ab${i}-name`).style.color = t.abName;
      $(`ab${i}-name`).textContent = ability.name;
      $(`ab${i}-desc`).style.color = t.abDesc;
      $(`ab${i}-desc`).textContent = ability.desc;
    });
  
    /* Flavor */
    $('c-flavor').style.color       = t.flavor;
    $('c-flavor').style.borderColor = t.flavorBorder;
    $('c-flavor').textContent       = card.flavor;
  }
  
  /* ══════════════════════════════════════════
     Render
  ══════════════════════════════════════════ */
  function render(animate = false) {
    const card = cards[current];
    applyCard(card);
  
    $('counter').textContent = `${current + 1} / ${cards.length}`;
  
    /* Zonas laterais */
    $('zone-left').classList.toggle('disabled',  current === 0);
    $('zone-right').classList.toggle('disabled', current === cards.length - 1);
  
    /* Tabs */
    document.querySelectorAll('.class-tab').forEach((btn, i) => {
      btn.classList.toggle('active', i === current);
    });
  
    /* Animação de entrada */
    if (animate) {
      const c = $('card');
      c.classList.remove('switching');
      void c.offsetWidth; // reflow
      c.classList.add('switching');
    }
  }
  
  /* ══════════════════════════════════════════
     Zoom
  ══════════════════════════════════════════ */
  function openZoom() {
    if (zoomed) return;
    zoomed = true;
  
    /* Clona a carta */
    const original = $('card');
    const clone = original.cloneNode(true);
    clone.id = 'card-clone';
    clone.style.animation = 'none';
    clone.style.cursor    = 'default';
  
    const wrapper = $('zoom-wrapper');
    wrapper.innerHTML = '';
    wrapper.appendChild(clone);
  
    const overlay = $('zoom-overlay');
    overlay.classList.add('active');
  
    /* Para a animação da carta original */
    original.classList.remove('floating');
  }
  
  function closeZoom() {
    if (!zoomed) return;
    zoomed = false;
  
    const overlay = $('zoom-overlay');
    overlay.classList.remove('active');
  
    /* Pequeno delay para a transição acabar antes de limpar */
    setTimeout(() => {
      $('zoom-wrapper').innerHTML = '';
      $('card').classList.add('floating');
    }, 350);
  }
  
  /* ══════════════════════════════════════════
     Navegação
  ══════════════════════════════════════════ */
  function goNext() {
    if (current < cards.length - 1) { current++; render(true); }
  }
  function goPrev() {
    if (current > 0) { current--; render(true); }
  }
  
  /* Zonas laterais */
  $('zone-left').addEventListener('click',  goPrev);
  $('zone-right').addEventListener('click', goNext);
  
  /* Teclado */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  goNext();
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    goPrev();
    if (e.key === 'Escape') closeZoom();
  });
  
  /* Zoom ao clicar na carta */
  $('card').addEventListener('click', e => {
    e.stopPropagation();
    openZoom();
  });
  
  /* Fechar zoom ao clicar no overlay */
  $('zoom-overlay').addEventListener('click', closeZoom);
  
  /* Swipe (mobile) */
  let touchStartX = 0;
  document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? goNext() : goPrev(); }
  });
  
  /* ══════════════════════════════════════════
     Tabs
  ══════════════════════════════════════════ */
  function buildTabs() {
    const cont = $('class-tabs');
    cards.forEach((card, i) => {
      const btn = document.createElement('button');
      btn.className   = 'class-tab';
      btn.textContent = card.name;
      btn.style.borderColor = card.theme.border;
      btn.style.color       = card.theme.tabText;
      btn.dataset.index     = i;
      btn.addEventListener('click', () => { current = i; render(true); });
      cont.appendChild(btn);
    });
  }
  
  /* ══════════════════════════════════════════
     Init
  ══════════════════════════════════════════ */
  buildTabs();
  render();