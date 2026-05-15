// Audio Setup (Will fail gracefully if files are missing)
const bgm = new Howl({ src: ['audio/bgm.mp3'], loop: true, volume: 0.3 });
const clickSfx = new Howl({ src: ['audio/click.mp3'], volume: 0.5 });
const confettiSfx = new Howl({ src: ['audio/confetti.mp3'], volume: 0.7 });

// Story Data mapping
const story = [
    // Scene 2: Cherin Intro
    { speaker: "Cherin", text: "Happy birthday amachiiiiiiiiiii", sprite: "Cherin_neutral.png", action: "intro" },
    { speaker: "Cherin", text: "I don't have your photos so adjust with these shit I made ok 🙂‍↕🙂‍↕", sprite: "Cherin_neutral.png" },

    // Scene 3: Collage Reveal
    { speaker: "Cherin", text: "Your 22 right damnnn vayasayaloooo 😁😁", sprite: "Cherin_Smug.png", action: "show_collage" },
    { speaker: "Cherin", text: "Now i can really call you amachi😂", sprite: "Cherin_Smug.png" },

    // Scene 4: Amachi Reveal
    { speaker: "Cherin", text: "Whatever happens keep rocking and keep being both childish and mature", sprite: "Cherin_neutral.png", action: "show_amachi" },
    { speaker: "Cherin", text: "and yes I made you heheheee", sprite: "Cherin_laugh.png" },

    // Scene 5: Emotional Section
    { speaker: "Cherin", text: "I didn't expect to get a friend and I got a sister", sprite: "Cherin_soft.png", action: "emotional_start" },
    { speaker: "Cherin", text: "ya ya it might feel childish but yeah you my sis.", sprite: "Cherin_soft.png" },
    { speaker: "Cherin", text: "I hope you achieve everything and anything you desire and have a happy life.", sprite: "Cherin_soft.png" },
    { speaker: "Cherin", text: "New age new tea to discover that's our motto😂", sprite: "Cherin_laugh.png" },
    { speaker: "Cherin", text: "Tankuu for being there for meeee", sprite: "Cherin_soft.png" },

    // Scene 6: Tsundere Section
    { speaker: "Cherin", text: "This is the first and last time I do this so be grateful 🙂‍↔️🙂‍↔️", sprite: "Cherin_Smug.png" },
    { speaker: "Cherin", text: "ik this might not be the best gifts you have gotten", sprite: "Cherin_neutral.png" },
    { speaker: "Cherin", text: "but its my gift so keep it mofo", sprite: "Cherin_Smug.png" },
    { speaker: "Cherin", text: "and I am a detached person so I might not keep company", sprite: "Cherin_neutral.png" },
    { speaker: "Cherin", text: "but whenever you need motivation or help I would always be there", sprite: "Cherin_soft.png" },
    { speaker: "Cherin", text: "and you know I don’t lie", sprite: "Cherin_Smug.png" },

    // Scene 7: Supportive Section
    { speaker: "Cherin", text: "Believe in yourself", sprite: "Cherin_soft.png" },
    { speaker: "Cherin", text: "I see your potential", sprite: "Cherin_soft.png" },
    { speaker: "Cherin", text: "I dunno about others but I believe", sprite: "Cherin_soft.png" },
    { speaker: "Cherin", text: "So believe in yourself tooooooooo", sprite: "Cherin_laugh.png", action: "supportive_end" }
];

let currentLine = 0;
let isTyping = false;
let currentTimeout = null;

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const vnScreen = document.getElementById('vn-screen');
const loadingText = document.getElementById('loading-text');
const startBtn = document.getElementById('start-btn');
const cherinSprite = document.getElementById('cherin-sprite');
const amachiSprite = document.getElementById('amachi-sprite');
const dialogueBox = document.getElementById('dialogue-box');
const speakerName = document.getElementById('speaker-name');
const dialogueText = document.getElementById('dialogue-text');
const nextIndicator = document.getElementById('next-indicator');
const finalScreen = document.getElementById('final-screen');
const replayBtn = document.getElementById('replay-btn');

// Initialization typing effect
const initTexts = ["Initializing Amachii...", "Wait ok patience 😁😁😁😁"];
let initIndex = 0;

function typeInitText() {
    if (initIndex < initTexts.length) {
        loadingText.innerHTML = "";
        let text = initTexts[initIndex];
        let i = 0;
        let interval = setInterval(() => {
            loadingText.innerHTML += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                loadingText.innerHTML += '<span class="cursor"></span>';
                initIndex++;
                setTimeout(typeInitText, 1500);
            }
        }, 50);
    } else {
        startBtn.classList.remove('hidden');
    }
}

// Start Game
startBtn.addEventListener('click', () => {
    bgm.play();
    loadingScreen.classList.remove('active');
    setTimeout(() => {
        vnScreen.classList.add('active');
        document.body.classList.add('game-active');
        startGame();
    }, 1000);
});

