import mongoose from 'mongoose';

const icoSchema = new mongoose.Schema({
    name: String,
    category: String,
    description: String,
    start: String,
    end: String,
    platform: String,
    goal: String,
    interest: String,
    kyc: String,
    whitelist: String,
    cant_participate: String,
    bounty: String,
    iconUrl: String,
    lastUpdated: Date,
    status: String,
  });
  

const ICO = mongoose.models.ICO || mongoose.model('ICO', icoSchema);

export default ICO;
