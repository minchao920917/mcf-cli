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

//终端人机交互 confirm
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
      go(projectName);
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
        default: `A project named ${projectName}`,
      },
      {
        name: "projectAuthor",
        message: "项目的创建人",
        default: `minchao`,
      },
    ])
    .then((metadata) => {
      console.log("metadata", metadata);
      generator(metadata, target, path.parse(target).dir);
      console.log(logSymbols.success, chalk.green("创建成功:)"));
      inquirer
      .prompt([
        {
          type: "confirm",
          message: "是否安装依赖",
          name: "install",
        },
      ])
      .then((metadata) => {
    // 添加启动逻辑
    console.log("metadata", metadata);
    if(metadata.install){//直接启动
        // ....
        const myFun2 = async () => {
            await spawn('npm', ['install'], { cwd: `./${projectName}` });
            open("http://localhost:8080");
            await spawn("npm", ["run", "dev"], { cwd: `./${projectName}` });
        }
        myFun2();
        console.log(chalk.green(logSymbols.success, '安装完成'))
    }else{//否
      console.log(chalk.green(`cd ${projectName}\nnpm install\nnpm run dev`));
    }
      });
  })
  .then((metadata) => {


      
    //   generator
    //     .then((res) => {
    //       console.log(logSymbols.success, chalk.green("创建成功:)"));
    //     })
    //     .catch((err) => {
    //       console.error(
    //         logSymbols.error,
    //         chalk.red(`创建失败：${error.message}`)
    //       );
    //     });
    });
}
//下载git项目
function go(projectName) {
  if (projectName !== ".") {
    fs.mkdirSync(projectName);
  }
  return download(projectName, "minchao920917/app-vue-template").then(
    (target) => {
      console.log("target", target);
      console.log("projectName", projectName);
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
    go(projectName);
  }

  return;
 

  log("安装依赖");
  await spawn("npm", ["install"], { cwd: `./${projectName}` });
  log(`
    👌安装完成：
    To get Start:
    ===========================
    cd ${projectName}
    npm run serve
    ===========================
    `);

  //   open("http://localhost:8080");
  await spawn("npm", ["run", "serve"], { cwd: `./${projectName}` });
};
