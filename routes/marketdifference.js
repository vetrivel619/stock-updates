import { Router } from "express";
import {getMarketCapDifference} from '../controllers/marketdifference.js'

const router = Router()

router.get('/api/getmarketCapDifference', getMarketCapDifference)


export default router