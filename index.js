const http = require('http');
const express = require('express');
const mongoose = require('mongoose');

const routes = require('./src/routes');
const { dbConnectUrl, dbPassword, dbUsername } = require('./config');

const crawler = require('./src/crawler');

try {
    //---------------------------------------------
    let mongoUrl = `mongodb://${dbUsername}:${dbPassword}@${dbConnectUrl}`;
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoUrl);
    mongoose.connection
        .once('open', () => console.log("Database is connected."))
        .on('error', () => console.warn('Database Not Connected!!'));
    //---------------------------------------------
    const app = express();
    //---------------------------------------------
    routes(app);
    //---------------------------------------------
    const port = process.env.PORT || 3000;
    const server = http.createServer(app);
    server.listen(port);
    console.log("server running at " + port);
    //---------------------------------------------

    //crawler();
}
catch (e) {
    console.log("Error:" + e.message);
}