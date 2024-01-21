import { getCurrentMarketData, getPreviousMarketData } from "./market.server.helpers.js";
import { symbols } from "../../data/bse.js";



export async function getMarketCapDifference(total = 1928){
    console.log(total)
    let previousData = await getPreviousMarketData(total)
    let currentData = await getCurrentMarketData(total, 1000)

    const map1 = new Map(previousData.map(obj => [Object.keys(obj)[0], Object.values(obj)[0]]));
    const map2 = new Map(currentData.map(obj => [Object.keys(obj)[0], Object.values(obj)[0]]));

    // Initialize an array to store the result
    const result = [];
    console.log(map1)
    console.log(map2)
    // Iterate through each company name in the predefined array
    let slicedSymbols = symbols.slice(0,total)
    for (const symbol of map1.keys()) {
        const value1 = map1.get(symbol) || 0; // Default to 0 if not present in map1
        const value2 = map2.get(symbol) || 0; // Default to 0 if not present in map2

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
      const tops = sortedData.filter(item => Object.values(item)[0] >= 0);
      const topsResult = tops.length > 0 ? tops : [];
      
      // Extracting the bottoms array
      const bottoms = sortedData.filter(item => Object.values(item)[0] < 0);
      const bottomsResult = bottoms.length > 0 ? bottoms : [];
      
      console.log("Tops array:", topsResult);
      console.log("Bottoms array:", bottomsResult);

      return [topsResult, bottomsResult]

}