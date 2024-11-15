const tg = window.Telegram.WebApp;

// 게임 상태
let state = {
    score: 0,
    points: 0,
    weapon: 'basic',
    purchasedWeapons: ['basic']
};

const weapons = {
    basic: { damage: 1, cost: 0, name: '기본 주먹', color: '#FFD700' },
    bat: { damage: 2, cost: 50, name: '야구 방망이', color: '#4169E1' },
    hammer: { damage: 5, cost: 100, name: '망치', color: '#DC143C' }
};

// 게임 초기화
function initGame() {
    tg.ready();
    tg.expand();
    
    renderGame();
    updateScore();
}

// 화면 렌더링
function renderGame() {
    const gameContainer = document.getElementById('game');
    gameContainer.innerHTML = `
        <div class="text-2xl mb-4 flex justify-between items-center">
            <div>점수: <span id="score">0</span></div>
            <div>포인트: <span id="points">0</span></div>
        </div>
        
        <div class="mb-4 flex gap-2 flex-wrap" id="weapons">
            ${Object.entries(weapons).map(([type, data]) => `
                <button
                    onclick="buyWeapon('${type}')"
                    class="p-2 rounded ${getWeaponButtonClass(type)}"
                    ${!canBuyWeapon(type) ? 'disabled' : ''}
                >
                    ${data.name} (${data.damage} 데미지)
                    ${!state.purchasedWeapons.includes(type) && data.cost > 0 ? ` - ${data.cost} 포인트` : ''}
                    ${state.purchasedWeapons.includes(type) ? ' (보유)' : ''}
                </button>
            `).join('')}
        </div>

        <div class="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300 flex items-center justify-center mb-4">
            <div id="alien" onclick="hitAlien()" class="cursor-pointer">
                <svg viewBox="0 0 24 24" class="w-32 h-32" fill="${weapons[state.weapon].color}">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c3.87 0 7 3.13 7 7s-3.13 7-7 7-7-3.13-7-7 3.13-7 7-7zm-3 5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm6 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm-3 5c1.66 0 3-.34 3-1.5s-1.34-1.5-3-1.5-3 .34-3 1.5 1.34 1.5 3 1.5z"/>
                </svg>
            </div>
        </div>

        <button 
            onclick="saveScore()"
            class="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
            점수 저장하기
        </button>
    `;
}

// 외계인 때리기
function hitAlien() {
    const alien = document.getElementById('alien');
    const damage = weapons[state.weapon].damage;
    
    // 점수 업데이트
    state.score += damage;
    state.points += damage;
    
    // 효과 표시
    alien.classList.add('animate-bounce');
    alien.style.transform = 'scale(0.95)';
    
    // 리액션 표시
    showReaction();
    
    // 효과 제거
    setTimeout(() => {
        alien.classList.remove('animate-bounce');
        alien.style.transform = 'scale(1)';
    }, 1000);
    
    updateScore();
}

// 리액션 표시
function showReaction() {
    const reactions = ["아야!!", "으악!", "痛い!", "好痛!", "Ouch!"];
    const reaction = reactions[Math.floor(Math.random() * reactions.length)];
    
    const reactionEl = document.createElement('div');
    reactionEl.textContent = reaction;
    reactionEl.className = 'absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 text-xl font-bold';
    
    document.getElementById('alien').appendChild(reactionEl);
    setTimeout(() => reactionEl.remove(), 1000);
}

// 무기 구매
function buyWeapon(weaponType) {
    if (canBuyWeapon(weaponType)) {
        if (!state.purchasedWeapons.includes(weaponType)) {
            state.points -= weapons[weaponType].cost;
            state.purchasedWeapons.push(weaponType);
        }
        state.weapon = weaponType;
        renderGame();
        updateScore();
    }
}

// 무기 구매 가능 여부 확인
function canBuyWeapon(weaponType) {
    return state.purchasedWeapons.includes(weaponType) || 
           state.points >= weapons[weaponType].cost;
}

// 무기 버튼 클래스 가져오기
function getWeaponButtonClass(type) {
    if (state.weapon === type) return 'bg-blue-500 text-white';
    if (state.purchasedWeapons.includes(type)) return 'bg-green-200 hover:bg-green-300';
    if (state.points < weapons[type].cost) return 'bg-gray-300';
    return 'bg-blue-200 hover:bg-blue-300';
}

// 점수 업데이트
function updateScore() {
    document.getElementById('score').textContent = state.score;
    document.getElementById('points').textContent = state.points;
}

// 점수 저장
function saveScore() {
    tg.sendData(JSON.stringify({
        score: state.score,
        weapon: weapons[state.weapon].name
    }));
    tg.showAlert('점수가 저장되었습니다!');
}

// 게임 시작
initGame();