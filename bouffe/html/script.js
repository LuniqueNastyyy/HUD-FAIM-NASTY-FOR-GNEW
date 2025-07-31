function updateFrenchTime() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const parisOffset = new Date(utc + (3600000 * getParisOffsetHours(now)));
  let hours = parisOffset.getHours();
  let minutes = parisOffset.getMinutes();
  const formattedTime = `${padZero(hours)}H${padZero(minutes)}`;

  document.getElementById('time').textContent = formattedTime;
}

function getParisOffsetHours(date) {
  const january = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
  const july = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  const isDST = date.getTimezoneOffset() < Math.max(january, july);
  return isDST ? 2 : 1;
}

function padZero(value) {
  return value < 10 ? '0' + value : value;
}

function updateBarStatus(element, percentage) {
  element.classList.remove('low', 'medium');
  
  if (percentage <= 10) {
    element.classList.add('low');
  } else if (percentage <= 30) {
    element.classList.add('medium');
  }
}

setInterval(updateFrenchTime, 30000);
updateFrenchTime();

const hudElement = document.querySelector('.hud');

window.addEventListener('message', (event) => {
  const data = event.data;

  if (data.action === 'updateHud') {
    const hungerElement = document.getElementById('hunger');
    const thirstElement = document.getElementById('thirst');
    
    hungerElement.style.width = `${data.hunger}%`;
    thirstElement.style.width = `${data.thirst}%`;
    
    updateBarStatus(hungerElement, data.hunger);
    updateBarStatus(thirstElement, data.thirst);
    
    document.getElementById('street').textContent = data.street;
    document.querySelector('.street-subtitle').textContent = data.cross || '';
  } else if (data.action === 'hideHud') {
    hudElement.classList.add('hidden');
  } else if (data.action === 'showHud') {
    hudElement.classList.remove('hidden');
  }
});