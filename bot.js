const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const cron = require('node-cron');

const bot = new Telegraf('telegram_token');
const channelId = '@channelId';
const adminId = '@adminId'; // Your Telegram user ID
const userDataFile = 'user_data.json';

// Initialize user data array
let userData = [];

// Load existing user data from file if it exists
if (fs.existsSync(userDataFile)) {
  const data = fs.readFileSync(userDataFile);
  userData = JSON.parse(data);
}

bot.start((ctx) => {
  ctx.reply('درود! تو میتونی اینجا هر اعترافی که میخوای بکنی و پیامت مستقیم میره توی کانال اعترافات! \n فقط ما هیچ مسئولیتی در قبال چیزی که شما مینویسید و توی کانال میره نداریم! \n یه جوری بنویس که مجبور نشیم رباتو متوقف کنیم کانالم ببندیم :)',
    Markup.inlineKeyboard([
      Markup.button.url('Join our Confessions Channel', `https://t.me/${channelId.slice(1)}`)
    ])
  );
  // Collect user data
  const user = {
    id: ctx.from.id,
    username: ctx.from.username || 'N/A',
    first_name: ctx.from.first_name || 'N/A',
    last_name: ctx.from.last_name || 'N/A',
    language_code: ctx.from.language_code || 'N/A',
    is_bot: ctx.from.is_bot,
    date: new Date().toISOString()
  };
  // Check if user already exists
  const userExists = userData.some((u) => u.id === user.id);
  if (!userExists) {
    userData.push(user);
    fs.writeFileSync(userDataFile, JSON.stringify(userData, null, 2));
  }
});

bot.on('text', (ctx) => {
  const confession = ctx.message.text;
  ctx.telegram.sendMessage(channelId, `اعتراف ی نفر:\n\n${confession}`);
  ctx.reply('اعترافت رفت توی کانال!');
});

// Schedule task to send confessions file daily at 8:00 AM
cron.schedule('0 8 * * *', () => {
  if (confessions.length > 0) {
    ctx.telegram.sendDocument(adminId, { source: confessionsFile });
  }
}, {
  scheduled: true,
  timezone: 'Europe/Berlin' // Adjust to your timezone
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
