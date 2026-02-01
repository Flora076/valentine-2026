const config = window.VALENTINE_CONFIG;

window.addEventListener('DOMContentLoaded', () => {
    // 1. Initial State: Ensure Question 2 and Celebration are hidden on load
    document.getElementById('question2').classList.add('hidden');
    document.getElementById('celebration').classList.add('hidden');
    
    // 2. Set Page Title & Main Header
    document.getElementById('valentineTitle').textContent = `Mi Amor ${config.valentineName || "Amor"}`;
    
    // --- Setup Question 1 ---
    const q1Text = document.getElementById('question1Text');
    const y1 = document.getElementById('yesBtn1');
    
    // Use || "text" as a backup so buttons are never empty/invisible
    q1Text.textContent = config.questions.first.text || "Will you be my Valentine?";
    y1.textContent = config.questions.first.yesBtn || "Yes";
    y1.onclick = () => showNextQuestion(2);

    // --- Setup Question 2 ---
    const q2Text = document.getElementById('question2Text');
    const y2 = document.getElementById('yesBtn2');
    const n2 = document.getElementById('noBtn2');
    
    q2Text.textContent = config.questions.second.text || "Are you sure?";
    y2.textContent = config.questions.second.yesBtn || "Yes!";
    n2.textContent = config.questions.second.noBtn || "No";

    y2.onclick = celebrate;
    makeButtonRunAway(n2);

    // 3. Initialize Animations
    createFloatingElements();
});

// Logic to switch between questions
function showNextQuestion(num) {
    // Hide Question 1
    document.getElementById('question1').classList.add('hidden');
    
    // Show Question 2
    const nextQ = document.getElementById(`question${num}`);
    if (nextQ) {
        nextQ.classList.remove('hidden');
        nextQ.style.display = 'block'; // Force visibility
    }
}

// Logic for the Runaway No Button
function makeButtonRunAway(btn) {
    if (!btn) return;
    
    // Triggers when mouse touches the button area
    btn.addEventListener('mouseover', () => {
        // Calculate random position within screen bounds
        const x = Math.random() * (window.innerWidth - btn.offsetWidth);
        const y = Math.random() * (window.innerHeight - btn.offsetHeight);
        
        btn.style.position = 'fixed';
        btn.style.left = x + 'px';
        btn.style.top = y + 'px';
        btn.style.zIndex = '1000'; // Keep it above hearts
    });
}

// Background Emojis Logic
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    if (!container) return;

    const hearts = config.floatingEmojis.hearts || ['💚', '🌿', '🍀'];
    
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        // Randomize start horizontal position
        heart.style.left = Math.random() * 100 + 'vw';
        
        // Randomize animation speed and delay
        const duration = 5 + Math.random() * 10;
        const delay = Math.random() * 5;
        
        // Apply the floatUp animation from your CSS
        heart.style.animation = `floatUp ${duration}s linear ${delay}s infinite`;
        heart.style.position = 'absolute';
        
        container.appendChild(heart);
    }
}

// Final Celebration Logic
function celebrate() {
    // Hide the question area
    document.getElementById('question2').classList.add('hidden');
    
    // Show the celebration area
    const cel = document.getElementById('celebration');
    cel.classList.remove('hidden');
    cel.style.display = 'block';
    
    // Set final messages
    document.getElementById('celebrationTitle').textContent = config.celebration.title || "Yay!";
    document.getElementById('celebrationMessage').textContent = config.celebration.message || "I love you!";
    
    // Optional: Update emoji string if you have a container for it
    const emojiDisplay = document.getElementById('celebrationEmojis');
    if (emojiDisplay) {
        emojiDisplay.textContent = config.celebration.emojis || "💚💚💚";
    }
}
