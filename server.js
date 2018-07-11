'use strict';
//
// What port should be use?
const port = process.env.PORT || 3000;
//
// Basic required libraries.
const bodyParser = require('body-parser');
const chalk = require('chalk');
const cors = require('cors');
const express = require('express');
const { ExpressConnector } = require('drtools');
const http = require('http');
const path = require('path');
//
// Creating an express application.
const app = express();
//
// Loading steps.
const loadingSteps = [];
//
// Loading parser.
loadingSteps.push(async () => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
});
//
// Loading cors.
loadingSteps.push(async () => {
    app.use(cors());
});
//
// Loading DRTools and connecting them to ExpressJS.
loadingSteps.push(async () => {
    ExpressConnector.attach(app, {
        configsDirectory: path.join(__dirname, 'configs'),
        loadersDirectory: path.join(__dirname, 'includes/loaders'),
        endpoints: {
            directory: path.join(__dirname, 'includes/mock-endpoints'),
            uri: 'mock-api/v1.0'
        },
        middlewaresDirectory: path.join(__dirname, 'includes/middlewares'),
        routesDirectory: path.join(__dirname, 'includes/routes'),
        tasksDirectory: path.join(__dirname, 'includes/tasks'),
        pluginsDirectories: path.join(__dirname, 'plugins'),
        webUi: true
    });
    global.drtools = ExpressConnector.attachments();
});
//
// Setting static folders.
loadingSteps.push(async () => {
    app.use(express.static(path.join(__dirname, 'public')));
});
//
// Setting default routes.
loadingSteps.push(async () => {
    app.use(function (req, res, next) {
        if (req.xhr || req.headers['accept'] === 'application/json' || req.headers['content-type'] === 'application/json') {
            res.status(404).json({
                message: 'Not Found',
                uri: req.url,
                isAjax: req.xhr
            });
        } else {
            res.sendFile(__dirname + '/public/index.html');
        }
    });
});
//
// Steps loaders.
const loadSteps = async () => {
    const step = loadingSteps.shift();

    if (step) {
        try {
            await step();
            loadSteps();
        } catch (err) {
            console.error(chalk.red(err));
        }
    } else {
        //
        // Starting server.
        http.createServer(app).listen(port, () => {
            console.log(`\nListening on port '${port}'...`);
        });
    }
};
//
// Loading...
loadSteps();
