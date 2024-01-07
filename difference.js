import CompanySchema from "./models/company.model.js";
import { getMarketCaps } from "./scrape.js";
import { symbols } from "./data/bse.js";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function getStockDifference() {
    let tops = [];
    let bottoms = []
    let fiveThousands = []
    for (let i = 0; i < symbols.length; i++) {
        console.log(i)
        try {
            let currentMarketCap = await getMarketCaps(symbols[i]);
            let previousMarketdata = await CompanySchema.findOne({ symbol: symbols[i] }).exec();
            let percentageChange;
            if (currentMarketCap && previousMarketdata && previousMarketdata.marketCap) {
                percentageChange = ((currentMarketCap - previousMarketdata.marketCap ) / previousMarketdata.marketCap) * 100
                // console.log(JSON.stringify({ name : symbols[i], change: percentageChange }))
                if (previousMarketdata > 5000 && percentageChange > 5){
                    fiveThousands.push({ name : symbols[i], change: percentageChange })
                    console.log(`Pushed ${JSON.stringify({ name : symbols[i], change: percentageChange })}`)
                }
                if (percentageChange > 5){
                    tops.push({ name : symbols[i], change: percentageChange });
                    console.log(`Pushed ${JSON.stringify({ name : symbols[i], change: percentageChange })}`)
                }
                if (percentageChange < -5){
                    bottoms.push({ name : symbols[i], change: percentageChange });
                    console.log(`Pushed ${JSON.stringify({ name : symbols[i], change: percentageChange })}`)

                }
    
            }
        } catch (error) {
            console.error(`Error processing symbol ${symbols[i]}:`, error);
        }

        // Introduce a delay between requests (e.g., 1 second)
        await delay(1000);
    }
    tops.sort((a, b) => b.change - a.change);
    fiveThousands.sort((a, b) => b.change - a.change);
    bottoms.sort((a, b) => a.change - b.change);
    return JSON.stringify({ Tops: tops,  Bottoms: bottoms, MarkrtCapAbovefive: fiveThousands});
}
