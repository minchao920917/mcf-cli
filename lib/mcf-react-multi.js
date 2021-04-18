#!/usr/bin/env node
const { promisify } = require("util");
//引入路径
const path = require("path");
//引入文件谋爱
const fs = require("fs");
// 终端字符串样式设置正确
const chalk = require("chalk");
//使用shell使用的模式匹配文件，比如星号之类的
// 命令行交互工具
const program = require("commander");
//使用shell使用的模式匹配文件，比如星号之类的
const glob = require("glob");
// 终端交互工具
const inquirer = require("inquirer");
// 各种日志级别的彩色符号
const logSymbols = require("log-symbols");
//打开浏览器
const open = require("open");
//下载模板文件
const download = require("./download.js");
// 初始化文件
const generator = require("./generator");
// 绿色日志
const log = (content) => console.log(chalk.green(content));

//异步子程序调用，同步执行
const spawn = async (...args) => {
  const { spawn } = require("child_process");
  return new Promise((resolve) => {
    const proc = spawn(...args);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    proc.on("close", () => {
      resolve();
    });
  });
};

//终端人机交互 confirm  父文件夹同名是否继续创建
function typeConfirm(projectName) {
  inquirer
    .prompt([
      {
        name: "buildInCurrent",
        message: "当前目录名称和项目名称相同，是否继续在当前目录下创建新项目？",
        type: "confirm",
        default: true,
      },
    ])
    .then((answer) => {
      if (!answer.buildInCurrent) {
        console.log(chalk.red(`请更换项目名，重新创建`));
        return;
      }
      clone(projectName);
    });
}
//终端人机交互confirm
function promptInput(projectName, target) {
  inquirer
    .prompt([
      {
        name: "projectName",
        message: "项目的名称",
        default: projectName,
      },
      {
        name: "projectVersion",
        message: "项目的版本号",
        default: "1.0.0",
      },
      {
        name: "projectDescription",
        message: "项目的简介",
        default: `React multi page Application named ${projectName}`,
      },
      {
        name: "projectAuthor",
        message: "项目的创建人",
        default: `minchao`,
      },
    ])
    .then((metadata) => {
      generator(metadata, target, path.parse(target).dir);
      console.log(logSymbols.success, chalk.green("创建成功:)"));
      npmInstall(projectName);
    });
}

//是否install
function npmInstall(projectName) {
  inquirer
    .prompt([
      {
        type: "confirm",
        message: "是否安装依赖",
        name: "install",
      },
    ])
    .then((metadata) => {
      // 安装依赖逻辑
      if (metadata.install) {
        //直接安装依赖
        // ....
        const install = async () => {
          await spawn("yarn", ["install"], { cwd: `./${projectName}` });
          console.log(chalk.green(logSymbols.success, "安装完成"));
          npmRun(projectName);
        };
        install();
       
      } else {
        //否
        console.log(chalk.green(`cd ${projectName}\nyarn install\nyarn start`));
      }
    });
}
//是否install
function npmRun(projectName) {
  inquirer
    .prompt([
      {
        type: "confirm",
        message: "是否启动项目",
        name: "install",
      },
    ])
    .then((metadata) => {
      // 添加启动逻辑
      if (metadata.install) {
        //直接启动
        const runDev = async () => {
          await spawn("yarn", ["run","start"], { cwd: `./${projectName}` });
          console.log(chalk.green(`请手动执行：\n cd ${projectName}\nyarn start`));
        };
        runDev();
      } else {
        //否
        console.log(chalk.green(`cd ${projectName}\nyarn start`));
      }
    });
}
//下载git项目
function clone(projectName) {
  if (projectName !== ".") {
    fs.mkdirSync(projectName);
  }
  return download(projectName, "minchao920917/react-multi-template").then(
    (target) => {
      promptInput(projectName, target);
    }
  );
}

module.exports = async (projectName) => {
  //判断该目录下是否有值
  if (!projectName) {
    // project-name 必填
    // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
    program.help();
    return;
  }

  const list = glob.sync("*"); // 遍历当前目录
  //判断项目名是否存在
  if (
    list.filter((name) => {
      const fileName = path.resolve(process.cwd(), path.join(".", name));
      const isDir = fs.statSync(fileName).isDirectory();
      return name.indexOf(projectName) !== -1 && isDir;
    }).length !== 0
  ) {
    console.log(chalk.red(`项目${projectName}已经存在`));
    return;
  }
  const rootName = path.basename(process.cwd()); // 获取执行当前命令的文件夹名称字符串
  //判断项目和文件夹是否同名
  if (rootName === projectName) {
    typeConfirm(projectName);
  } else {
    clone(projectName);//开始clone项目并继续往下走
  }
};
