require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
const path = require('path');

const app = express();
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// ngrok URL
const WEBAPP_URL = 'https://3970-2001-e60-8464-6144-79c7-8018-70c3-4233.ngrok-free.app';

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 봇 커맨드 처리
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '외계인 때리기 게임에 오신 것을 환영합니다!', {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: '게임 시작하기',
                    web_app: { url: WEBAPP_URL }
                }
            ]]
        }
    });
});

// 게임 데이터 처리
bot.on('web_app_data', (msg) => {
    try {
        const data = JSON.parse(msg.web_app_data.data);
        bot.sendMessage(msg.chat.id, 
            `게임 결과!\n점수: ${data.score}\n사용 무기: ${data.weapon}`);
    } catch (error) {
        console.error('데이터 처리 오류:', error);
        bot.sendMessage(msg.chat.id, '점수 처리 중 오류가 발생했습니다.');
    }
});

// 메인 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebApp URL: ${WEBAPP_URL}`);
});