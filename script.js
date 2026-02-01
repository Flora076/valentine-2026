// Initialize configuration
const config = window.VALENTINE_CONFIG;

// Validate configuration
function validateConfig() {
    const warnings = [];

    // Check required fields
    if (!config.valentineName) {
        warnings.push("Valentine's name is not set! Using default.");
        config.valentineName = "mi Amor";
    }

    // Validate colors
    const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    Object.entries(config.colors).forEach(([key, value]) => {
        if (!isValidHex(value)) {
            warnings.push(`Invalid color for ${key}! Using default.`);
            config.colors[key] = getDefaultColor(key);
        }
    });

    // Validate animation values
    if (parseFloat(config.animations.floatDuration) < 5) {
        warnings.push("Float duration too short! Setting to 5s minimum.");
        config.animations.floatDuration = "5s";
    }

    if (config.animations.heartExplosionSize < 1 || config.animations.heartExplosionSize > 3) {
        warnings.push("Heart explosion size should be between 1 and 3! Using default.");
        config.animations.heartExplosionSize = 1.5;
    }

    // Log warnings if any
    if (warnings.length > 0) {
        console.warn("⚠️ Configuration Warnings:");
        warnings.forEach(warning => console.warn("- " + warning));
    }
}

// Default color values
function getDefaultColor(key) {
    const defaults = {
        backgroundStart: "#308a58",
        backgroundEnd: "#487d60",
        buttonBackground: "#3aab2b",
        buttonHover: "#317a52",
        textColor: "#10de6c"
    };
    return defaults[key];
}

// Set page title
document.title = config.pageTitle;

// Initialize the page content when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    // Validate configuration first
    validateConfig();

    // Set texts from config
    document.getElementById('valentineTitle').textContent = `Mi Amor ${config.valentineName}`;
    
    // Set first question texts
 const question1Text = document.getElementById('question1Text');
    question1Text.textContent = config.questions.first.text;

    const yesBtn1 = document.getElementById('yesBtn1');
    yesBtn1.textContent = config.questions.first.yesBtn;
    yesBtn1.onclick = () => showNextQuestion(2); // Go to question 2
    
    
   // --- Second Question ---
    const question2Text = document.getElementById('question2Text');
    question2Text.textContent = config.questions.second.text;

    const yesBtn2 = document.getElementById('yesBtn2');
   startText.textContent = config.questions.second.yesBtn;
    startText.onclick = celebrate; // Yes triggers celebration

    const noBtn2 = document.getElementById('noBtn2');
    noBtn2.textContent = config.questions.second.noBtn;
    makeButtonRunAway(noBtn2); // No runs away

    // Create initial floating elements
    createFloatingElements();
// Attach runaway behavior ONLY to question 2 "No"
 const noBtn2 = document.getElementById('noBtn2');
makeButtonRunAway(noBtn2);

});


// Floating Hearts - Non-blocking
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    if (!container) return;

    // Clear any existing hearts
    container.innerHTML = '';

    // Create floating hearts
    config.floatingEmojis.hearts.forEach(heart => {
        const div = document.createElement('div');
        div.className = 'floating-heart';
        div.textContent = heart;
        setRandomPosition(div);
        container.appendChild(div);
    });
}

// Randomize position and animation for each heart
function setRandomPosition(element) {
    element.style.position = 'absolute';
    element.style.left = Math.random() * 100 + 'vw';
    element.style.top = Math.random() * 100 + 'vh';

    // Random floating speed
    const duration = 5 + Math.random() * 10; // 5s to 15s
    element.style.animation = `floatUp ${duration}s linear infinite`;

    // Prevent blocking buttons
    element.style.pointerEvents = 'none';
}

// Initialize hearts after DOM is loaded
window.addEventListener('DOMContentLoaded', createFloatingElements);


// Function to show next question
function showNextQuestion(questionNumber) {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    document.getElementById(`question${questionNumber}`).classList.remove('hidden');
}


// make no button run away
function makeButtonRunAway(button) {
    if (!button) return;

    document.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const btnX = rect.left + rect.width / 2;
        const btnY = rect.top + rect.height / 2;

        const dx = e.clientX - btnX;
        const dy = e.clientY - btnY;
        const distance = Math.sqrt(dx*dx + dy*dy);

        if (distance < 150) { // how close the mouse triggers the move
            let moveX = -dx * 0.8;
            let moveY = -dy * 0.8;

            let newLeft = rect.left + moveX;
            let newTop = rect.top + moveY;

            // Keep inside window bounds
            newLeft = Math.max(0, Math.min(window.innerWidth - rect.width, newLeft));
            newTop = Math.max(0, Math.min(window.innerHeight - rect.height, newTop));

            button.style.position = 'fixed';
            button.style.left = `${newLeft}px`;
            button.style.top = `${newTop}px`;
        }
    });
}


// Celebration function
function celebrate() {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    const celebration = document.getElementById('celebration');
    celebration.classList.remove('hidden');
    
    // Set celebration messages
    document.getElementById('celebrationTitle').textContent = config.celebration.title;
    document.getElementById('celebrationMessage').textContent = config.celebration.message;
    document.getElementById('celebrationEmojis').textContent = config.celebration.emojis;
    
    // Create heart explosion effect
    createHeartExplosion();
}

// Create heart explosion animation
function createHeartExplosion() {
    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        const randomHeart = config.floatingEmojis.hearts[Math.floor(Math.random() * config.floatingEmojis.hearts.length)];
        heart.innerHTML = randomHeart;
        heart.className = 'heart';
        document.querySelector('.floating-elements').appendChild(heart);
        setRandomPosition(heart);
    }
}

// Music Player Setup
function setupMusicPlayer() {
    const musicControls = document.getElementById('musicControls');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const musicSource = document.getElementById('musicSource');

    // Only show controls if music is enabled in config
    if (!config.music.enabled) {
        musicControls.style.display = 'none';
        return;
    }
    
    
    // Set music source and volume
    musicSource.src = config.music.musicUrl;
    bgMusic.volume = config.music.volume || 0.5;
    bgMusic.load();

    // Try autoplay if enabled
    if (config.music.autoplay) {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay prevented by browser");
                musicToggle.textContent = config.music.startText;
            });
        }
    }

    // Toggle music on button click
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.textContent = config.music.stopText;
        } else {
            bgMusic.pause();
            musicToggle.textContent = config.music.startText;
        }
    });
} 

