import { symbols } from "./data/bse.js";
import CompanySchema from "./models/company.model.js";
import * as cheerio from "cheerio";

import axios from "axios"
export async function updateMarketCap(){

    console.log("updating")
    let updatedData = await getCurrentMarketData(symbols, 1000)

    console.log(updatedData)
  for (const update of updatedData) {
    const filter = { symbol: update.symbol };
    const updateOperation = { $set: { marketCap: update.marketCap } };

    try {
      const result = await CompanySchema.updateOne(filter, updateOperation);
    } catch (error) {
      console.error(`Error updating document for symbol: ${update.symbol}`, error);
    }
  }
}


async function scrapeData(symbol) {
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
async function getCurrentMarketData(symbols, delay) {
    const results = [];
    let count = 0
    let slicedSymbols = symbols.slice(0,2)
    // Loop through symbols with a delay between requests
    for (const symbol of symbols) {
      const data = await scrapeData(symbol);
      results.push(data);
      count++
      // Introduce a delay between requests
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  
    return results;
  }
  