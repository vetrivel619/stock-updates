import { scrapeData } from "./cron.controller.js";




let symbol = "IRFC"


async function printData(){
    let data = await scrapeData(symbol)
    console.log(data)
}

printData()