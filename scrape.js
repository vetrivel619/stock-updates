import axios from "axios";
import * as cheerio from "cheerio";

import { symbols } from "./data/bse.js";
import CompanySchema from "./models/company.model.js";
export async function getMarketCaps (symbol) {

  let url = `https://www.screener.in/company/${symbol}/consolidated/`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Select the first child element within ".top-ratios"
    const topRatioFirstChild = $("#top-ratios").children().first();

    // Select the second <span> inside the first child
    const spans = topRatioFirstChild.find("span").text();

    // Extract the text content of the second <span>
    let array = spans.split("\n");
    // Log the text content
    let marketCapString = array[8]
      .trim()
      .split("")
      .filter((letter) => {
        return letter !== ",";
      })
      .join("");
    return isNaN(marketCapString) ? null : parseInt(marketCapString);

    // If you want to store the data in an array or object, modify accordingly
  } catch (error) {
    //   console.error("Error fetching the page:", error);
    return null;
  }
};

// Call the function
async function updateOrCreateDocument(symbol, totalMarketCap) {
  try {
    const filter = { symbol: symbol };
    const update = { $set: { marketCap: totalMarketCap } };
    const options = { upsert: true, new: true }; // Set upsert to true

    const result = await CompanySchema.updateOne(filter, update, options);

    console.log(`Updated document for symbol ${symbol}:`, result);
  } catch (error) {
    console.error(
      `Error updating or creating document for symbol ${symbol}:`,
      error
    );
  }
}
export function updateStockData() {
  for (let i = 0; i < symbols.length; i++) {
    let validatedSymbol = symbols[i].trim();
    setTimeout(async () => {
      let totalMarketCap = await getMarketCaps(validatedSymbol);
      console.log(totalMarketCap);
      // create documrnt if not exsist or update
      let updateData = await updateOrCreateDocument(
        validatedSymbol,
        totalMarketCap
      );
    }, i * 1000);
  }
}
