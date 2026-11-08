// ============================================
// 💕 Site Aniversário — 9 Anos de Amor
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Partículas da Tela 1 ---
    criarParticulasFundo();

    // --- Botão "Abra seu presente" → Tela 2 ---
    document.getElementById('btn-presente').addEventListener('click', () => {
        trocarTela('tela1', 'tela2');
        setTimeout(criarFotosFlutuantes, 600);
    });

    // --- Botão "Uma última surpresa" → Tela 3 ---
    document.getElementById('btn-surpresa').addEventListener('click', () => {
        trocarTela('tela2', 'tela3');
        setTimeout(() => {
            iniciarFogos();
            setTimeout(() => {
                document.getElementById('texto-final').classList.add('visivel');
            }, 1200);
        }, 800);
    });
});

// ============================================
// TRANSIÇÃO ENTRE TELAS
// ============================================
function trocarTela(telaAtualId, telaNovaId) {
    const telaAtual = document.getElementById(telaAtualId);
    const telaNova = document.getElementById(telaNovaId);

    telaAtual.classList.remove('ativa');
    setTimeout(() => {
        telaNova.classList.add('ativa');
    }, 700);
}

// ============================================
// PARTÍCULAS DE FUNDO — TELA 1
// ============================================
function criarParticulasFundo() {
    const container = document.getElementById('particulas-tela1');
    const quantidade = 30;

    for (let i = 0; i < quantidade; i++) {
        const p = document.createElement('div');
        p.classList.add('particula');

        const tamanho = Math.random() * 4 + 1.5;
        const posX = Math.random() * 100;
        const duracao = Math.random() * 10 + 7;
        const delay = Math.random() * 12;

        p.style.cssText = `
            width: ${tamanho}px;
            height: ${tamanho}px;
            left: ${posX}%;
            bottom: -10px;
            animation-duration: ${duracao}s;
            animation-delay: ${delay}s;
        `;

        container.appendChild(p);
    }
}

// ============================================
// FOTOS FLUTUANTES — TELA 2
// ============================================
function criarFotosFlutuantes() {
    const container = document.getElementById('fotos-container');
    const totalFotos = 18;

    // Limpar caso já exista
    container.innerHTML = '';

    for (let i = 1; i <= totalFotos; i++) {
        const img = document.createElement('img');
        img.src = `fotos/foto${i}.jpg`;
        img.alt = `Nossa foto ${i}`;
        img.classList.add('foto-flutuante');

        // Tentar carregar jpg, se falhar tenta png
        img.onerror = function () {
            if (this.src.endsWith('.jpg')) {
                this.src = this.src.replace('.jpg', '.jpeg');
            } else if (this.src.endsWith('.jpeg')) {
                this.src = this.src.replace('.jpeg', '.png');
            } else if (this.src.endsWith('.png')) {
                this.src = this.src.replace('.png', '.webp');
            }
        };

        // Variações aleatórias para cada foto
        const largura = Math.random() * 70 + 75;                    // 75px — 145px
        const posX = Math.random() * 80 + 5;                        // 5% — 85%
        const duracao = Math.random() * 16 + 18;                    // 18s — 34s
        const delay = (i - 1) * 1.2 + Math.random() * 3;            // escalonado + aleatorio
        const opacidade = Math.random() * 0.25 + 0.3;               // 0.30 — 0.55
        const rotInicio = (Math.random() - 0.5) * 16;               // -8° a 8°
        const rotFim = (Math.random() - 0.5) * 24;                  // -12° a 12°
        const deslocX = (Math.random() - 0.5) * 60;                 // deslocamento horizontal

        img.style.cssText = `
            width: ${largura}px;
            height: ${largura * 1.25}px;
            left: ${posX}%;
            --rot-inicio: ${rotInicio}deg;
            --rot-fim: ${rotFim}deg;
            --opacidade: ${opacidade};
            --desloc-x: ${deslocX}px;
            animation: flutuar ${duracao}s linear ${delay}s infinite;
        `;

        container.appendChild(img);
    }
}

