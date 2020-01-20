#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const program = require('commander');
const logger = require("../utils/log");
const { checkDeployConfig } = require("../utils/check");
const packageJson = require('../package.json');

process.title = 'puzzle'

const version = packageJson.version;

program
    .name("puzzle")
    .helpOption('-h, --help', '获取帮助信息');

// 创建项目命令封装
program
    .version(version)
    // .name("puzzle ")
    .command('init')
    .option('-n, --name [projectName]', '项目名称')
    .option('-t, --type [projectType]', '项目类型 [单项目|单组件|纯js组件|多项目组件]')
    .option('-c, --compile [compileType]', '项目采用的编译环境 [gulp|grunt|webpack]')
    .option('-e, --env [environment]', '开发环境 [es5|es6|ts|ts+es6]')
    .description('空项目进行初始化')
    .action((options) => {
        const create = require('../lib/create');
        if(!options){
            inquirer.prompts([{
                type: 'input',
                message: '项目名称',
                name: 'name'
            },{
                type: 'list',
                choices:[
                  '单项目','单组件','纯js组件','多项目组件'
                ],
                message: '请选择项目类型',
                name: 'type',
                default: '单项目'
            },{
                type: 'list',
                choices:[
                  'gulp','grunt','webpack'
                ],
                message: '请选择项目采用的编译环境',
                name: 'compile',
                default: 'gulp'
            },{
                type: 'list',
                choices:[
                  'es5','es6','ts', 'ts+es6'
                ],
                message: '请选择开发环境',
                name: 'env',
                default: 'es6'
            }]).then((answers) => {
                create(answers);
            })
        }
        create(options);
    }).on("--help", ()=>{
        logger.info('Examples:');
        logger.info('');
        logger.info(' $ puzzle init --name awesome -t 单组件 -c webpack -e "ts+es6" ');
    });

//组件项目自动发包
program
    .version(version)
    .command('tag [tagName]')
    .description('自动构建和发版本')
    .action((tagName) => {
        if(!tagName) {
            inquirer.prompts([{
                type: 'input',
                message: '请输入项目的版本号',
                name: 'tagName'
            }]).then((answers) => {
                require('../lib/tag')(answers.tagName);
            })
        }
        require('../lib/tag')(tagName);
    }).on("--help", ()=>{
        console.log('Examples:');
        console.log('');
        console.log(' $ puzzle deploy deploy.config.js');
    });

//项目部署命令封装
program
    .version(version)
    .command('deploy [configPath]')
    .description('项目部署')
    .action((configPath) => {
        if(!configPath) {
            logger.error('缺少自动配置文件');
            process.exit(1);
        }
        const configFilePath = path.join(process.cwd(), configPath);
        if( !fs.existsSync(configFilePath) ) {
            logger.error('自动部署的配置文件不存在');
            process.exit(1);
        }
        if( !checkDeployConfig(configFilePath) ){
            logger.error('自动部署配置文件格式不符合规范');
            process.exit(1);
        }
        require('../utils/deploy')(configFilePath);
    }).on("--help", ()=>{
        console.log('Examples:');
        console.log('');
        console.log(' $ puzzle deploy deploy.config.js');
    });

program.parse(process.argv);