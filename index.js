const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Function to fetch quotes based on mood from Quotable API
async function fetchQuote(mood) {
  try {
    // Map moods to appropriate tags for the API
    const moodTags = {
      happy: 'happiness',
      sad: 'life',
      motivated: 'motivational',
      angry: 'wisdom',
      calm: 'calm',
      anxious: 'fear',
      excited: 'inspirational',
      tired: 'life',
      grateful: 'gratitude',
      lonely: 'solitude',
      hopeful: 'hope',
      confused: 'wisdom',
      stressed: 'calm',
      joyful: 'happiness',
      reflective: 'philosophy',
      bored: 'creativity',
      peaceful: 'calm',
      inspired: 'inspirational',
      determined: 'motivational',
      nostalgic: 'life', // reflecting on memories
      hurt: 'healing',
      relaxed: 'calm',
      energetic: 'inspirational',
      gloomy: 'life',
      frustrated: 'wisdom', // wisdom to soothe frustration
      confident: 'motivational',
      curious: 'knowledge', // quotes that spark curiosity
      romantic: 'love', // quotes about love and romance
      adventurous: 'courage', // quotes that encourage taking chances
      overwhelmed: 'calm', // calming quotes to ease the feeling
    };

    // Fetch quote using the tag corresponding to the mood
    const response = await axios.get(
      `https://api.quotable.io/random?tags=${moodTags[mood] || 'inspirational'}`
    );
    const quoteData = response.data;
    return `${quoteData.content} - ${quoteData.author}`;
  } catch (error) {
    return "Sorry, couldn't fetch a quote for that mood.";
  }
}

// Listener for new chat members (Welcome Message)
bot.on('new_chat_members', (msg) => {
  const chatId = msg.chat.id;
  const newMembers = msg.new_chat_members.map((user) => user.first_name).join(', ');

  // Send welcome message
  bot.sendMessage(
    chatId,
    `Welcome, ${newMembers}! 🎉\nI'm here to share quotes that match your mood. Just tell me how you feel!`
  );
});

// Listener for mood-based quotes
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const mood = msg.text.trim().toLowerCase();

  // Fetch a quote based on the mood
  const quote = await fetchQuote(mood);
  bot.sendMessage(chatId, quote);
});

console.log("Mood Quote Bot is running...");
