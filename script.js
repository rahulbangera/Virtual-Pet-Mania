const navbar = document.querySelector('.navbar');
const leftSticky = document.querySelector('.left-nav');
const feederButton = document.getElementById('feeder');
const petImage = document.getElementById('petImage');
const lefter = document.querySelector('.lefti');
const player = document.getElementById('playy');

feederButton.addEventListener('mouseover', () => {
    lefter.style.animation = 'jump 0.5s infinite'; 
});

feederButton.addEventListener('mouseout', () => {
    lefter.style.animation = ''; 
});

player.addEventListener('mouseover', () => {
    lefter.style.animation = 'slide 0.5s infinite';  
});

player.addEventListener('mouseout', () => {
    lefter.style.animation = ''; 
});

const sticky = navbar.offsetTop;

    function stickyNavbar() {
    if (window.pageYOffset > sticky) {
      leftSticky.classList.add('left-sticky');
      navbar.classList.add('sticky');
    } else {
      navbar.classList.remove('sticky');
      leftSticky.classList.remove('left-sticky');
    }
  }
  
  window.onscroll = function() {
      stickyNavbar();
  };

const chatBubble = document.getElementById('chat-bubble');
const chatBox = document.getElementById('chat-box');
const closeChat = document.getElementById('close-chat');

chatBubble.addEventListener('click', () => {
    chatBox.classList.remove('hidden');
    chatBubble.classList.add('hidden'); 
});

closeChat.addEventListener('click', () => {
    chatBox.classList.add('hidden');
    chatBubble.classList.remove('hidden'); 
});


const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');
const messageInput = document.getElementById('messageInput');

emojiBtn.addEventListener('click', () => {
    emojiPicker.classList.toggle('hidden2');
});

emojiPicker.addEventListener('click', (event) => {
    if (event.target.classList.contains('emoji')) {
        messageInput.value += event.target.textContent;
    }
});

document.addEventListener('click', (event) => {
    if (!emojiBtn.contains(event.target) && !emojiPicker.contains(event.target)) {
        emojiPicker.classList.add('hidden2');
    }
});


const feedMeBtn = document.getElementById('feeder');
const modal = document.getElementById('feedingModal');
const closeModal = document.getElementById('closeModal');

feedMeBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

const foodSound = document.getElementById('foodSound');
const foodItems = document.querySelectorAll('.food-item');
const body = document.querySelector('body');

foodItems.forEach(food => {
    food.addEventListener('click', () => {
        const feedPopUp = document.createElement('div');
        feedPopUp.classList.add('feed-pop-up');
        foodSound.currentTime = 0;
        foodSound.play();
        feedPopUp.innerText = `Your pet enjoyed the ${food.querySelector('p').innerText}!`;

        body.appendChild(feedPopUp);

        feedPopUp.style.display = 'block';

        setTimeout(() => {
            feedPopUp.style.display = 'none';
            body.removeChild(feedPopUp); 
        }, 1500); 
    });
});
