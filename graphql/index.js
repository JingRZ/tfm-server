import { ApolloServer } from "apollo-server-express"
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import './db.js'   //Con solo importarlo ya se ejecuta
import User from "./models/user.js"
import jwt from "jsonwebtoken"

import cors from 'cors';
import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import ApiKeyAuth from "./utils/apiKeyAuth.js";

import questResolver from "./resolvers/questResolver.js"
import cardResolver from "./resolvers/cardResolver.js"
import quizResolver from "./resolvers/quizResolver.js";
import riddleResolver from "./resolvers/riddleResolver.js";
import userResolver from "./resolvers/userResolver.js";
import refreshTokenResolver from "./resolvers/refreshTokenResolver.js";
import hintResolver from "./resolvers/hintResolver.js";
import nodeResolver from "./resolvers/nodeResolvers.js";
import apiKeyResolver from "./resolvers/apiKeyResolver.js";
import adResolver from "./resolvers/adResolver.js";

import queryTypedef from "./typedefs/queryTypedef.js";
import mutationTypedef from "./typedefs/mutationTypedef.js";
import cardTypedef from "./typedefs/cardTypedef.js";
import questTypedef from "./typedefs/questTypedef.js";
import userTypedef from "./typedefs/userTypedef.js";
import tokenTypeDefs from "./typedefs/tokenTypedef.js";
import nodeTypeDefs from "./typedefs/nodeTypedef.js";
import apiKeyTypedef from "./typedefs/apiKeyTypedef.js";
import adTypedef from "./typedefs/adTypedef.js";

import cookieParser from 'cookie-parser';
import {authUser, refreshToken, defaultPage, whereami, aStar, aStar_MAC} from './helpers.js';
import node from "./models/node.js";

const JWT_SECRET = process.env.JWT_SECRET || 'oN823SarucV9VE1qTyIbjfdUL'


//npm install jsonwebtoken

const typeDefs = mergeTypeDefs([
    queryTypedef,
    mutationTypedef,
    cardTypedef,
    questTypedef,
    userTypedef,
    tokenTypeDefs,
    nodeTypeDefs,
    apiKeyTypedef,
    adTypedef
])


const resolvers = mergeResolvers([
    questResolver,
    quizResolver,
    riddleResolver,
    cardResolver,
    userResolver,
    refreshTokenResolver,
    hintResolver,
    nodeResolver,
    apiKeyResolver,
    adResolver
]);

const configurations = {
    // Note: You may need sudo to run on port 443
    production: { ssl: true, port: 443, hostname: 'example.com' },
    development: { ssl: false, port: 5000, hostname: 'graphql' },
    //otro: { ssl: false, port: 4000, hostname: '192.168.159.165' },
    otro: { ssl: false, port: 4000, hostname: 'localhost' },
};

const environment = process.env.NODE_ENV || 'otro';
const config = configurations[environment];

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers,
    introspection: true,
    context: async ({ req }) => {
        //TODAS las peticiones pasan por aqui

        //Protección de rutas
        const auth = req ? req.headers.authorization : null
        if(auth && auth.toLowerCase().startsWith('bearer ')){
            /*
                Formato esperado: "bearer token"
                token empieza en el indice 7
            */
            const token = auth.substring(7)
            //Está en formato useForToken
            const {id} = jwt.verify(token, JWT_SECRET)
            const currentUser = await User.findById(id).populate('cards')
            return { currentUser }
        }
    }
    
})

await server.start()

const app = express();
app.use(cors());
app.use(express.json());
//app.use('/graphql', ApiKeyAuth.authenticate);
app.use('/generate-api-key', ApiKeyAuth.hasHighestAccessLevel);


app.get('/', (req, res) => {
    return defaultPage(req, res);
});

app.post('/generate-api-key', async (req, res) => {
    const apiKey = await apiKeyResolver.Mutation.createApiKey();
    console.log('Generated API key:', apiKey);
    res.json({ apiKey });
});

app.post('/me', (req, res) => {
    return authUser(req, res);
});

app.post('/whereami', async (req, res) => {
    return await whereami(req, res);
});


const nextNodeInstructions = {
    CFT: {
        H2: 'Sal de la cafetería (OESTE)',
        EXT2: 'Sal de la cafetería (ESTE)',
    },
    H2: {
        CFT: 'Entra a la cafetería',
        ASC1: 'Gira a la izquierda y dirígete a los ascensores',
        SEC: 'Recto hacia la secretaría',
    },
    ASC1: {
        H2: 'Gira a la derecha, a la zona de la cafetería',
        A2: 'Gira a la izquierda y dirígete al aula 2',

    },
    A1: {
        ASC1: 'Dirígete a los ascensores',
        A2: 'Dirígete al aula 2. Pone A2 en el cartel',
    },
    A2: {
        A1: 'Dirígete al aula 1. Pone A1 en el cartel',
        A3: 'Dirígete al aula 3. Pone A3 en el cartel',
    },
    
};

app.post('/pathfind', async (req, res) => {
    console.log('Finding path...');
    const { start, end } = req.body;

    const path = await aStar(start, end);
    const instructions = [];

    for(let i = 0; i < path.length - 1; i++){
        const currentNode = path[i];
        const nextNode = path[i + 1];
        const from = nextNodeInstructions[currentNode];
        if(!from){
            return res.status(400).json({ error: 'Invalid start or end point' });
        }
        const instr= from[nextNode];
        instructions.push(instr);
    }

    res.json({ path, instructions });
});


app.post('/pathfindmac', async (req, res) => {
    console.log('Finding path...');
    const { start, end } = req.body;
    const path = await aStar_MAC(start, end);
    res.json({ path });
});




app.post('/nextinstr', async (req, res) => {

    console.log('Finding next instruction...');
    const { start, end } = req.body;
    const path = await aStar(start, end);
    const currentNode = path[0];
    const nextNode = path[1];

    const from = nextNodeInstructions[currentNode];
    if(!from){
        return res.status(400).json({ error: 'Invalid start or end point' });
    }
    const instructions = from[nextNode];
    res.json({ instructions });
});


app.use(cookieParser());

app.post('/refreshtoken', (req, res) => {
    return refreshToken(req, res);
});

server.applyMiddleware({ app, path: '/graphql' });

let httpServer;
if (config.ssl) {
    httpServer = https.createServer(
    {
        key: fs.readFileSync(`./ssl/${environment}/server.key`),
        cert: fs.readFileSync(`./ssl/${environment}/server.crt`),
        passphrase: '7u8i9o0p',
    },
    app,
);
} else {
    httpServer = http.createServer(app);
}

await new Promise((resolve) => httpServer.listen({ port: config.port }, resolve));

console.log('🚀 Server ready at', `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}/graphql`);