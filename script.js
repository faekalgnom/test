const bottle = document.getElementById('bottle');
const spinButton = document.getElementById('spin');
const addNameButton = document.getElementById('addName');
const nameInput = document.getElementById('nameInput');
const namesContainer = document.getElementById('names');
const questions = [
  "Was war ein Moment in letzter Zeit, in dem du das Gefühl hattest, versagt zu haben?",
  "Wann hattest du zuletzt das Gefühl, Angst davor zu haben, etwas falsch zu machen?",
  "Was hat dich in der letzten Zeit an deiner Arbeit so richtig frustriert?",
  "Welche Aufgabe oder Herausforderung würdest du besser meistern, wenn du mehr Unterstützung hättest?",
  "Welche Aufgabe schiebst du gerade vor dir her, weil du dich unsicher fühlst?",
  "Wann hattest du das Gefühl, dass deine Meinung oder Idee im Team nicht ernst genommen wurde?",
  "Was möchtest du, dass dein Team besser an dir sieht oder versteht?",
  "Wann hast du dich das letzte Mal im Team für eine Idee oder Entscheidung entschuldigt?",
  "Wann hast du das letzte Mal um Hilfe gebeten, obwohl es dir schwergefallen ist?",
  "Welche persönliche Schwäche belastet dich im Arbeitsalltag am meisten?",
  "Welche Entscheidung in deiner Arbeit hat dich zuletzt nachts wachgehalten?",
  "Wann hast du zuletzt ein Risiko eingegangen, obwohl du Angst hattest, zu scheitern?",
  "Gibt es etwas, das dich im Team nervös macht, aber du traust dich nicht, es anzusprechen?",
  "Hast du schon einmal das Gefühl gehabt, dass deine Arbeit nicht wertgeschätzt wurde? Wie bist du damit umgegangen?",
  "Welche Aufgabe oder Herausforderung reizt dich, aber du traust dich bisher nicht, sie anzugehen?",
  "Wann hast du zuletzt deine Komfortzone verlassen, und wie hast du dich dabei gefühlt?",
  "Was würdest du dir wünschen, dass dein Team in letzter Zeit anders gemacht hätte?",
  "Wann hast du dich das letzte Mal im Team nicht wohl gefühlt, und warum?"
];

let currentAngle = 0; // Startwinkel
let spinSpeed = 0; // Anfangsgeschwindigkeit
let animationFrame;
let names = []; // Liste der Namen

function addName() {
  const name = nameInput.value.trim();
  if (name) {
    names.push(name);
    nameInput.value = '';
    updateNames();
  }
}

function updateNames() {
  namesContainer.innerHTML = ''; // Reset

  const screenWidth = window.innerWidth;
  const baseRadius = 100; // Standardgröße
  const radius = screenWidth < 600 ? 60 : baseRadius; // Kleinere Namenverteilung auf kleinen Bildschirmen
  const angleStep = (2 * Math.PI) / names.length;

  names.forEach((name, index) => {
    const angle = index * angleStep; // Berechne den Winkel für jeden Namen
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);

    const nameElement = document.createElement('div');
    nameElement.className = 'name';
    nameElement.style.position = 'absolute';
    nameElement.style.left = `calc(${x}% - 20px)`;
    nameElement.style.top = `calc(${y}% - 10px)`;
    nameElement.textContent = name;
    namesContainer.appendChild(nameElement);
  });
}

function spinBottle() {
  if (names.length === 0) {
    alert('Bitte füge mindestens einen Namen hinzu!');
    return;
  }

  // Drehen-Button ausblenden
  spinButton.style.display = 'none';

  // Button zur Eingabe von Namen ausblenden
  addNameButton.style.display = 'none';
  nameInput.style.display = 'none';

  spinSpeed = Math.random() * 10 + 15; // Zufällige Startgeschwindigkeit
  if (animationFrame) cancelAnimationFrame(animationFrame); // Vorherige Animation stoppen
  animateSpin();
}

function animateSpin() {
  currentAngle += spinSpeed; // Flasche weiterdrehen
  spinSpeed *= 0.98; // Allmähliches Abbremsen

  bottle.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg)`; // Translate bleibt für Zentrierung

  if (spinSpeed > 0.05) {
    animationFrame = requestAnimationFrame(animateSpin); // Weiterdrehen
  } else {
    determineWinner();
    // Drehen-Button wieder einblenden
    spinButton.style.display = 'inline-block';
  }
}

function determineWinner() {
  const normalizedAngle = (currentAngle % 360 + 360) % 360; // Winkel normalisieren
  const sectionAngle = 360 / names.length; // Winkel pro Sektor
  const offsetAngle = 270; // Spitze der Flasche nach oben
  const adjustedAngle = (normalizedAngle + offsetAngle) % 360; // Winkel anpassen

  // Gewinner-Index berechnen
  const winnerIndex = Math.round(adjustedAngle / sectionAngle) % names.length;

  // Gewinner und Frage ins Overlay schreiben
  const winnerText = document.getElementById('winnerText');
  const winnerOverlay = document.getElementById('winnerOverlay');
  const randomQuestion = getRandomQuestion();
  
  winnerText.innerHTML = `
  <p style="font-size: 18px; color: #555; margin-bottom: 10px;">
    Vertrauen entsteht durch Verletzlichkeit. Also fass dir ein Herz, <strong>${names[winnerIndex]}</strong>, und erzähle uns:
  </p>
  <p style="font-size: 24px; font-weight: bold; color: #007bff; margin-top: 10px;">
    ${randomQuestion}
  </p>
`;
winnerOverlay.style.display = 'flex'; // Overlay sichtbar machen
}

addNameButton.addEventListener('click', addName);
spinButton.addEventListener('click', spinBottle);


const resetButton = document.getElementById('reset');

resetButton.addEventListener('click', () => {
  addNameButton.style.display = 'inline-block'; // Button wieder einblenden
  nameInput.style.display = 'inline-block'; // Eingabefeld auch wieder einblenden
  resetButton.style.display = 'none'; // Reset-Button ausblenden
  currentAngle = 0; // Flasche auf Anfangsposition zurücksetzen
  bottle.style.transform = 'translate(-50%, -50%) rotate(0deg)';
});

const closeOverlayButton = document.getElementById('closeOverlay');
const winnerOverlay = document.getElementById('winnerOverlay');

closeOverlayButton.addEventListener('click', () => {
  winnerOverlay.style.display = 'none'; // Overlay schließen
});


function getRandomQuestion() {
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}