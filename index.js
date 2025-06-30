const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');

// 🔐 BOT TOKEN va KANAL USERNAME
const bot = new Telegraf('8000226948:AAFHaaJMazrMgdDoQbXZukWGHUntYfFrUac');
const CHANNEL_USERNAME = '@Fastmoneyuz_tg';

// 🎬 Kodlar orqali yuboriladigan kinolar
const movieData = {
  "123": {
    title: "Avengers: Endgame",
    description: "Super qahramonlar tarafidan dunyoni qutqarish uchun so‘nggi jang.",
    videoPath: "./video/video1.MP4" // 🎥 Mahalliy vide
  },
  "456": {
    title: "Inception",
    description: "Orzular ichida orzular sarguzashti.",
    link: "https://t.me/Fastmoneyuz_tg/456" // 🔗 Link orqali
  }
};

// 🟢 /start komandasi
bot.start(async (ctx) => {
  const userId = ctx.from.id;

  try {
    const member = await ctx.telegram.getChatMember(CHANNEL_USERNAME, userId);
    if (['left', 'kicked'].includes(member.status)) throw new Error();

    return ctx.reply('🎬 Kodni yuboring (masalan: 123)');
  } catch (err) {
    return ctx.reply(
      '❗ Botdan foydalanish uchun kanalga obuna bo‘ling:',
      Markup.inlineKeyboard([
        [Markup.button.url('📢 Obuna bo‘lish', `https://t.me/${CHANNEL_USERNAME.replace('@', '')}`)],
        [Markup.button.callback('✅ Obunani tekshirish', 'check')]
      ])
    );
  }
});

// 🔁 Tekshirish tugmasi
bot.action('check', async (ctx) => {
  const userId = ctx.from.id;

  try {
    const member = await ctx.telegram.getChatMember(CHANNEL_USERNAME, userId);
    if (['left', 'kicked'].includes(member.status)) throw new Error();

    return ctx.editMessageText('✅ Obuna tasdiqlandi. Endi kod yuboring (masalan: 123)');
  } catch (err) {
    return ctx.answerCbQuery('🚫 Siz hali ham obuna bo‘lmagansiz!', { show_alert: true });
  }
});

// 🔢 Kod qabul qilish
bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const code = ctx.message.text.trim();

  // Obuna tekshirish
  try {
    const member = await ctx.telegram.getChatMember(CHANNEL_USERNAME, userId);
    if (['left', 'kicked'].includes(member.status)) {
      return ctx.reply(
        '❗ Botdan foydalanish uchun kanalga obuna bo‘ling:',
        Markup.inlineKeyboard([
          [Markup.button.url('📢 Obuna bo‘lish', `https://t.me/${CHANNEL_USERNAME.replace('@', '')}`)],
          [Markup.button.callback('✅ Obunani tekshirish', 'check')]
        ])
      );
    }
  } catch (err) {
    return ctx.reply('⚠️ Obuna tekshirilayotganda xatolik yuz berdi. Keyinroq urinib ko‘ring.');
  }

  // Kino yuborish
  const movie = movieData[code];
  if (movie) {
    await ctx.replyWithHTML(
      `🎬 <b>${movie.title}</b>\n\n📝 ${movie.description}`
    );

    if (movie.videoPath && fs.existsSync(movie.videoPath)) {
      return ctx.replyWithVideo({ source: movie.videoPath });
    } else if (movie.link) {
      return ctx.replyWithHTML(
        `▶️ <a href="${movie.link}">Ko‘rish</a>`,
        { disable_web_page_preview: true }
      );
    } else {
      return ctx.reply('❗ Video yo‘q yoki link mavjud emas.');
    }

  } else {
    return ctx.reply('❌ Bunday kod bo‘yicha kino topilmadi.');
  }
});

// 🚀 Botni ishga tushirish
bot.launch();
console.log("✅ Bot ishga tushdi...");
