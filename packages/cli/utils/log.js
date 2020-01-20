const fs = require('fs');
const chalk = require('chalk');

function warning(...content){
    console.log(chalk.yellow(...content));
}

function error(...content){
    console.log(chalk.red(...content));
}

function info(...content){
    console.log(chalk.white(...content));
}

function success(...content){
    console.log(chalk.green(...content));
}

function debug(...content){
    console.log(chalk.blue(...content));
}

module.exports = {
    warning,
    info,
    error,
    debug,
    success
}