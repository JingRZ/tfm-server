
import ApiKey from '../models/apiKey.js';
import crypto from 'crypto';

const apiKeyResolver = {
    Query: {
        allApiKeys: async () => {
            return ApiKey.find({});
        },
        findApiKey: async (root, args) => {
            return ApiKey.findOne({ key: args.key });
        },
    },
    Mutation: {
        createApiKey: async (root, args) => {
            const apiKey = crypto.randomBytes(16).toString('hex');
            console.log("apiKey: ", apiKey);
            const newApiKey = new ApiKey({ key: apiKey });
            console.log("newApiKey: ", newApiKey);
            await newApiKey.save();
            return newApiKey.key;
        },
    },
};

export default apiKeyResolver;


