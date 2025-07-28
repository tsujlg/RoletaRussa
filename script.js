document.addEventListener("DOMContentLoaded", () => {
    aplicarTemaDinamico();
  
    const caixas = document.querySelectorAll(".box");
    const timers = document.querySelectorAll(".timer");
    const STORAGE_KEY = "ultima-caixinha";
    const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const agora = new Date();
  
    let ultimaIndex = salvo?.index ?? 0;
    let ultimaHora = salvo?.timestamp ? new Date(salvo.timestamp) : null;
    let podeAbrir = true;
    let jaAberta = salvo?.aberta ?? false;
  
    if (ultimaHora) {
      const fim = new Date(ultimaHora.getTime() + 24 * 60 * 60 * 1000);
      if (agora < fim) {
        podeAbrir = !jaAberta;
  
        // Mostra apenas o timer, não a mensagem
        iniciarContador(fim, timers[ultimaIndex]);
  
        if (jaAberta) {
          caixas[ultimaIndex].classList.add("aberta");
          caixas[ultimaIndex].innerHTML = `<div class="box-conteudo"><span class="mensagem">${caixas[ultimaIndex].getAttribute("data-surpresa")}</span></div>`;
        }
      } else {
        ultimaIndex = (ultimaIndex + 1) % caixas.length;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          index: ultimaIndex,
          timestamp: agora.toISOString(),
          aberta: false
        }));
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        index: ultimaIndex,
        timestamp: agora.toISOString(),
        aberta: false
      }));
    }
  
    caixas.forEach((caixa, i) => {
      caixa.style.display = i === ultimaIndex ? "flex" : "none";
    });
  
    caixas[ultimaIndex].addEventListener("click", () => {
      if (!podeAbrir) return;
  
      const mensagem = caixas[ultimaIndex].getAttribute("data-surpresa");
      abrirCaixinha(caixas[ultimaIndex], mensagem, false);
      animarCoracoes();
  
      const novaHora = new Date();
      const fim = new Date(novaHora.getTime() + 24 * 60 * 60 * 1000);
  
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        index: ultimaIndex,
        timestamp: novaHora.toISOString(),
        aberta: true
      }));
  
      iniciarContador(fim, timers[ultimaIndex]);
      podeAbrir = false;
    });
  });
  
  function abrirCaixinha(caixa, mensagem, bloqueada) {
    caixa.innerHTML = `<div class="box-conteudo"><span class="mensagem"></span></div>`;
    caixa.classList.add("aberta");
  
    const container = caixa.closest(".container");
    const timerEl = container.querySelector(".timer");
    if (timerEl) timerEl.style.display = "block";
  
    if (!bloqueada) {
      digitarTexto(caixa.querySelector(".mensagem"), mensagem, 0);
    } else {
      caixa.querySelector(".mensagem").innerText = mensagem;
    }
  }
  
  function iniciarContador(fim, timerEl) {
    if (timerEl) timerEl.style.display = "block";
  
    function atualizar() {
      const agora = new Date();
      const diff = fim - agora;
  
      if (diff <= 0) {
        timerEl.textContent = "🎉 Uma nova caixinha está disponível!";
        clearInterval(intervalo);
        location.reload();
        return;
      }
  
      const h = Math.floor(diff / 1000 / 60 / 60);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
  
      timerEl.textContent = `⏳ Nova caixinha em: ${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
  
    atualizar();
    const intervalo = setInterval(atualizar, 1000);
  }
  
  function digitarTexto(element, text, index) {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      setTimeout(() => digitarTexto(element, text, index + 1), 40);
    }
  }
  
  function animarCoracoes() {
    const container = document.getElementById("coracoes");
    for (let i = 0; i < 10; i++) {
      const coracao = document.createElement("div");
      coracao.className = "coracao";
      coracao.innerText = "💖";
      coracao.style.left = Math.random() * 100 + "vw";
      container.appendChild(coracao);
      setTimeout(() => container.removeChild(coracao), 3000);
    }
  }
  
  function aplicarTemaDinamico() {
    const hora = new Date().getHours();
    const isNoite = hora >= 18 || hora <= 5;
    const body = document.body;
    const root = document.documentElement;
  
    if (isNoite) {
      body.style.background = "radial-gradient(#1a1a40, #0d0d2b)";
      const estrelas = document.createElement("div");
      estrelas.id = "estrelas";
      estrelas.style.background = "repeating-radial-gradient(#ffffff80 1px, transparent 2px)";
      document.body.appendChild(estrelas);
      root.style.setProperty("--box-day", "#2c2c54");
      root.style.setProperty("--text", "#f8c8dc");
    } else {
      const ceu = document.createElement("div");
      ceu.id = "ceu-dia";
  
      const sol = document.createElement("div");
      sol.className = "sol";
  
      const nuvens = [1, 2, 3, 4, 5].map(num => {
        const nuvem = document.createElement("div");
        nuvem.className = `nuvem nuvem${num}`;
        return nuvem;
      });
  
      ceu.appendChild(sol);
      nuvens.forEach(nuvem => ceu.appendChild(nuvem));
      document.body.appendChild(ceu);
  
      root.style.setProperty("--box-day", "#ffe0d6");
      root.style.setProperty("--text", "#a34d6d");
    }
  }
  