const figlet = require('figlet');
const chalk = require('chalk');

module.exports = {
  show: () => {
    console.log(chalk.green(figlet.textSync('//////\n\r\n\rGHORL\n\r//////')))
    console.log(chalk.green('| -------------------------------------------------------- |'))
    console.log(chalk.green('| Welcome ghorl!!                                          |'))
    console.log(chalk.green('| Not Your Ordinary Log Reader: For Ancient Log Monitoring |'))
    console.log(chalk.green('| For options, please use -h command                       |'))
    console.log(chalk.green('| -------------------------------------------------------- |'))
  }
}