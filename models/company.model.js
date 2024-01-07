import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
  },
  marketCap: {
    type: Number,
    default: null,
  },
});

 const CompanySchema = mongoose.model('company', companySchema);

 export default CompanySchema