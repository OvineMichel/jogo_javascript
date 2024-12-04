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
    let sinalImg = new Image(); // imagem do sinal superior
    let sinal = 'go'; //começa o sinal como "go"

    for (let i = 0; i < 5; i++) {
        obstaculoImgs[i] = new Image(); // criação de cada um dos ostaculos como imagens
        obstaculoImgs[i].src = `src/assets/images/carro${i + 1}.png`; // utilizei array de objetos
    }

    juninho.src = "src/assets/images/jstandc.png"; // imagem do jogador
    const jogadorLado = 80; //tamanho da colisão
    const obstaculoLadoX = 104; // medidasdos obstaculos
    const obstaculoLadoY = 58; //medidasdos obstaculos

    let posicaoXJogador = canvas.width / 2 - jogadorLado / 2;
    let posicaoYJogador = 520;
    let obstaculosY = [134, 222, 320, 404]; // posições y dos obstaculos
    let obstaculos = [];
    let pontuacao = 0;
    let jogoAcabou = false;

    let animacaoInterval; // intervalo de animação
    let movimentoInterval; // tempo até inicio de movimento
    let teclaPressionada = null;
    let frame = 0; // frames das animações

    const imagensFrente = ["src/assets/images/novojf.png", "src/assets/images/novojf2.png"]; // conjunto de imagens de movimentação
    const imagensCima = ["src/assets/images/novojc.png", "src/assets/images/novojc2.png"];
    const imagensEsquerda = ["src/assets/images/jesq1.png", "src/assets/images/jesq2.png"];
    const imagensDireita = ["src/assets/images/jdir1.png", "src/assets/images/jdir2.png"];

    setInterval(() => {
        sinal = sinal === 'go' ? 'pare' : 'go';
    }, 4000); // alternancia de sinal

    function criarObstaculo() {
        const y = obstaculosY[Math.floor(Math.random() * obstaculosY.length)];
        let carro = Math.floor(Math.random() * 5);
        obstaculos.push({ x: canvas.width, y: y, image: obstaculoImgs[carro] });
    }

    function moverObstaculos() {
        if (sinal === 'pare') {
            obstaculos.forEach(obstaculo => {
                obstaculo.x -= 3;
            });
            obstaculos = obstaculos.filter(obstaculo => obstaculo.x + obstaculoLadoX > 0); // Aplica os novos elementos do array caso a condição seja verdadeira
        }
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
        document.getElementById('pontos').textContent = `Pontos Totais: ${pontuacao}`; // atualiza os pontos
    }

    function atualizar() {
        if (!jogoAcabou) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            desenharJogador();
            desenharObstaculos();
            moverObstaculos();

            verificarColisao();

            if (sinal === 'go') {
                sinalImg.src = "src/assets/images/go.png";
            } else {        // alterna os sinais
                sinalImg.src = "src/assets/images/pare.svg";
            }
            ctx.drawImage(sinalImg, 20, 20, 90, 90);

            if (posicaoYJogador <= 0) {
                posicaoYJogador = 520;
                pontuacao++;
                atualizarPontos();
                pontoAudio.play(); // toca o som de ponto caso o jogador atravesse a rua
            }

            requestAnimationFrame(atualizar);
        } else {
            let gameOver = new Audio("src/assets/audios/gameOver.mp3"); // toca o som de game over se o jogador bateu
            gameOver.play();
            setTimeout(function () {
                document.location.reload();
            }, 3000);
        }
    }

    function iniciarAnimacao(imagens) {
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

    function iniciarMovimento(tecla) { // inicia o movimento continuo após um tempo fixo
        if (movimentoInterval) clearInterval(movimentoInterval);

        movimentoInterval = setInterval(() => {
            if (tecla === 'w' || tecla === 'W') {
                posicaoYJogador = Math.max(0, posicaoYJogador - 13);
            } else if (tecla === 's' || tecla === 'S') {
                posicaoYJogador = Math.min(canvas.height - jogadorLado, posicaoYJogador + 13);
            } else if (tecla === 'a' || tecla === 'A') {
                posicaoXJogador = Math.max(100, posicaoXJogador - 13);
            } else if (tecla === 'd' || tecla === 'D') {
                posicaoXJogador = Math.min(500, posicaoXJogador + 13);
            }
        }, 100);
    }

    function pararMovimento(tecla) { // define os sprites caso o jogador pare
        clearInterval(movimentoInterval);
        movimentoInterval = null;

        if (tecla === 'w' || tecla === 'W') {
            juninho.src = "src/assets/images/jstandc.png";
        } else if (tecla === 's' || tecla === 'S') {
            juninho.src = "src/assets/images/jstandf.png";
        } else if (tecla === 'a' || tecla === 'A') {
            juninho.src = "src/assets/images/jstandc.png";
        } else if (tecla === 'd' || tecla === 'D') {
            juninho.src = "src/assets/images/jstandf.png";
        }
    }

    document.addEventListener('keydown', (evento) => {
        if (!teclaPressionada) {
            teclaPressionada = evento.key;
            if (evento.key === 'w' || evento.key === 'W') {
                iniciarAnimacao(imagensCima);
                iniciarMovimento(evento.key);
            } else if (evento.key === 's' || evento.key === 'S') {
                iniciarAnimacao(imagensFrente);
                iniciarMovimento(evento.key);
            } else if (evento.key === 'a' || evento.key === 'A') {
                iniciarAnimacao(imagensEsquerda);
                iniciarMovimento(evento.key);
            } else if (evento.key === 'd' || evento.key === 'D') {
                iniciarAnimacao(imagensDireita);
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

    setInterval(criarObstaculo, 1000);
    atualizar();
};