// Run Init
setTimeout(typeInitText, 1000);

// Game Logic
function startGame() {
    // Initial UI setup
    gsap.to(dialogueBox, { opacity: 1, y: 0, duration: 1, delay: 0.5 });
    cherinSprite.classList.add('idle');
    playLine();
}

function playLine() {
    if (currentLine >= story.length) {
        endGame();
        return;
    }

    const line = story[currentLine];
    
    // Update Speaker
    speakerName.innerText = line.speaker;

    // Update Sprite
    cherinSprite.src = `Cherin_Sprites/${line.sprite}`;
    
    // Process Actions
    if (line.action === "intro") {
        gsap.to(cherinSprite, { opacity: 1, duration: 1 });
    } else if (line.action === "show_collage") {
        gsap.to('.polaroid', { 
            opacity: 1, 
            scale: 1, 
            stagger: 0.3, 
            duration: 0.8, 
            ease: "back.out(1.7)" 
        });
    } else if (line.action === "show_amachi") {
        amachiSprite.classList.add('idle');
        gsap.to(cherinSprite, { left: '30%', duration: 1 }); // move Cherin left
        gsap.set(amachiSprite, { left: '70%', xPercent: -50 });
        gsap.to(amachiSprite, { opacity: 1, duration: 1, delay: 0.5 });
    } else if (line.action === "emotional_start") {
        amachiSprite.src = "Amachi_Sprites/amachi_neutral.png";
        gsap.to('.polaroid', { opacity: 0, duration: 1 }); // fade out collage
        document.body.style.backgroundImage = "radial-gradient(#fff0f5 20%, transparent 20%), radial-gradient(#fff0f5 20%, transparent 20%)"; // Keep it soft
    }

    // Typewriter
    dialogueText.innerHTML = "";
    nextIndicator.classList.add('hidden');
    isTyping = true;
    cherinSprite.classList.add('talking');

    let i = 0;
    let speed = line.action === "emotional_start" || line.sprite === "Cherin_soft.png" ? 60 : 40;

    function typeChar() {
        if (!isTyping) return; // Cut short
        let char = line.text.charAt(i);
        dialogueText.innerHTML += char;

        i++;
        if (i < line.text.length) {
            currentTimeout = setTimeout(typeChar, speed);
        } else {
            finishTyping();
        }
    }
    typeChar();
}

function finishTyping() {
    isTyping = false;
    clearTimeout(currentTimeout);
    cherinSprite.classList.remove('talking');
    dialogueText.innerHTML = story[currentLine].text;
    nextIndicator.classList.remove('hidden');
}

// Next Line Interaction
dialogueBox.addEventListener('click', () => {
    if (isTyping) {
        // Skip typing
        finishTyping();
    } else {
        // Go to next line
        clickSfx.play();
        currentLine++;
        playLine();
    }
});

function endGame() {
    gsap.to(dialogueBox, { opacity: 0, duration: 1 });
    gsap.to(cherinSprite, { opacity: 0, duration: 1 });
    amachiSprite.classList.remove('idle');
    
    // Zoom onto Amachi
    gsap.to(amachiSprite, { 
        left: '50%', 
        xPercent: -50,
        y: 105,
        scale: 1.2,
        duration: 2, 
        ease: "power2.inOut",
        onComplete: () => {
            finalScreen.classList.remove('hidden');
            gsap.fromTo(finalScreen, {opacity: 0}, {opacity: 1, duration: 2});

            confettiSfx.play();
            fireConfetti();
        }
    });
}

// Replay Logic
replayBtn.addEventListener('click', () => {
    currentLine = 0;
    isTyping = false;
    clearTimeout(currentTimeout);
    
    finalScreen.classList.add('hidden');
    gsap.killTweensOf("*");
    
    amachiSprite.style = "";
    cherinSprite.style = "";
    dialogueBox.style = "";
    
    amachiSprite.classList.remove('idle');
    cherinSprite.classList.remove('idle');
    amachiSprite.src = "Amachi_Sprites/amachi_blush.png";
    cherinSprite.src = "Cherin_Sprites/Cherin_neutral.png";
    
    gsap.set('.polaroid', { opacity: 0, scale: 0.5 });
    document.body.style.backgroundImage = "";
    
    startGame();
});

function fireConfetti() {
    var duration = 3000;
    var end = Date.now() + duration;
    var rect = document.getElementById('game-container').getBoundingClientRect();
    var leftOrigin = {
        x: (rect.left + rect.width * 0.08) / window.innerWidth,
        y: (rect.top + rect.height * 0.18) / window.innerHeight
    };
    var rightOrigin = {
        x: (rect.left + rect.width * 0.92) / window.innerWidth,
        y: (rect.top + rect.height * 0.18) / window.innerHeight
    };

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: leftOrigin,
            colors: ['#ff8fa3', '#ffb3c6', '#ffffff']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: rightOrigin,
            colors: ['#ff8fa3', '#ffb3c6', '#ffffff']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}
