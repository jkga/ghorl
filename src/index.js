
const path = require('path')
const program = require('commander')
const chalk = require('chalk');
const board = require('./ui/board')
const main = require('./main')
const Ora = require('ora');
const generalHeader = require('./ui/tables/header')
const generalOS= require('./ui/tables/os')
const ipv4Header = require('./ui/tables/ipv4/header')
const ipv4Browser = require('./ui/tables/ipv4/browser')
const generalAddresses = require('./ui/tables/ipv4//index')

let file = ''

program
.option('-f, --file <string>', 'File source')
.option('-v, --verbose', 'Dump all results to the console')
.option('-a, --address', 'IPv4 address')
.option('-b, --browser', 'Browsers')
.option('-o, --os', 'Operatings systems')
.option('--page <page>', 'Page')
.option('-s, --save [location]', 'Save to file')
.option('-p, --protocol', 'Protocol used')
.option('--ipv4 <ip address>', 'Inspect logs with given ipv4')
.option('--dump', 'Dump results to console')
program.parse(process.argv);

let progOpts = program.opts()
let options = {
  verbose: progOpts.verbose,
  address: progOpts.address,
  browser: progOpts.browser,
  os: progOpts.os,
  page: progOpts.page,
  protocol: progOpts.protocol,
  dump: progOpts.dump,
}

const spinner = new Ora({
  color: 'yellow',
  text: 'Reading Logs . . .\n',
})

let success = () => {
  spinner.text = 'Done'
  spinner.color = 'green'
  spinner.succeed()
}

let readingStat = () => {
  spinner.text = 'Generating statistics'
  spinner.color = 'yellow'
  spinner.start()
}

let saving = () => {
  spinner.start()
  spinner.text = `Saving to ${program.save}`
  spinner.color = 'yellow'
}

let showIpv4Stat = (data) => {
  // ipv4
  console.log(chalk.green(`\n\nREQUESTS HEADERS (${progOpts.ipv4})`))
  ipv4Header.header({METHOD: 'Total'})
  ipv4Header.push(data.addresses[progOpts.ipv4].requests)
  console.log(ipv4Header.render())

  // browser
  console.log(chalk.green(`\n\nBROWSERS (${progOpts.ipv4})`))
  ipv4Browser.header([chalk.green('Browser'),chalk.green('OS'),chalk.green('Method')])
  ipv4Browser.push(data.addresses[progOpts.ipv4].browsers).then(res => { console.log(ipv4Browser.render()) })

  success()
}

let showGeneralStat = (data) => { 
  // ipv4
  console.log(chalk.green(`\n\nREQUESTS HEADERS (GENERAL)`))
  generalHeader.header({METHOD: 'Total'})
  generalHeader.push(data.requests)
  console.log(generalHeader.render())

  // operating system
  console.log(chalk.green(`\n\nOPERATING SYSTEMS (GENERAL)`))
  generalOS.header({OS: 'Total'})
  generalOS.push(data)
  console.log(generalOS.render())

  success()
}

// show welcome message
board.show()

if(program.file) {
  file = path.resolve(__dirname, program.file)
  console.log(`Source: ${file}`)


  spinner.start()

  main(file,options).then(res => {
    success()
    if(progOpts.dump) console.log(res)
    if(progOpts.ipv4) return (readingStat () | showIpv4Stat (res))
    showGeneralStat (res)

    // operating system
    console.log(chalk.green(`\n\nIP ADDRESSES (GENERAL)`))
    generalAddresses.header(['IPV4'])
    generalAddresses.push(res, {page: progOpts.page})
    console.log(generalAddresses.render())
    
  })
}
