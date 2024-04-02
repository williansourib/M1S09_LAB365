let pomodoroInterval;
let restInterval;
let pomodoroRunning = false;
let restRunning = false;
let pomodoroSeconds = 0;
let restSeconds = 0;
const pomodoroDuration = 1500; // 25 minutos em segundos
const restDuration = 300; // 5 minutos em segundos
const timerDisplay = document.querySelector('.timer');
const restTimerDisplay = document.getElementById('rest-timer-display'); // Elemento para exibir o tempo de descanso
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');
const exerciseContainer = document.querySelector('.exercise-container');
const exerciseName = document.getElementById('exercise-name');
const exerciseDescription = document.getElementById('exercise-description');
const completeButton = document.getElementById('complete-btn');
const stretchTimerDisplay = document.getElementById('stretch-timer-display');

// Array para armazenar os índices dos alongamentos realizados
let completedExercises = [];

// Função para iniciar o Pomodoro
function startPomodoro() {
  pomodoroRunning = true;
  startButton.style.display = 'none';
  stopButton.style.display = 'inline-block';

  pomodoroInterval = setInterval(() => {
    pomodoroSeconds++;
    displayTime(pomodoroSeconds);

    if (pomodoroSeconds >= pomodoroDuration) {
      clearInterval(pomodoroInterval);
      pomodoroRunning = false;
      startButton.style.display = 'inline-block';
      stopButton.style.display = 'none';
      fetchExercise();
      pomodoroSeconds = 0;
    }
  }, 1000);
}

// Função para iniciar o Descanso
function startRest() {
  restRunning = true;

  restInterval = setInterval(() => {
    restSeconds++;
    displayTime(restSeconds);
    displayRestTime(restDuration - restSeconds); // Atualiza o tempo restante do intervalo de descanso

    if (restSeconds >= restDuration) {
      clearInterval(restInterval);
      restRunning = false;
      startPomodoro();
      restSeconds = 0;
    }
  }, 1000);
}

// Função para interromper o Pomodoro
function stopPomodoro() {
  clearInterval(pomodoroInterval);
  clearInterval(restInterval); // Certifique-se de limpar também o intervalo de descanso
  pomodoroRunning = false;
  restRunning = false;
  startButton.style.display = 'inline-block';
  stopButton.style.display = 'none';
}

// Função para exibir o tempo decorrido
function displayTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
  timerDisplay.textContent = display;
}

// Função para exibir o tempo restante do intervalo de descanso
function displayRestTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
  restTimerDisplay.textContent = display;
}

// Função para buscar um exercício de alongamento de uma API gratuita
function fetchExercise() {
    fetch('https://api.api-ninjas.com/v1/exercises?type=stretching', {
        method: 'GET',
        headers: {
            'X-Api-Key': // Substitua pela sua chave API real
        }
    })
    .then(response => response.json())
    .then(data => {
      let exercise;
      do {
        exercise = data[Math.floor(Math.random() * data.length)];
      } while (completedExercises.includes(exercise.index));

      displayExercise(exercise);
    })
    .catch(error => {
      console.error('Erro ao buscar exercício:', error);
    });
}

// Função para exibir o exercício de alongamento
function displayExercise(exercise) {
  exerciseName.textContent = exercise.name;
  exerciseDescription.textContent = exercise.description;
  exerciseContainer.style.display = 'block';

  completedExercises.push(exercise.index);
  localStorage.setItem('completedExercises', JSON.stringify(completedExercises));

  startRest(); // Inicia o tempo de descanso após o Pomodoro ser concluído e o exercício exibido
}

// Função para concluir o exercício de alongamento
function completeExercise() {
  clearInterval(restInterval); // Interrompe o intervalo de descanso se o exercício for concluído manualmente
  exerciseContainer.style.display = 'none';
}

// Carrega os índices dos exercícios já realizados do localStorage
if (localStorage.getItem('completedExercises')) {
  completedExercises = JSON.parse(localStorage.getItem('completedExercises'));
}

// Adiciona os event listeners aos botões
startButton.addEventListener('click', startPomodoro);
stopButton.addEventListener('click', stopPomodoro);
completeButton.addEventListener('click', completeExercise);
