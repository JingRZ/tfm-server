const express = require('express');
const path = require('path')
const fs = require('fs')
const https = require('https');
const http = require('http');
const url = require('url')

const PORT = process.env.PORT || 3000;


const app = express();

app.get('/', (_, res) => {
    res.send('img Server root')
})


app.get('/img', (_, res) => {
    res.send('Helloooooooooo World')
})

app.get('/img/:imgName', (req, res) => {
    console.log('Petición recibida')
    const {imgName} = req.params
    const filePath = path.join(__dirname, 'src', 'img', imgName)

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(404).send('Archivo no encontrado')
            return
        }
        if(imgName.includes('.png')){
            res.contentType('image/png')
        }else if(imgName.includes('.jpg')){
            res.contentType('image/jpg')
        }else{
            res.status(404).send('Archivo no encontrado')
            return
        }
        res.sendFile(filePath)
    })
    //res.sendFile(path.join(__dirname, 'src', 'img', imgName))
})


const configurations = {
    // Note: You may need sudo to run on port 443
    production: { ssl: true, port: 443, hostname: 'example.com' },
    development: { ssl: false, port: PORT, hostname: 'imgServer' },
    otro: { ssl: true, port: PORT, hostname: '192.168.159.165' },
};

const environment = process.env.NODE_ENV || 'development';
const config = configurations[environment];

let httpServer;
if (config.ssl) {
    httpServer = https.createServer(
    {
        key: fs.readFileSync(`./ssl/${environment}/private.key`),
        cert: fs.readFileSync(`./ssl/${environment}/server.crt`),
        passphrase: '7u8i9o0p',
    },
    app,
);
} else {
    httpServer = http.createServer(app);
}

async function startServer() {
    await new Promise((resolve) => httpServer.listen({ port: config.port }, resolve));

    console.log('🚀 Server ready at', `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}`);
}

startServer();