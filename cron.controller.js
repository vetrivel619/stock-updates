import { symbols } from "./data/bse.js";
import CompanySchema from "./models/company.model.js";
import * as cheerio from "cheerio";

import axios from "axios"
export async function updateMarketCap(total = 1928) {
  console.log("updating");

  const delay = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

  for (const currentSymbol of symbols.slice(0, total)) {
      const currentMarketData = await scrapeData(currentSymbol);

      const filter = { symbol: currentSymbol };
      const updateOperation = { $set: { marketCap: currentMarketData.marketCap } };
      console.log({currentSymbol : currentMarketData})
      try {
          const result = await CompanySchema.updateOne(filter, updateOperation, { upsert: true });
          // console.log(result);
      } catch (error) {
          console.error(`Error updating/creating document for symbol: ${currentSymbol}`, currentMerket);
      }

      // Introduce a one-second delay
      await delay(1000); // 1000 milliseconds = 1 second
  }
}


export async function scrapeData(symbol) {
    const url = `https://www.screener.in/company/${symbol}/consolidated/`;
  
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
  
      const topRatioFirstChild = $("#top-ratios").children().first();
      const spans = topRatioFirstChild.find("span").text();
  
      let array = spans.split("\n");
      let marketCapString = array[8]
        .trim()
        .split("")
        .filter((letter) => letter !== ",")
        .join("");
  
      const marketCap = isNaN(marketCapString) ? null : parseInt(marketCapString);
      return { symbol ,  marketCap };
    } catch (error) {
      // Handle error appropriately, e.g., log or return a default value
      console.error(`Error fetching data for ${symbol}:`, error);
      return { symbol, marketCap: null };
    }
  }


  // function for scraping data from screener website with symbol
async function getCurrentMarketData(total, delay) {
    const results = [];
    let count = 0
    let slicedSymbols = symbols.slice(0,total)
    // Loop through symbols with a delay between requests
    for (const symbol of slicedSymbols) {
      const data = await scrapeData(symbol);
      results.push(data);
      count++
      // Introduce a delay between requests
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  
    return results;
  }
  