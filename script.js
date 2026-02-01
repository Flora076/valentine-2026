const config = window.VALENTINE_CONFIG;

window.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Setup: Ensure everything but Question 1 is hidden
    document.getElementById('question2').classList.add('hidden');
    document.getElementById('celebration').classList.add('hidden');

    // 2. Load Content from Config
    document.getElementById('valentineTitle').textContent = `Mi Amor ${config.valentineName || "Olek"}`;
    
    // Setup Question 1
    document.getElementById('question1Text').textContent = config.questions.first.text;
    const yesBtn1 = document.getElementById('yesBtn1');
    yesBtn1.textContent = config.questions.first.yesBtn;
    yesBtn1.onclick = () => showNextQuestion(2);

    // Setup Question 2
    document.getElementById('question2Text').textContent = config.questions.second.text;
    const yesBtn2 = document.getElementById('yesBtn2');
    const noBtn2 = document.getElementById('noBtn2');
    
    yesBtn2.textContent = config.questions.second.yesBtn;
    noBtn2.textContent = config.questions.second.noBtn;

    yesBtn2.onclick = celebrate;
    makeButtonRunAway(noBtn2);

    // 3. Start Emojis
    createFloatingElements();
});

// Switches from Q1 to Q2
function showNextQuestion(num) {
    // Hide current
    document.getElementById('question1').classList.add('hidden');
    // Show next
    const nextQ = document.getElementById(`question${num}`);
    if (nextQ) nextQ.classList.remove('hidden');
}

// Logic for the Runaway button
function makeButtonRunAway(btn) {
    btn.addEventListener('mouseover', () => {
        const x = Math.random() * (window.innerWidth - btn.offsetWidth);
        const y = Math.random() * (window.innerHeight - btn.offsetHeight);
        btn.style.position = 'fixed';
        btn.style.left = x + 'px';
        btn.style.top = y + 'px';
    });
}

// Switches to Final Celebration
function celebrate() {
    document.getElementById('question2').classList.add('hidden');
    const celSection = document.getElementById('celebration');
    celSection.classList.remove('hidden');

    document.getElementById('celebrationTitle').textContent = config.celebration.title;
    document.getElementById('celebrationMessage').textContent = config.celebration.message;
}

// Emoji Animation Logic
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    const hearts = config.floatingEmojis.hearts || ['💚', '🌿'];
    
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        
        const duration = 5 + Math.random() * 10;
        const delay = Math.random() * 5;
        
        heart.style.animation = `floatUp ${duration}s linear ${delay}s infinite`;
        container.appendChild(heart);
    }
}
