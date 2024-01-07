import { getMarketCapDifference } from "./market.server.controller";

export async function MessageText(req, res){
    let [topsResult, bottomsResult] = await getMarketCapDifference()

    console.log(req.body)
}