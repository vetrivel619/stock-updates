import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { getMarketCapDifference } from "./modules/marketdifference/market.server.controller.js";

configDotenv();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json())

// app.post('*', async (req, res)=>{
//   console.log(req.body)
//   res.send("app post")
// })

// app.get('*',async (req, res) =>{
//   res.send('server is started')
// })

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is listening in ${PORT}`);
    });
    getMarketCapDifference()
  })
  .catch((error) => {
    console.log(error);
  });
