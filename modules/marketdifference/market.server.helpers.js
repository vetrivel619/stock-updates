import CompanySchema from "../../models/company.model.js";
import axios from "axios";
import * as cheerio from "cheerio";


// function for previous market data, which is saved in db
export async function getPreviousMarketData() {
  const allDocuments = await CompanySchema.find();
  const resultArray = allDocuments.map((doc) => ({
    [doc.symbol]: doc.marketCap,
  }));
  console.log("fetched db data")
  return resultArray;
}

// function for scraping data from screener website with symbol
export async function getCurrentMarketData(symbols, delay) {
  const results = [];
  let count = 0
  let slicedSymbols = symbols.slice(0,10)
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
    return { [symbol] :  marketCap };
  } catch (error) {
    // Handle error appropriately, e.g., log or return a default value
    console.error(`Error fetching data for ${symbol}:`, error);
    return { symbol, marketCap: null };
  }
}
