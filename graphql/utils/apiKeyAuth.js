import ApiKey from "../models/apiKey.js";
import apiKeyResolver from "../resolvers/apiKeyResolver.js";

const authenticate = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        console.log("API key is missing");
        console.log("req.headers", req.headers)
        return res.status(401).json({ message: 'API key is missing' });
    }

    const keyExists = await ApiKey.findOne({ key: apiKey });
    if (!keyExists) {
        return res.status(403).json({ message: 'Invalid API key' });
    }
    
    next();
};

const hasHighestAccessLevel = async (req, res, next)  => {

    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ message: 'API key is missing' });
    }

    const keyExists = await ApiKey.findOne({ key: apiKey });
    if (!keyExists) {
        return res.status(403).json({ message: 'Invalid API key' });
    }

    if(keyExists.accessLevel != 0){
        res.status(403).json({ error: 'Forbidden' });
    }

    next();
}



export default {authenticate, hasHighestAccessLevel};