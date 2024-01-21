import { getMarketCapDifference } from "./market.server.controller.js";

export async function generateMessage(total = 1928) {
    const [topsResult, bottomsResult] = await getMarketCapDifference(total);
   
    const currentDateAndTime = new Date();
    const formattedDateAndTime = currentDateAndTime.toLocaleString();
  
    let message = `Initiated on : ${formattedDateAndTime}:\n`;
  
    message += "\nTops:\n";
    message += "\n";
    topsResult.forEach((item) => {
      const symbol = Object.keys(item)[0];
      const percentageChange = Object.values(item)[0].toFixed(2);
      message += `${symbol}  :  ${percentageChange}\n`;
    });
  
    message += "\nBottoms:\n";
    message += "\n";
    bottomsResult.forEach((item) => {
      const symbol = Object.keys(item)[0];
      const percentageChange = Object.values(item)[0].toFixed(2);
      message += `${symbol}  :  ${percentageChange}\n`;
    });
  
    // Return the combined message
    return message;
  }
  