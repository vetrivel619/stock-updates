import { getMarketCapDifference } from "./market.server.controller.js";

export async function generateMessages(total = 1928) {
  const [topsResult, bottomsResult] = await getMarketCapDifference(total);

  // Adjust the current date and time to IST
  const currentDateAndTime = new Date();
  const utcOffset = 5.5 * 60 * 60 * 1000; // Convert 5 hours and 30 minutes to milliseconds
  const istDateAndTime = new Date(currentDateAndTime.getTime() + utcOffset);
  const formattedDateAndTime = istDateAndTime.toLocaleString();

  // Generate Tops message
  let topsMessage = `Tops - Initiated on : ${formattedDateAndTime}:\n\n`;
  topsResult.forEach((item) => {
    const symbol = Object.keys(item)[0];
    const percentageChange = Object.values(item)[0].toFixed(2);
    topsMessage += `${symbol}  :  ${percentageChange}\n`;
  });

  // Generate Bottoms message
  let bottomsMessage = `Bottoms - Initiated on : ${formattedDateAndTime}:\n\n`;
  bottomsResult.forEach((item) => {
    const symbol = Object.keys(item)[0];
    const percentageChange = Object.values(item)[0].toFixed(2);
    bottomsMessage += `${symbol}  :  ${percentageChange}\n`;
  });

  // Return an array containing both messages
  return [topsMessage, bottomsMessage];
}
