const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory pet state (in production, this would use a database)
let petState = {
  name: "Buddy",
  happiness: 80,
  hunger: 40,
  energy: 60,
  mood: "excited",
  lastFed: new Date(),
  level: 1,
  coins: 100,
  items: ["bone", "ball"],
  funnyQuotes: [
    "Woof! I'm so happy I could chase my tail for hours!",
    "Did someone say treats? I heard treats!",
    "I'm not fat, I'm just... fluffy!",
    "My owner thinks I can't count, but I know I only got 2 treats instead of 3!",
    "I may be a virtual pet, but my love for belly rubs is 100% real!"
  ]
};

// API Routes

// Get pet status
app.get('/api/pet/status', (req, res) => {
  // Decrease hunger over time
  const timeDiff = new Date() - new Date(petState.lastFed);
  const hoursPassed = timeDiff / (1000 * 60 * 60);
  
  if (hoursPassed > 1) {
    petState.hunger = Math.max(0, petState.hunger - Math.floor(hoursPassed * 5));
    petState.happiness = Math.max(0, petState.happiness - Math.floor(hoursPassed * 2));
  }
  
  res.json(petState);
});

// Feed pet
app.post('/api/pet/feed', (req, res) => {
  const { foodType } = req.body;
  
  let hungerIncrease = 20;
  let happinessIncrease = 10;
  let response = "Yum! That was delicious!";
  
  switch(foodType) {
    case 'fish':
      hungerIncrease = 25;
      response = "Meow! Wait... I mean woof! Fish is purrfect!";
      break;
    case 'bone':
      hungerIncrease = 30;
      happinessIncrease = 15;
      response = "BONE! BONE! BONE! *excited tail wagging*";
      break;
    case 'apple':
      hungerIncrease = 15;
      happinessIncrease = 5;
      response = "An apple a day keeps the vet away! ...Right?";
      break;
    case 'carrot':
      hungerIncrease = 18;
      response = "Crunch crunch! I'm basically a rabbit now!";
      break;
  }
  
  petState.hunger = Math.min(100, petState.hunger + hungerIncrease);
  petState.happiness = Math.min(100, petState.happiness + happinessIncrease);
  petState.lastFed = new Date();
  
  res.json({
    success: true,
    message: response,
    newStats: {
      hunger: petState.hunger,
      happiness: petState.happiness
    }
  });
});

// Play with pet
app.post('/api/pet/play', (req, res) => {
  const { gameType } = req.body;
  
  let energyDecrease = 10;
  let happinessIncrease = 20;
  let response = "That was fun! Let's play again!";
  
  switch(gameType) {
    case 'fetch':
      energyDecrease = 15;
      happinessIncrease = 25;
      response = "FETCH! I love fetch! Throw it again! Again! AGAIN!";
      break;
    case 'puzzle':
      energyDecrease = 5;
      happinessIncrease = 15;
      response = "I solved it! I'm basically Einstein with fur!";
      break;
    case 'dash':
      energyDecrease = 20;
      happinessIncrease = 30;
      response = "ZOOMIES! I'm fast! I'm so fast I'm basically invisible!";
      break;
    case 'run':
      energyDecrease = 25;
      happinessIncrease = 20;
      response = "Running is great! Especially when there's a squirrel to chase!";
      break;
  }
  
  petState.energy = Math.max(0, petState.energy - energyDecrease);
  petState.happiness = Math.min(100, petState.happiness + happinessIncrease);
  
  // Level up logic
  if (petState.happiness > 90 && Math.random() > 0.7) {
    petState.level += 1;
    petState.coins += 50;
    response += ` LEVEL UP! I'm now level ${petState.level}! So smart!`;
  }
  
  res.json({
    success: true,
    message: response,
    newStats: {
      energy: petState.energy,
      happiness: petState.happiness,
      level: petState.level,
      coins: petState.coins
    }
  });
});

// Get funny quote
app.get('/api/pet/quote', (req, res) => {
  const randomQuote = petState.funnyQuotes[Math.floor(Math.random() * petState.funnyQuotes.length)];
  res.json({ quote: randomQuote });
});

// Chat with pet
app.post('/api/pet/chat', (req, res) => {
  const { message } = req.body;
  
  let responses = [
    "Woof! I totally understand! *pretends to understand*",
    "That's pawsome! Tell me more!",
    "Did you bring treats? I only listen when there are treats involved.",
    "Bark bark! Translation: You're the best human ever!",
    "I would respond properly, but I'm busy being adorable.",
    "Your words are nice, but have you seen this stick I found?",
    "I love you too! Unless you're the mailman. Are you the mailman?",
    "That's interesting! *chases own tail*"
  ];
  
  if (message.toLowerCase().includes('treat') || message.toLowerCase().includes('food')) {
    responses = [
      "TREATS?! WHERE?! I'll do anything for treats!",
      "Food? Did someone say FOOD?! I'M STARVING! *just ate 5 minutes ago*",
      "Treats make everything better! Especially belly rubs with treats!"
    ];
  } else if (message.toLowerCase().includes('play')) {
    responses = [
      "PLAY?! YES! Let's play! I'll get my favorite stick!",
      "Playing is the best! Except for eating. And sleeping. And belly rubs.",
      "I'm always ready to play! Energy level: MAXIMUM ZOOMIES!"
    ];
  }
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  res.json({
    response: randomResponse,
    mood: petState.mood
  });
});

// Serve static files and pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/games', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'games.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/friends', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'friends.html'));
});

app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'shop.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.listen(PORT, () => {
  console.log(`🐕 Virtual Pet Mania server is running on port ${PORT}`);
  console.log(`🎮 Ready to serve some pawsome content!`);
});