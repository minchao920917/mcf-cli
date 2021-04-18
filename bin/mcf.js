#!/usr/bin/env node
const program = require("commander");
const chalk = require("chalk");
const { promisify } = require("util");
const figlet = require("figlet");
const clear = require("clear");
const log = (content) => console.log(chalk.green(content));

program.version(require("../package").version);

// program
//     .command('init <name>')
//     .description('init project')
//     .action(
//         require('../lib/init')
//     )

// 打印欢迎画⾯
// clear();
log(figlet.textSync("mcf welcome"));

program
  .command("基本用法", "----------------")
  .usage("<command> [options]")
  .command("add", "添加新的源 mcf add")
  .command("delete", "删除源 mcf delete")
  .command("list", "展示源列表 mcf list")
  .command("init", "从源初始化项目 mcf init <模板名> 项目名")
  .command("工程化项目", "---------------")
  .usage("<command> [options]");

program
  .command("vue-app <projectName>")
  .description("快速构建新vue-app项目")
  .action(require("../lib/mcf-vue-app"));
program
  .command("vue-admin <projectName>")
  .description("快速构建新vue-admin项目")
  .action(require("../lib/mcf-vue-admin"));
  program
  .command("react-multi <projectName>")
  .description("快速构建多页面的react项目")
  .action(require("../lib/mcf-react-multi"));
program.parse(process.argv);
