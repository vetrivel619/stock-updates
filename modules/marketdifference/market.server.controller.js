import { getCurrentMarketData, getPreviousMarketData } from "./market.server.helpers.js";
import { symbols } from "../../data/bse.js";

let slicedSymbols = symbols.slice(0,10)

export async function getMarketCapDifference(){

    let previousData = await getPreviousMarketData()
    let currentData = await getCurrentMarketData(symbols, 1000)

    const map1 = new Map(previousData.map(obj => [Object.keys(obj)[0], Object.values(obj)[0]]));
    const map2 = new Map(currentData.map(obj => [Object.keys(obj)[0], Object.values(obj)[0]]));

    // Initialize an array to store the result
    const result = [];
    console.log(map2)
    // Iterate through each company name in the predefined array
    for (const symbol of symbols) {
        const value1 = map1.get(symbol) || 0; // Default to 0 if not present in array1
        const value2 = map2.get(symbol) || 0; // Default to 0 if not present in array2

        // Calculate the percentage change and push it to the result array
        const percentageChange = ((value2 - value1) / value1) * 100 || 0; // Default to 0 for cases where value1 is 0
        result.push({ [symbol]: percentageChange });
    }

    const sortedData = result.sort((a, b) => {
        const valueA = Object.values(a)[0];
        const valueB = Object.values(b)[0];
        return valueB - valueA; // Descending order
      });
      
      // Extracting the tops array
      const tops = sortedData.filter(item => Object.values(item)[0] > 7.5);
      const topsResult = tops.length > 0 ? tops : sortedData.slice(0, 15);
      
      // Extracting the bottoms array
      const bottoms = sortedData.filter(item => Object.values(item)[0] < -5);
      const bottomsResult = bottoms.length > 0 ? bottoms : sortedData.slice(0, 8).reverse();
      
      console.log("Tops array:", topsResult);
      console.log("Bottoms array:", bottomsResult);

      return [topsResult, bottomsResult]

}