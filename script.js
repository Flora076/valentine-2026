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

    const taunts = [
        "Nope! 😏",
        "Too slow! 🐢",
        "Can't touch this 💃",
        "Not today! ✨",
        "Try again 😘",
        "Almost had me! 🪺",
    ];

    let tauntIndex = 0;
    let isRunning = false;

    function teleportAway(cursorX, cursorY) {
        const bw = button.offsetWidth;
        const bh = button.offsetHeight;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const margin = 40;

        // Pick a random position that's far from the cursor
        let newLeft, newTop;
        let attempts = 0;
        do {
            newLeft = margin + Math.random() * (vw - bw - margin * 2);
            newTop = margin + Math.random() * (vh - bh - margin * 2);
            attempts++;
        } while (
            Math.hypot(cursorX - newLeft, cursorY - newTop) < 250 &&
            attempts < 20
        );

        button.style.position = 'fixed';
        button.style.zIndex = '1000';
        button.style.transition = 'none';
        button.style.left = `${newLeft}px`;
        button.style.top = `${newTop}px`;

        // Little pop-in animation
        button.style.transform = 'scale(0)';
        requestAnimationFrame(() => {
            button.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
            button.style.transform = 'scale(1)';
        });

        // Occasionally swap the button text to a taunt, then swap back
        if (Math.random() < 0.4) {
            const original = button.textContent;
            button.textContent = taunts[tauntIndex % taunts.length];
            tauntIndex++;
            setTimeout(() => { button.textContent = original; }, 700);
        }
    }

    function isNearEdge(rect) {
        const edgeMargin = 80;
        return (
            rect.left < edgeMargin ||
            rect.top < edgeMargin ||
            rect.right > window.innerWidth - edgeMargin ||
            rect.bottom > window.innerHeight - edgeMargin
        );
    }

    document.addEventListener('mousemove', (e) => {
        if (isRunning) return;

        const rect = button.getBoundingClientRect();
        const btnX = rect.left + rect.width / 2;
        const btnY = rect.top + rect.height / 2;

        const dx = e.clientX - btnX;
        const dy = e.clientY - btnY;
        const distance = Math.hypot(dx, dy);

        if (distance < 160) {
            // If button is near any edge, teleport to avoid getting cornered
            if (isNearEdge(rect)) {
                isRunning = true;
                teleportAway(e.clientX, e.clientY);
                setTimeout(() => { isRunning = false; }, 250);
                return;
            }

            // Normal flee: move away from cursor
            let moveX = -dx * 1.2;
            let moveY = -dy * 1.2;

            // Add some random perpendicular jitter so movement isn't predictable
            const perp = (Math.random() - 0.5) * 120;
            const len = Math.hypot(moveX, moveY) || 1;
            moveX += (-dy / len) * perp;
            moveY += (dx / len) * perp;

            let newLeft = rect.left + moveX;
            let newTop = rect.top + moveY;

            // Clamp to viewport
            newLeft = Math.max(20, Math.min(window.innerWidth - rect.width - 20, newLeft));
            newTop = Math.max(20, Math.min(window.innerHeight - rect.height - 20, newTop));

            button.style.position = 'fixed';
            button.style.transition = 'left 0.15s ease-out, top 0.15s ease-out';
            button.style.left = `${newLeft}px`;
            button.style.top = `${newTop}px`;
            button.style.zIndex = '1000';
        }
    });

    // Touch support — teleport immediately on approach
    document.addEventListener('touchmove', (e) => {
        if (isRunning) return;
        const touch = e.touches[0];
        const rect = button.getBoundingClientRect();
        const btnX = rect.left + rect.width / 2;
        const btnY = rect.top + rect.height / 2;
        if (Math.hypot(touch.clientX - btnX, touch.clientY - btnY) < 120) {
            isRunning = true;
            teleportAway(touch.clientX, touch.clientY);
            setTimeout(() => { isRunning = false; }, 300);
        }
    }, { passive: true });

    // "Nice try!" handler — for the clever ones who pause JS or tab-focus
    button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Float a message from the button's position
        const rect = button.getBoundingClientRect();
        const msg = document.createElement('div');
        msg.textContent = 'Nice try! 😉';
        Object.assign(msg.style, {
            position: 'fixed',
            left: `${rect.left + rect.width / 2}px`,
            top: `${rect.top}px`,
            transform: 'translate(-50%, -100%)',
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '20px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            zIndex: '9999',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
        });
        document.body.appendChild(msg);

        // Animate message floating up and fading
        msg.animate([
            { opacity: 1, transform: 'translate(-50%, -100%)' },
            { opacity: 0, transform: 'translate(-50%, -300%)' },
        ], { duration: 1500, easing: 'ease-out' });

        // Button shrinks and vanishes
        button.animate([
            { transform: 'scale(1) rotate(0deg)', opacity: 1 },
            { transform: 'scale(0) rotate(720deg)', opacity: 0 },
        ], { duration: 600, easing: 'ease-in' });

        setTimeout(() => {
            button.style.display = 'none';
            msg.remove();
        }, 1500);
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
    const container = document.querySelector('.floating-elements');
    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = config.floatingEmojis.hearts[Math.floor(Math.random() * config.floatingEmojis.hearts.length)];
        heart.className = 'floating-heart';
        
        // Start at center for explosion effect
        heart.style.position = 'fixed';
        heart.style.left = '50%';
        heart.style.top = '50%';
        container.appendChild(heart);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 150 + Math.random() * 350;
        const x = Math.cos(angle) * velocity;
        const y = Math.sin(angle) * velocity;

        heart.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${config.animations.heartExplosionSize})`, opacity: 0 }
        ], {
            duration: 1200,
            easing: 'ease-out'
        });

        setTimeout(() => heart.remove(), 1200);
    }
}
