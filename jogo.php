<?php
if($_GET['e'] == 1)
$jogo = "index2.js";
else
$jogo = "index.js"; // Define se o jogo é facil ou dificil
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cuidado Juninho!</title>
    <link rel="stylesheet" href="src/style.css">
    <script src="src/<?=$jogo?>"></script> <!--aplica o script de acordo com a escolha-->
</head>
<body>
    <audio id="Trilha" autoplay>
        <source src="src/assets/audios/trilha.mp3" type="audio/mpeg">
    </audio>
    <main id="jogo">
        <h1>Cuidado Juninho!</h1>
        <canvas id="canvasJogo" width="800" height="600"></canvas>
        <p id="pontos">Pontos Totais: 0</p>
    </main>
    <script>
        // Inicia a trilha quando o usuario clica
        // por alguma razão o servidor não permite autoplay :(
        document.addEventListener('click', function () {
            const trilha = document.getElementById('Trilha');
            if (trilha.paused) {
                trilha.play();
            }
        });
    </script>
</body>
</html>
