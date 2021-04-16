#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const download = require("../lib/download");
const generator = require("../lib/generator");
const open = require("open")
// 命令行交互工具
const program = require("commander");
//使用shell使用的模式匹配文件，比如星号之类的
const glob = require("glob");

// 终端交互工具
const inquirer = require("inquirer");

// 终端字符串样式设置正确
const chalk = require("chalk");
// 各种日志级别的彩色符号
const logSymbols = require("log-symbols");

program
  .usage("<project-name>")
  .option(
    "-r, --repository [repository]",
    "assign to repository",
    "minchao920917/app-vue-template"
  )
  .parse(process.argv);

let projectName = program.args[0];

if (!projectName) {
  // project-name 必填
  // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
  program.help();
  return;
}

const list = glob.sync("*"); // 遍历当前目录
const rootName = path.basename(process.cwd()); // 获取执行当前命令的文件夹名称字符串

let next = undefined;
if (list.length) {
  // 如果当前目录不为空
  if (
    list.filter((name) => {
      const fileName = path.resolve(process.cwd(), path.join(".", name));
      const isDir = fs.statSync(fileName).isDirectory();
      return name.indexOf(projectName) !== -1 && isDir;
    }).length !== 0
  ) {
    console.log(`项目${projectName}已经存在`);
    return;
  }
  next = Promise.resolve(projectName);
} else if (rootName === projectName) {
  next = inquirer
    .prompt([
      {
        name: "buildInCurrent",
        message:
          "当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？",
        type: "confirm",
        default: true,
      },
    ])
    .then((answer) => {
      return Promise.resolve(answer.buildInCurrent ? projectName : ".");
    });
} else {
  next = Promise.resolve(projectName);
}

next && go();

function go() {
  next
    .then((projectRoot) => {
      if (projectRoot !== ".") {
        fs.mkdirSync(projectRoot);
      }
      return download(projectRoot, program.repository).then((target) => {
        return {
          name: projectRoot,
          root: projectRoot,
          target: target,
        };
      });
    })
    .then((context) => {
      return inquirer
        .prompt([
          {
            name: "projectName",
            message: "项目的名称",
            default: context.name,
          },
          {
            name: "projectVersion",
            message: "项目的版本号",
            default: "1.0.0",
          },
          {
            name: "projectDescription",
            message: "项目的简介",
            default: `A project named ${context.name}`,
          },
          {
            name: "projectAuthor",
            message: "项目的创建人",
            default: `minchao`,
          },
        ])
        .then((answers) => {
          return {
            ...context,
            metadata: {
              ...answers,
            },
          };
        });
    })
    .then((context) => {
      // 添加生成的逻辑
      return generator(
        context.metadata,
        context.target,
        path.parse(context.target).dir
      );
    })
    .then((res) => {
      // 成功用绿色显示，给出积极的反馈
      console.log(logSymbols.success, chalk.green("创建成功:)"));
      
      install();
    })
    .catch((err) => {
      // 失败了用红色，增强提示
      console.error(logSymbols.error, chalk.red(`创建失败：${error.message}`));
    });
}

function install() {
  next
    .then((context) => {
      return inquirer
        .prompt([
          {
            type: "confirm",
            message: "是否安装依赖",
            name: "install",
          },
        ])
        .then((answers) => {
          return answers
        });
    })
    .then((metadata) => {
      // 添加启动逻辑
      console.log("metadata", metadata);
      if(metadata.install){//直接启动
          // ....
         
          await spawn('npm', ['install'], { cwd: `./${projectName}` })


          console.log(chalk.green(logSymbols.success, '安装完成'))
          start();
          
      }else{//否
        console.log(chalk.green(`cd ${projectName}\nnpm install\nnpm run dev`));
      }
    });
}
function start() {
  next
    .then((context) => {
      return inquirer
        .prompt([
          {
            type: "confirm",
            message: "是否直接启动",
            name: "start",
          },
        ])
        .then((answers) => {
          return answers
        });
    })
    .then((metadata) => {
      // 添加启动逻辑
      console.log("metadata", metadata);
      if(metadata.start){//直接启动
         
         
        await spawn('npm', ['run', 'dev'], { cwd: `./${projectName}` })
          open(`http://localhost:8080`);
      }else{//否
        console.log(chalk.green(`cd ${projectName}\nnpm run dev`));
      }
    });
}
// promisiy化spawn
// 对接输出流
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
