// Spieler- und Monster-Daten
let player = {
    name: "Held",
    hp: 115,
    maxHp: 115,
    shield: 100,
    maxShield: 100,
    attack: 10,
    potions: 3,
    score: 0 // Punktzahl hinzufügen
};

// Liste von Monstern mit verschiedenen Spezies und Angriffswerten
let monsters = [
    { name: "Kobold", species: "Goblin", hp: 50, attack: 5, points: 10 },
    { name: "Schläger", species: "Ork", hp: 80, attack: 15, points: 20 },
    { name: "Berserker", species: "Troll", hp: 100, attack: 20, points: 30 },
    { name: "Feuergeist", species: "Elementar", hp: 70, attack: 25, points: 40 },
    { name: "Schleim", species: "Schleimkreatur", hp: 40, attack: 10, points: 5 },
    { name: "Dunkelwolf", species: "Bestie", hp: 60, attack: 12, points: 15 }
];

let currentMonster = {};

// Wählt ein zufälliges Monster aus der Liste aus
function chooseRandomMonster() {
    const randomIndex = Math.floor(Math.random() * monsters.length);
    currentMonster = { ...monsters[randomIndex] };
}

// Aktualisiere die Anzeige der Charakterdaten
function updateDisplay() {
    document.getElementById('charHP').textContent = player.hp;
    document.getElementById('charShield').textContent = player.shield;
    document.getElementById('charAttack').textContent = player.attack;
    document.getElementById('charPotions').textContent = player.potions;
    document.getElementById('charScore').textContent = player.score; // Punktzahl aktualisieren
    document.getElementById('score').textContent = player.score; // Punktzahl im Scoreboard aktualisieren
    document.getElementById('scoreName').textContent = player.name; // Name im Scoreboard aktualisieren
    document.getElementById('enemyName').textContent = currentMonster.name;
    document.getElementById('enemySpecies').textContent = currentMonster.species;
    document.getElementById('enemyHP').textContent = currentMonster.hp;
    document.getElementById('enemyAttack').textContent = currentMonster.attack;
}

// Protokolliere Aktionen im Kampf-Log
function logAction(text) {
    let logText = document.getElementById('logText');
    logText.textContent += `\n${text}`;
    logText.scrollTop = logText.scrollHeight; // Autoscroll nach unten
}

// Spieler greift das Monster an
function attack() {
    if (currentMonster.hp > 0 && player.hp > 0) {
        currentMonster.hp -= player.attack;
        logAction(`${player.name} greift an und verursacht ${player.attack} Schaden.`);
        if (currentMonster.hp <= 0) {
            logAction(`${currentMonster.name} wurde besiegt!`);
            player.score += currentMonster.points; // Punkte hinzufügen
            recoverShield(); // Schild auffüllen
            logAction(`Du hast gewonnen und ${currentMonster.points} Punkte erhalten!`);
            return;
        } else {
            monsterAttack();
        }
        updateDisplay();
    }
}

// Monster greift den Spieler an
function monsterAttack() {
    let damage = currentMonster.attack;
    let shieldAbsorption = 0;

    // Teil des Schadens wird vom Schild absorbiert
    if (player.shield > 0) {
        shieldAbsorption = Math.min(player.shield, Math.ceil(damage * 0.5)); // 50% des Schadens wird vom Schild absorbiert
        player.shield -= shieldAbsorption;
        damage -= shieldAbsorption;
        logAction(`${currentMonster.name} greift an, der Schild absorbiert ${shieldAbsorption} Schaden.`);
    }

    // Der verbleibende Schaden wird der Gesundheit abgezogen
    if (damage > 0) {
        player.hp -= damage;
        logAction(`${currentMonster.name} verursacht ${damage} Schaden an der Gesundheit.`);
    }

    if (player.hp <= 0) {
        logAction(`${player.name} wurde besiegt! Spiel vorbei.`);
    }
    updateDisplay();
}

// Spieler benutzt einen Trank
function heal() {
    if (player.potions > 0 && player.hp > 0) {
        player.hp += 30;
        if (player.hp > player.maxHp) player.hp = player.maxHp;
        player.potions--;
        logAction(`${player.name} benutzt einen Trank und heilt 30 HP.`);
        monsterAttack();
        updateDisplay();
    } else {
        logAction("Keine Tränke mehr verfügbar!");
    }
}

// Schild auffüllen oder zerstören
function recoverShield() {
    if (player.shield < player.maxShield) {
        player.shield += 30;
        if (player.shield > player.maxShield) player.shield = player.maxShield;
        logAction(`Dein Schild wurde um 30 Einheiten aufgefüllt.`);
    } else {
        logAction(`Dein Schild ist bereits voll.`);
    }
}

// Spiel zurücksetzen
function resetGame() {
    player.hp = player.maxHp;
    player.shield = player.maxShield;
    player.potions = 3;
    player.score = 0; // Punktzahl zurücksetzen
    chooseRandomMonster();
    document.getElementById('logText').textContent = "Das Spiel beginnt!";
    updateDisplay();
}

// Spiel starten
document.getElementById('startButton').addEventListener('click', function() {
    const playerNameInput = document.getElementById('playerName').value;
    if (playerNameInput) {
        player.name = playerNameInput;
        document.getElementById('charName').textContent = player.name;
    }

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game').style.display = 'flex';
    document.body.style.backgroundColor = '#ccc'; // Hintergrund vergrauen
    resetGame();
});

chooseRandomMonster();
