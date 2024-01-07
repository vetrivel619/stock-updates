import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { generateMessage } from "./modules/marketdifference/market.msg.generate.js";
import TelegramBot from "node-telegram-bot-api";

configDotenv();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json())

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, async (msg, match) => {

  let chatId = msg.chat.id;
  
  bot.sendMessage(chatId, "Choose /getall or /fivethousand");
});

bot.onText(/\/getall/, async (msg, match) => {

  let chatId = msg.chat.id;
 
  bot.sendMessage(chatId, "Fetching Data... May take around 25 - 30 mins");
  
  const message = await generateMessage()
  bot.sendMessage(chatId, message);
  
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
