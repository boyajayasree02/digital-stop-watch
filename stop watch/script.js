const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const millisecondsElement = document.getElementById('milliseconds');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');
const lapButton = document.getElementById('lapButton');
const clearLapsButton = document.getElementById('clearLapsButton');
const lapsList = document.getElementById('lapsList');
const lapCount = document.getElementById('lapCount');
const emptyState = document.getElementById('emptyState');

let elapsedMilliseconds = 0;
let startedAt = 0;
let animationFrameId = null;
let lapNumber = 0;

function formatTime(totalMilliseconds) {
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((totalMilliseconds % 1000) / 10);

  return [hours, minutes, seconds, milliseconds].map((value) => String(value).padStart(2, '0'));
}

function renderTime(totalMilliseconds) {
  const [hours, minutes, seconds, milliseconds] = formatTime(totalMilliseconds);
  hoursElement.textContent = hours;
  minutesElement.textContent = minutes;
  secondsElement.textContent = seconds;
  millisecondsElement.textContent = milliseconds;
}

function updateTimer(timestamp) {
  elapsedMilliseconds = timestamp - startedAt;
  renderTime(elapsedMilliseconds);
  animationFrameId = requestAnimationFrame(updateTimer);
}

function startTimer() {
  if (animationFrameId !== null) return;
  startedAt = performance.now() - elapsedMilliseconds;
  animationFrameId = requestAnimationFrame(updateTimer);
}

function pauseTimer() {
  if (animationFrameId === null) return;
  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  elapsedMilliseconds = performance.now() - startedAt;
  renderTime(elapsedMilliseconds);
}

function resetTimer() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  elapsedMilliseconds = 0;
  renderTime(0);
  clearLaps();
}

function addLap() {
  if (elapsedMilliseconds === 0) return;
  lapNumber += 1;
  const lap = document.createElement('li');
  const [hours, minutes, seconds, milliseconds] = formatTime(elapsedMilliseconds);
  lap.className = 'lap';
  lap.innerHTML = `<span>Lap ${lapNumber}</span><strong>${hours} : ${minutes} : ${seconds} : ${milliseconds}</strong>`;
  lapsList.prepend(lap);
  emptyState.hidden = true;
  lapCount.textContent = lapNumber;
}

function clearLaps() {
  lapsList.querySelectorAll('.lap').forEach((lap) => lap.remove());
  lapNumber = 0;
  lapCount.textContent = '0';
  emptyState.hidden = false;
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
clearLapsButton.addEventListener('click', clearLaps);
lapButton.addEventListener('click', addLap);
