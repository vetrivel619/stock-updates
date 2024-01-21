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
  
  const [topsMessage, bottomsMessage] = await generateMessage()
  bot.sendMessage(chatId, topsMessage);
  bot.sendMessage(chatId, bottomsMessage);
  
});
bot.onText(/\/custom/, async (msg, match) => {

  let chatId = msg.chat.id;
  let numberOfCompanies;
  bot.sendMessage(chatId, "enter the no.of companies");
  bot.on('text', async (msg) => {
    // Check if the message is from the same chat
    
    if (msg.chat.id === chatId) {
       numberOfCompanies = parseInt(msg.text);

      if (!isNaN(numberOfCompanies)) {
        // Process the user's input (e.g., generate a message based on the input)
        bot.sendMessage(chatId, `you entered ${numberOfCompanies} Wait for ${parseInt(numberOfCompanies)} seconds`);
        const [topsMessage,bottomsMessage] = await generateMessage(numberOfCompanies)
        bot.sendMessage(chatId, topsMessage);
        bot.sendMessage(chatId, bottomsMessage);

      } else {
        bot.sendMessage(chatId, "Please enter a valid number.");
      }

      // Remove the listener to avoid processing future messages
        bot.removeTextListener();
    }
  });
 
  
});

cron.schedule('30 16 * * * ', async () => {
  console.log('Updating Market Cap atabase at 7:30 PM');
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
