let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    document.addEventListener('mousemove', (e) => {
      if(!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
        
      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if(this.rotating) {
        this.rotation = degrees;
      }

      if(this.holdingPaper) {
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    })

    paper.addEventListener('mousedown', (e) => {
      if(this.holdingPaper) return; 
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      if(e.button === 0) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
      if(e.button === 2) {
        this.rotating = true;
      }
    });
    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

const videoElement = document.getElementById('webcam');
const audioElement = document.querySelector('audio');
const videoPaper = document.getElementById('video-paper');
const hoverDiv = document.getElementById('hover-div');
const hoverAudio = document.getElementById('hover-audio');
const hoverText = document.getElementById('hover-text');
const creditsElement = document.getElementById('credits');
const extraDiv = document.getElementById('extra-div');

videoElement.addEventListener('play', () => {
  creditsElement.style.display = 'block';
});

let isWebcamStarted = false;

async function startWebcam() {
  try {
    if (!isWebcamStarted) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = stream;
      isWebcamStarted = true;
    }
    playVideoAndAudio();
  } catch (error) {
    console.error('Error accessing the webcam:', error);
    alert('Camera access diye de please. Ami hack korar moto khomota rakhi na, trust me :(');
  }
}

function playVideoAndAudio() {
  stopOtherAudio(hoverAudio); 
  if (videoElement.paused) {
    videoElement.play();
    if (audioElement.paused) {
      audioElement.play();
    }
  }
}

function playHoverAudio() {
  stopOtherAudio(audioElement); 
  if (hoverAudio.paused) {
    hoverAudio.play();
  }
}

function stopOtherAudio(currentAudio) {
  if (!audioElement.paused && currentAudio !== audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0; 
  }
  if (!hoverAudio.paused && currentAudio !== hoverAudio) {
    hoverAudio.pause();
    hoverAudio.currentTime = 0; 
  }
}

videoPaper.addEventListener('click', startWebcam);
videoPaper.addEventListener('mouseenter', startWebcam);


hoverDiv.addEventListener('mouseenter', playHoverAudio);
hoverDiv.addEventListener('click', playHoverAudio);

function revealText() {
  hoverText.classList.add('show'); 
}

hoverText.addEventListener('mouseenter', () => {
  if (hoverText.classList.contains('show')) {
    extraDiv.style.display = 'block';
  }
});

hoverDiv.addEventListener('mouseenter', revealText);
hoverDiv.addEventListener('click', revealText);
