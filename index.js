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

  let chatId = msg.chat.id;
  
  bot.sendMessage(chatId, "type or click /getall ");
});

bot.onText(/\/getall/, async (msg, match) => {

  let chatId = msg.chat.id;
 
  bot.sendMessage(chatId, "Fetching Data... May take around 25 - 30 mins");
  
  const message = await generateMessage()
  bot.sendMessage(chatId, message);
  
});

cron.schedule('0 22 * * *', async () => {
  console.log('Updating Market Cap atabase at 10:00 PM');
  // Perform any additional actions with the result if needed
  await updateMarketCap()
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
