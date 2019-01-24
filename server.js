'use strict';
//
// What port should be use?
const port = process.env.PORT || 3000;
//
// Basic required libraries.
const HttpStatusCodes = require('http-status-codes');
const bodyParser = require('body-parser');
const chalk = require('chalk');
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
    TasksManager,
} = require('drtools');
//
// Creating an express application.
global.expressApp = express();
//
// Loading steps.
const loadingSteps = [];
//
// Loading parser.
loadingSteps.push(async () => {
    global.expressApp.use(bodyParser.json());
    global.expressApp.use(bodyParser.urlencoded({ extended: false }));
});
//
// Loading DRTools configs.
loadingSteps.push(async () => {
    global.configs = new ConfigsManager(path.join(__dirname, 'configs'), { publishConfigs: true });
});
//
// Loading DRTools ExpressJS connector.
loadingSteps.push(async () => {
    ExpressConnector.attach(global.expressApp, {
        webUi: global.configs.get('environment').drtools.webUi,
    });
});
//
// Loading DRTools loaders.
loadingSteps.push(async () => {
    const manager = new LoadersManager(path.join(__dirname, 'includes/loaders'), {}, global.configs);
    await manager.load();
});
//
// Loading DRTools middlewares.
loadingSteps.push(async () => {
    const manager = new MiddlewaresManager(global.expressApp, path.join(__dirname, 'includes/middlewares'), {}, global.configs);
    await manager.load();
});
//
// Loading DRTools plugins.
loadingSteps.push(async () => {
    const manager = new PluginsManager(path.join(__dirname, 'plugins'), {}, global.configs);
    await manager.load();
});
//
// Loading DRTools routes.
loadingSteps.push(async () => {
    const manager = new RoutesManager(global.expressApp, path.join(__dirname, 'includes/routes'), {}, global.configs);
    await manager.load();
});
//
// Loading DRTools tasks.
loadingSteps.push(async () => {
    const manager = new TasksManager(path.join(__dirname, 'includes/tasks'), {}, global.configs);
    await manager.load();
});
//
// Loading DRTools mock-endpoints.
loadingSteps.push(async () => {
    const endpoints = new EndpointsManager({
        directory: path.join(__dirname, 'includes/mock-endpoints'),
        uri: 'mock-api/v1.0',
    }, global.configs);
    global.expressApp.use(endpoints.provide());
});
//
// Setting static folders.
loadingSteps.push(async () => {
    global.expressApp.use(express.static(path.join(__dirname, 'public')));
});
//
// Setting default routes.
loadingSteps.push(async () => {
    global.expressApp.use(function (req, res, next) {
        if (req.xhr || req.headers['accept'] === 'application/json' || req.headers['content-type'] === 'application/json') {
            res.status(HttpStatusCodes.NOT_FOUND).json({
                message: 'Not Found',
                uri: req.url,
                isAjax: req.xhr,
            });
        } else {
            res.sendFile(path.join(__dirname, '/public/index.html'));
        }
    });
});
//
// Steps loaders.
(async () => {
    try {
        for (const step of loadingSteps) {
            await step();
        }
        //
        // Starting server.
        http.createServer(global.expressApp).listen(port, () => {
            console.log(`\nListening on port '${port}'...`);
        });
    } catch (err) {
        console.error(chalk.red(err));
    }
})();
