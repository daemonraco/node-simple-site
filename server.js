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
const http = require('http');
const path = require('path');
//
// Importing DRTools.
const {
    ConfigsManager,
    EndpointsManager,
    ExpressConnector,
    LoadersManager,
    MiddlewaresManager,
    RoutesManager,
    PluginsManager,
    TasksManager
} = require('drtools');
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
// Loading DRTools configs.
loadingSteps.push(async () => {
    global.configs = new ConfigsManager(path.join(__dirname, 'configs'), { publishConfigs: true });
});
//
// Loading DRTools ExpressJS connector.
loadingSteps.push(async () => {
    ExpressConnector.attach(app, {
        webUi: global.configs.get('environment').drtools.webUi
    });
});
//
// Loading DRTools loaders.
loadingSteps.push(async () => {
    new LoadersManager(path.join(__dirname, 'includes/loaders'), {}, global.configs);
});
//
// Loading DRTools middlewares.
loadingSteps.push(async () => {
    new MiddlewaresManager(app, path.join(__dirname, 'includes/middlewares'), {}, global.configs);
});
//
// Loading DRTools plugins.
loadingSteps.push(async () => {
    new PluginsManager(path.join(__dirname, 'plugins'), {}, global.configs);
});
//
// Loading DRTools routes.
loadingSteps.push(async () => {
    new RoutesManager(app, path.join(__dirname, 'includes/routes'), {}, global.configs);
});
//
// Loading DRTools tasks.
loadingSteps.push(async () => {
    new TasksManager(path.join(__dirname, 'includes/tasks'), {}, global.configs);
});
//
// Loading DRTools mock-endpoints.
loadingSteps.push(async () => {
    const endpoints = new EndpointsManager({
        directory: path.join(__dirname, 'includes/mock-endpoints'),
        uri: 'mock-api/v1.0'
    }, global.configs);
    app.use(endpoints.provide());
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
