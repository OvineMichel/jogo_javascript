window.onload = function () {
    function caminEfeito() { // efeito de caminhar do personagem
        const caminhar = new Audio("src/assets/audios/caminhar.mp3");
        caminhar.play();
    }

    const canvas = document.getElementById('canvasJogo');
    const ctx = canvas.getContext('2d');
    const juninho = new Image();
    const pontoAudio = new Audio("src/assets/audios/ponto.mp3");
    const obstaculoImgs = [];
    const obstaculoLadoX = 104;
    const obstaculoLadoY = 58;
    // nesse modo removi o sinal
    for (let i = 0; i < 5; i++) {
        obstaculoImgs[i] = new Image(); // criação de cada um dos ostaculos como imagens
        obstaculoImgs[i].src = `src/assets/images/carro${i + 1}.png`; // utilizei array de objetos
    }

    juninho.src = "src/assets/images/jstandc.png";
    const jogadorLado = 80; //tamanho da colisão

    let posicaoXJogador = canvas.width / 2 - jogadorLado / 2;
    let posicaoYJogador = 520;
    let obstaculosY = [137, 230, 330, 430]; // posições y dos obstaculos
    let obstaculos = [];
    let pontuacao = 0;
    let jogoAcabou = false;

    let animacaoInterval; // intervalo de animação
    let movimentoInterval; // tempo até inicio de movimento
    let teclaPressionada = null;
    let frame = 0;
    let criarObstaculoInterval;

    const imagensEsquerda = ["src/assets/images/jesq1.png", "src/assets/images/jesq2.png"]; // conjunto de imagens de movimentação
    const imagensDireita = ["src/assets/images/jdir1.png", "src/assets/images/jdir2.png"];
    const imagensFrente = ["src/assets/images/novojf.png", "src/assets/images/novojf2.png"];
    const imagensCima = ["src/assets/images/novojc.png", "src/assets/images/novojc2.png"];

    function criarObstaculo() {
        const y = obstaculosY[Math.floor(Math.random() * obstaculosY.length)];
        let carro = Math.floor(Math.random() * 5);
        obstaculos.push({ x: canvas.width, y: y, image: obstaculoImgs[carro], parado: false });
    }

    function iniciarCriacaoObstaculos() {
        if (!criarObstaculoInterval) {
            criarObstaculoInterval = setInterval(criarObstaculo, 1000);
        }
    }

    function pararCriacaoObstaculos() {
        clearInterval(criarObstaculoInterval);
        criarObstaculoInterval = null;
    }

    function moverObstaculos() {
        obstaculos.forEach(obstaculo => {
            if (!obstaculo.parado) {
                obstaculo.x -= 3;
            }
            if (
                obstaculo.x <= 550 &&
                posicaoYJogador >= 70 &&
                posicaoYJogador <= 500
            ) {
                obstaculo.x = 550; // para o carro em x = 550
                obstaculo.parado = true;
            } else if (posicaoYJogador < 70 || posicaoYJogador > 500) {
                obstaculo.parado = false;
            }
        });

        obstaculos = obstaculos.filter(obstaculo => obstaculo.x + obstaculoLadoX > 0);
    }

    function desenharJogador() {
        ctx.drawImage(juninho, posicaoXJogador, posicaoYJogador, jogadorLado, jogadorLado);
    }

    function desenharObstaculos() {
        obstaculos.forEach(obstaculo => {
            ctx.drawImage(obstaculo.image, obstaculo.x, obstaculo.y, obstaculoLadoX, obstaculoLadoY);
        });
    }

    function verificarColisao() { // verifica se o jogador bateu em algum carro
        obstaculos.forEach(obstaculo => {
            if (
                posicaoXJogador < obstaculo.x + obstaculoLadoX &&
                posicaoXJogador + jogadorLado > obstaculo.x &&
                posicaoYJogador < obstaculo.y + obstaculoLadoY &&
                posicaoYJogador + jogadorLado > obstaculo.y
            ) {
                jogoAcabou = true;
            }
        });
    }

    function atualizarPontos() {
        document.getElementById('pontos').textContent = `Pontos Totais: ${pontuacao}`;
    }

    function atualizar() {
        if (!jogoAcabou) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            desenharJogador();
            desenharObstaculos();
            moverObstaculos();
            verificarColisao();

            if (posicaoYJogador <= 0) {
                posicaoYJogador = 520;
                pontuacao++;
                atualizarPontos();
                pontoAudio.play();  // toca o som de ponto caso o jogador atravesse a rua
            }

            requestAnimationFrame(atualizar);
        } else {
            let gameOver = new Audio("src/assets/audios/gameOver.mp3"); //toca o som de game over se o jogador bateu
            gameOver.play();
            setTimeout(function () {
                document.location.reload();
            }, 3000);
        }
    }

    function iniciarAnimacao(imagens) { // define o inicio da animação com sprites
        if (animacaoInterval) clearInterval(animacaoInterval);

        frame = 0;
        juninho.src = imagens[frame];

        animacaoInterval = setInterval(() => {
            frame = (frame + 1) % imagens.length;
            juninho.src = imagens[frame];
            caminEfeito();
        }, 150); // tempo de troca dos sprites
    }

    function pararAnimacao() {
        clearInterval(animacaoInterval);
        animacaoInterval = null;
    }

    function iniciarMovimento(tecla) { // define o inicio da animação com sprites
        if (movimentoInterval) clearInterval(movimentoInterval);

        movimentoInterval = setInterval(() => {
            if (tecla === 'a' || tecla === 'A') {
                posicaoXJogador = Math.max(100, posicaoXJogador - 10);
            } else if (tecla === 'd' || tecla === 'D') {
                posicaoXJogador = Math.min(500, posicaoXJogador + 10);
            } else if (tecla === 'w' || tecla === 'W') {
                posicaoYJogador = Math.max(0, posicaoYJogador - 10);
            } else if (tecla === 's' || tecla === 'S') {
                posicaoYJogador = Math.min(canvas.height - jogadorLado, posicaoYJogador + 10);
            }
        }, 100);
    }

    function pararMovimento(tecla) { // define os sprites caso o jogador pare
        clearInterval(movimentoInterval);
        movimentoInterval = null;

        if (['a', 'A', 'd', 'D', 'w', 'W', 's', 'S'].includes(tecla)) {
            juninho.src = "src/assets/images/jstandc.png";
        }
    }

    document.addEventListener('keydown', (evento) => {
        if (!teclaPressionada) {
            teclaPressionada = evento.key;
            if (evento.key === 'a' || evento.key === 'A') {
                iniciarAnimacao(imagensEsquerda);
                iniciarMovimento(evento.key);
            } else if (evento.key === 'd' || evento.key === 'D') {
                iniciarAnimacao(imagensDireita);
                iniciarMovimento(evento.key);
            } else if (evento.key === 'w' || evento.key === 'W') {
                iniciarAnimacao(imagensCima);
                iniciarMovimento(evento.key);
            } else if (evento.key === 's' || evento.key === 'S') {
                iniciarAnimacao(imagensFrente);
                iniciarMovimento(evento.key);
            }
        }
    });

    document.addEventListener('keyup', (evento) => {
        if (evento.key === teclaPressionada) {
            pararMovimento(evento.key);
            pararAnimacao();
            teclaPressionada = null;
        }
    });

    iniciarCriacaoObstaculos();
    atualizar();
};
