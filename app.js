const startBtn = document.getElementById('startBtn');
const nameInput = document.getElementById('name');
const cameraEl = document.getElementById('camera');
const introEl = document.getElementById('intro');
const loadingEl = document.getElementById('loading');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const takePhotoBtn = document.getElementById('takePhotoBtn');
const retryBtn = document.getElementById('retryBtn');
const resultEl = document.getElementById('result');
const avatarPreview = document.getElementById('avatarPreview');
const playerNameDisplay = document.getElementById('playerNameDisplay');
const progressFill = document.getElementById('progressFill');
const restartBtn = document.getElementById('restartBtn');

let stream = null;

startBtn.addEventListener('click', async () => {
  const name = nameInput.value.trim();
  if (!name) {
    alert('Vui lòng nhập tên trước khi bắt đầu.');
    return;
  }

  introEl.classList.add('hidden');
  cameraEl.classList.remove('hidden');

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;
  } catch (err) {
    alert('Không thể truy cập camera. Vui lòng kiểm tra quyền và thử lại.');
    console.error(err);
    introEl.classList.remove('hidden');
    cameraEl.classList.add('hidden');
  }
});

function stopStream() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
}

function showResult() {
  loadingEl.classList.add('hidden');
  resultEl.classList.remove('hidden');
}

function showLoading(playerName, imageData) {
  cameraEl.classList.add('hidden');
  loadingEl.classList.remove('hidden');
  
  if (playerNameDisplay) playerNameDisplay.textContent = playerName;
  if (avatarPreview) avatarPreview.src = imageData;
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => showResult(), 800);
    }
    if (progressFill) progressFill.style.width = progress + '%';
  }, 200);
}

takePhotoBtn.addEventListener('click', () => {
  const w = video.videoWidth;
  const h = video.videoHeight;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, w, h);

  const imageData = canvas.toDataURL('image/jpeg');
  const playerName = nameInput.value.trim();

  stopStream();
  showLoading(playerName, imageData);
});

retryBtn.addEventListener('click', async () => {
  retryBtn.classList.add('hidden');
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    alert('Không thể truy cập camera.');
  }
});

restartBtn.addEventListener('click', () => {
  resultEl.classList.add('hidden');
  if (loadingEl) loadingEl.classList.add('hidden');
  introEl.classList.remove('hidden');
  nameInput.value = '';
  if (progressFill) progressFill.style.width = '0%';
});

if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  const info = document.createElement('p');
  info.textContent = 'Trình duyệt này không hỗ trợ camera. Thử Chrome/Edge/Firefox trên thiết bị hỗ trợ.';
  document.body.appendChild(info);
}