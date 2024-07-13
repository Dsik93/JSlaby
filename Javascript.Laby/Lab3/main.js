const sounds = {
  65: 'boom',
  83: 'clap',
  68: 'hihat',
  70: 'kick',
  71: 'tom',
  72: 'tink',
};

// Start stanow
let isRecording = [false, false, false, false];
// Tablice
let recordings = [[], [], [], []];

let startTime;

document.addEventListener('keydown', playSound);

// Dodanie nasłuchiwacza kliknięć na każdy klawisz, aby odtwarzać dźwięki po kliknięciu
document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('click', () => playSound({ keyCode: key.dataset.key }));
});

// Dodanie nasłuchiwaczy do przycisków nagrywania
document.querySelectorAll('.recordButton').forEach(button => {
  button.addEventListener('click', () => toggleRecording(button.dataset.channel));
});

// Dodanie kliknięć do odtwarzania
document.querySelectorAll('.playButton').forEach(button => {
  button.addEventListener('click', () => playRecording(button.dataset.channel));
});

// Dodanie do odtwarzania wszystkich kanałów
document.getElementById('playAll').addEventListener('click', playAllRecordings);

// Dodanie nasłuchiwacza kliknięć do przycisku start/stop nagrywania
document.getElementById('startStop').addEventListener('click', startStopAll);

// Funkcja pozwala slyszec dzwiek
function playSound(e) {
  const audioFileName = sounds[e.keyCode];
  if (!audioFileName) return;

  const audio = new Audio(`sounds/${audioFileName}.wav`);
  audio.currentTime = 0;
  audio.play();

  const keyElement = document.querySelector(`.key[data-key="${e.keyCode}"]`);
  if (keyElement) {
    keyElement.classList.add('playing');
    setTimeout(() => {
      keyElement.classList.remove('playing');
    }, 100);
  }

  // Nagrywa wciskniety klawisz i czas
  if (isRecording.some(recording => recording)) {
    const time = Date.now() - startTime;
    isRecording.forEach((recording, index) => {
      if (recording) {
        recordings[index].push({ key: e.keyCode, time });
      }
    });
  }
}

// Funkcja do przełączania nagrywania na wybranym kanale
function toggleRecording(channel) {
  const channelIndex = channel - 1;
  if (isRecording[channelIndex]) {
    isRecording[channelIndex] = false;
  } else {
    isRecording.fill(false);
    recordings[channelIndex] = [];
    isRecording[channelIndex] = true;
    startTime = Date.now();
  }
}

// Funkcja otwara wybrany kanal
function playRecording(channel) {
  const channelIndex = channel - 1;
  const recording = recordings[channelIndex];
  recording.forEach(({ key, time }) => {
    setTimeout(() => {
      const audio = new Audio(`sounds/${sounds[key]}.wav`);
      audio.play();
    }, time);
  });
}

// Funkcja do odtwarzania wszystkich nagrań
function playAllRecordings() {
  recordings.forEach((recording, index) => {
    if (recording.length > 0) {
      playRecording(index + 1);
    }
  });
}

// Funkcja przełączania nagrywania
function startStopAll() {
  const allRecording = isRecording.some(recording => recording);
  if (allRecording) {
    isRecording.fill(false);
  } else {
    isRecording.fill(true);
    recordings.forEach((_, index) => recordings[index] = []);
    startTime = Date.now();
  }
}
