// onesignalClient.js
import OneSignal from 'onesignal-node';
import dotenv from 'dotenv';

dotenv.config();

// Create a new OneSignal client instance
const client = new OneSignal.Client({
    app: { 
        appId: process.env.ONESIGNAL_APP_ID,
        apiKey: process.env.ONESIGNAL_API_KEY,
    }
});

export default client;
