// Initialize configuration
const config = window.VALENTINE_CONFIG;

// Validate configuration to ensure no missing values break the site
function validateConfig() {
    const warnings = [];

    if (!config.valentineName) {
        warnings.push("Valentine's name is not set! Using default.");
        config.valentineName = "mi Amor";
    }

    const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    Object.entries(config.colors).forEach(([key, value]) => {
        if (!isValidHex(value)) {
            warnings.push(`Invalid color for ${key}! Using default.`);
            config.colors[key] = getDefaultColor(key);
        }
    });

    if (parseFloat(config.animations.floatDuration) < 5) {
        config.animations.floatDuration = "5s";
    }
    
    if (config.animations.heartExplosionSize < 1 || config.animations.heartExplosionSize > 3) {
        warnings.push("Heart explosion size should be between 1 and 3! Using default.");
        config.animations.heartExplosionSize = 1.5;
    }

    if (warnings.length > 0) {
        console.warn("⚠️ Configuration Warnings:", warnings);
    }
}

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

document.title = config.pageTitle;

// --- Main Initialization ---
window.addEventListener('DOMContentLoaded', () => {
    validateConfig();

    // Set Main Title
    document.getElementById('valentineTitle').textContent = `Mi Amor ${config.valentineName}`;
    
    // --- Question 1 Setup ---
    const question1Text = document.getElementById('question1Text');
    question1Text.textContent = config.questions.first.text;

    const yesBtn1 = document.getElementById('yesBtn1');
    yesBtn1.textContent = config.questions.first.yesBtn1;
    yesBtn1.onclick = () => showNextQuestion(2); 
    
    // --- Question 2 Setup ---
    const question2Text = document.getElementById('question2Text');
    question2Text.textContent = config.questions.second.text;

    const yesBtn2 = document.getElementById('yesBtn2');
    yesBtn2.textContent = config.questions.second.yesBtn2; 
    yesBtn2.onclick = celebrate; 

    const noBtn2 = document.getElementById('noBtn2');
    noBtn2.textContent = config.questions.second.noBtn2;
    makeButtonRunAway(noBtn2);

    // Start background elements
    createFloatingElements();
});

// --- UI Functions ---

function showNextQuestion(questionNumber) {
    // Hide all sections first to prevent overlap
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    
    // Show the requested section
    const nextQ = document.getElementById(`question${questionNumber}`);
    if (nextQ) {
        nextQ.classList.remove('hidden');
    }
}

function makeButtonRunAway(button) {
    if (!button) return;

    document.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const btnX = rect.left + rect.width / 2;
        const btnY = rect.top + rect.height / 2;

        const dx = e.clientX - btnX;
        const dy = e.clientY - btnY;
        const distance = Math.sqrt(dx*dx + dy*dy);

        if (distance < 150) { 
            let moveX = -dx * 0.8;
            let moveY = -dy * 0.8;

            let newLeft = rect.left + moveX;
            let newTop = rect.top + moveY;

            newLeft = Math.max(0, Math.min(window.innerWidth - rect.width, newLeft));
            newTop = Math.max(0, Math.min(window.innerHeight - rect.height, newTop));

            button.style.position = 'fixed';
            button.style.left = `${newLeft}px`;
            button.style.top = `${newTop}px`;
            button.style.zIndex = '1000';
        }
    });
}

// --- Animation & Celebration ---

function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    if (!container) return;
    container.innerHTML = '';

    config.floatingEmojis.hearts.forEach(heart => {
        const div = document.createElement('div');
        div.className = 'floating-heart';
        div.textContent = heart;
        setRandomPosition(div);
        container.appendChild(div);
    });
}

function setRandomPosition(element) {
    element.style.position = 'absolute';
    element.style.left = Math.random() * 100 + 'vw';
    element.style.top = Math.random() * 100 + 'vh';
    const duration = 5 + Math.random() * 10;
    element.style.animation = `floatUp ${duration}s linear infinite`;
    element.style.pointerEvents = 'none';
}

function celebrate() {    
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    const celebration = document.getElementById('celebration');
    celebration.classList.remove('hidden');
    
     // Set celebration messages
    document.getElementById('celebrationTitle').textContent = config.celebration.title;
    document.getElementById('celebrationMessage').textContent = config.celebration.message;
    document.getElementById('celebrationEmojis').textContent = config.celebration.emojis;
    
    createHeartExplosion();
}

function createHeartExplosion() {
    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        const randomHeart = config.floatingEmojis.hearts[Math.floor(Math.random() * config.floatingEmojis.hearts.length)];
        heart.innerHTML = randomHeart;
        heart.className = 'floating-heart'; // Reusing class for consistency
        document.querySelector('.floating-elements').appendChild(heart);
        setRandomPosition(heart);
    }
}
