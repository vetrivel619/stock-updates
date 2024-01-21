import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { generateMessage } from "./modules/marketdifference/market.msg.generate.js";
import TelegramBot from "node-telegram-bot-api";
import cron from 'node-cron'
import { updateMarketCap } from "./cron.controller.js";
configDotenv();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json())

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });


bot.onText(/\/start/, async (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Type /getall or /custom");
});

bot.onText(/\/getall/, async (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Fetching Data... May take around 25 - 30 mins");
  
  const [topsMessage, bottomsMessage] = await generateMessage()
  bot.sendMessage(chatId, topsMessage);
  bot.sendMessage(chatId, bottomsMessage);
});

const chatStates = {};

bot.onText(/\/custom/, (msg) => {
  const chatId = msg.chat.id;
  chatStates[chatId] = { state: 'waitingForNumberOfCompanies' };
  bot.sendMessage(chatId, "Enter the number of companies");
});

bot.on('text', async (msg) => {
  const chatId = msg.chat.id;
  const state = chatStates[chatId];

  if (!state || state.state !== 'waitingForNumberOfCompanies') {
    return;
  }

  const numberOfCompanies = parseInt(msg.text);

  if (!isNaN(numberOfCompanies)) {
    bot.sendMessage(chatId, `You entered ${numberOfCompanies}. Wait for ${numberOfCompanies} seconds`);
    const [topsMessage, bottomsMessage] = await generateMessage(numberOfCompanies);
    bot.sendMessage(chatId, topsMessage);
    bot.sendMessage(chatId, bottomsMessage);
    delete chatStates[chatId]; // Reset state after processing
  } else {
    bot.sendMessage(chatId, "Please enter a valid number.");
  }
});

cron.schedule('30 16 * * * ', async () => {
  console.log('Updating Market Cap database at 7:30 PM');
  await updateMarketCap();
});


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is listening in ${PORT}`);
      
    });
  })
  .catch((error) => {
    console.log(error);
  });