// ============================================
// FOGOS DE ARTIFÍCIO — TELA 3
// ============================================
function iniciarFogos() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');

    // Ajustar para alta resolução (retina)
    function ajustarCanvas() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.scale(dpr, dpr);
    }

    ajustarCanvas();
    window.addEventListener('resize', ajustarCanvas);

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    const fogos = [];
    const particulas = [];

    // Paleta de cores românticas
    const cores = [
        '#ff4d6d', '#ff758f', '#ff8fa3', '#ffb3c1',
        '#c9184a', '#ff006e', '#ffccd5', '#fff0f3',
        '#ffd700', '#fff4cc', '#ff85a1', '#fb6f92',
        '#ff1744', '#ff80ab', '#f50057', '#ff4081'
    ];

    // --- Classe Fogo (sobe do chão) ---
    class Fogo {
        constructor() {
            this.x = Math.random() * W();
            this.y = H();
            this.alvoY = Math.random() * (H() * 0.45) + H() * 0.08;
            this.velocidade = Math.random() * 2.5 + 3.5;
            this.cor = cores[Math.floor(Math.random() * cores.length)];
            this.explodiu = false;
            this.rastro = [];
        }

        atualizar() {
            if (this.explodiu) return;

            this.rastro.push({ x: this.x, y: this.y });
            if (this.rastro.length > 10) this.rastro.shift();

            this.y -= this.velocidade;
            this.x += (Math.random() - 0.5) * 0.5;

            if (this.y <= this.alvoY) {
                this.explodir();
            }
        }

        explodir() {
            this.explodiu = true;
            const numParticulas = Math.floor(Math.random() * 35) + 55;

            for (let j = 0; j < numParticulas; j++) {
                const angulo = (Math.PI * 2 / numParticulas) * j;
                const vel = Math.random() * 3.5 + 1.5;

                particulas.push(new Particula(
                    this.x, this.y,
                    Math.cos(angulo) * vel,
                    Math.sin(angulo) * vel,
                    this.cor
                ));
            }

            // Partículas extras de brilho
            for (let k = 0; k < 12; k++) {
                const ang = Math.random() * Math.PI * 2;
                const v = Math.random() * 1.5 + 0.5;
                particulas.push(new Particula(
                    this.x, this.y,
                    Math.cos(ang) * v,
                    Math.sin(ang) * v,
                    '#fff'
                ));
            }
        }

        desenhar() {
            if (this.explodiu) return;

            // Rastro
            for (let i = 0; i < this.rastro.length; i++) {
                const alpha = (i / this.rastro.length) * 0.5;
                ctx.beginPath();
                ctx.arc(this.rastro[i].x, this.rastro[i].y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.fill();
            }

            // Ponto principal
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = this.cor;
            ctx.shadowColor = this.cor;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // --- Classe Partícula (fragmentos da explosão) ---
    class Particula {
        constructor(x, y, vx, vy, cor) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.cor = cor;
            this.alpha = 1;
            this.decaimento = Math.random() * 0.012 + 0.006;
            this.tamanho = Math.random() * 2.5 + 0.8;
            this.gravidade = 0.025;
            this.friccao = 0.985;
        }

        atualizar() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravidade;
            this.vx *= this.friccao;
            this.vy *= this.friccao;
            this.alpha -= this.decaimento;
        }

        desenhar() {
            if (this.alpha <= 0) return;

            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);

            // Brilho externo
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.tamanho * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = this.cor;
            ctx.globalAlpha = Math.max(0, this.alpha * 0.2);
            ctx.fill();

            // Partícula principal
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2);
            ctx.fillStyle = this.cor;
            ctx.fill();

            ctx.restore();
        }
    }

    // --- Loop de animação ---
    let ultimoFogo = 0;
    const intervalo = 450;

    function animar(tempo) {
        // Fade suave (rastros)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.fillRect(0, 0, W(), H());

        // Lançar novos fogos
        if (tempo - ultimoFogo > intervalo) {
            fogos.push(new Fogo());
            ultimoFogo = tempo;

            // Às vezes lança dois ou três
            if (Math.random() > 0.5) fogos.push(new Fogo());
            if (Math.random() > 0.8) fogos.push(new Fogo());
        }

        // Atualizar e desenhar fogos
        for (let i = fogos.length - 1; i >= 0; i--) {
            fogos[i].atualizar();
            fogos[i].desenhar();
            if (fogos[i].explodiu) fogos.splice(i, 1);
        }

        // Atualizar e desenhar partículas
        for (let i = particulas.length - 1; i >= 0; i--) {
            particulas[i].atualizar();
            particulas[i].desenhar();
            if (particulas[i].alpha <= 0) particulas.splice(i, 1);
        }

        requestAnimationFrame(animar);
    }

    requestAnimationFrame(animar);
}
