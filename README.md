#   mcf-cli

#   en

A simple CLI for creating your project.

#   Installation

    npm install mcf-cli -g

#   Usage

Open your terminal and type mcf or mcf -h , you'll see the help infomation below:

  Usage: mcf <command>


  Commands:

    add       Add a new template
    delete    Delete a template
    list      List all the templates
    init      Copy a project from template
    create-vue    fastly create A vue project
    vue-admin    fastly create A vue-element admin project
 
  Options:

    -h, --help     output usage information
    -V, --version  output the version number
Note that if you are using MacOS, sudo was required while using commands add and delete.

#   License
MIT.


#   zh-cn

一个简单你的脚手架-为你的急速命令行构建你的项目

#   全局安装

    npm install mcf-cli -g

#   使用

打开你的cmd 输入mcf或者mcf -h 查看你可以使用的命令行

  Usage: mcf "commands"


  Commands:

    add       给你的脚手架安装一个模板 {模板名称，地址(github.com是默认的)}
    delete    删除你的模板，只要给出list中的模板名称
    list      查看你的模板列表
    init      通过命令的模板初始化项目  mcf init <模板名称> <项目名称>
    create-vue    通过命令直接创建vue项目  mcf create-vue <项目名称>
    vue-admin   快速构建新vue项目 mcf vue-admin <项目名>

  Options:

    -h, --help     output usage information
    -V, --version  output the version number


#   License
MIT.
