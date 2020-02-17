
const path = require('path')
const program = require('commander')
const board = require('./ui/board')
const main = require('./main')
const Ora = require('ora');
const stripAnsi = require('strip-ansi')
const blessed = require('blessed')
const contrib = require('blessed-contrib')
const headerBar = require('./ui/graph/headers')
const OSBar = require('./ui/graph/os')
const IPv4Bar = require('./ui/graph/ipv4')
const rawLogs = require('./ui/graph/logs')
const chalk = require('chalk')
const IPInfo = require('./io/ipinfo')
const IPv4Browser = require('./ui/graph/ipv4/browsers')



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

const progOpts = program.opts()
const options = {
  verbose: progOpts.verbose,
  address: progOpts.address,
  browser: progOpts.browser,
  os: progOpts.os,
  page: progOpts.page,
  protocol: progOpts.protocol,
  dump: progOpts.dump,
}

const menuText = `
  Shortcut keys:\r
  Tab - set focus to different table\r
  Enter - select an item from the list\r
  Esc - quit application`

let screen = {}
let grid = {}
let screenLogger = {}
let dataLogger = {}
let infoLogger = {}
let tabIndex = 0
let file = ''
let headerTab, ipv4Tab, logTab, OSTab, ipv4BrowserTab = {}


const spinner = new Ora({
  color: 'yellow',
  text: 'Reading Logs . . .\n',
})

const success = () => {
  spinner.text = 'Done'
  spinner.color = 'green'
  spinner.succeed()
}


const getIpInfo = (IP) => {
  infoLogger.setContent('Getting IP info from abuseipdb.com . . .')
  IPInfo (IP).then(json => { 
    let str = ''
    for (let [key, value] of Object.entries(json)) {
      str+=`${key}: ${chalk.yellow(stripAnsi(value.replace(/^\n|\n$/g, '')))}\r`
    }
    infoLogger.setContent(str)
    screen.render()
  })
}

const enableScreenTab = (screen) => {
  // enable shifting focus to table using tab key
  screen.key(['tab'], function(ch, key) {
    Promise.all([ipv4Tab, logTab, OSTab, ipv4BrowserTab]).then(val => {
      let screenTabs = [ipv4Tab, logTab, OSTab, ipv4BrowserTab] 
      // select new tab and reset to first once exceed the maximum length
      if(tabIndex >= screenTabs.length) tabIndex = 0

      // shift tab
      screenTabs[tabIndex].then((tabInstance) => {
        tabInstance.focus() 
        screen.render ()
        tabIndex++
        screenLogger.log('Shifting tab focus')
      }).catch(e => { 
        screenLogger.log(e.message)
      })
    })
  })
}

const IPv4RawLogs = (screen, grid, contrib, table, data, IP, opt) => {
  table.rows.on('select', (item, index) => {
    let ind = item.content.split(' ').filter(function (el) { return el != '' })

    let allowBtn = ["\u001b[32mNext", "\u001b[32mBack", "Page", "\u001b[32mLogs"]
    // optionss
    if(allowBtn.indexOf(ind[0]) != -1 && (ind[1] || 1)) {
      opt.page = ind[1]
      
      rawLogs (screen, grid, contrib, data.addresses[IP], opt).then(e => {
        e.focus()
        IPv4RawLogs (screen, grid, contrib, table, data, IP, opt)
        screen.render()
      })
    } 

    dataLogger.setContent(JSON.stringify(data.addresses[IP].raw[ind[0]-1], '\r\n\n'))
    screen.render()
  })
  screen.render()
}


const ipv4LogSelect = (item, index, data, opt) => { 
  let filtered = item.content.split(' ').filter(function (el) { return el != '' })
  let allowBtn = ["Next", "Back"]

  // options
  if(allowBtn.indexOf(stripAnsi(filtered[0])) != -1 && (filtered[1] || 1)) {
    opt.page = parseInt(filtered[1])
    return rawLogs (screen, grid, contrib, data, opt)
  } 

  // log selected item based on index
  dataLogger.setContent(JSON.stringify(data.raw[filtered[0]-1])+'\n\n')
  screen.render ()

}

const IPv4OnSelect = (item, index, data, opt) => { 
  let filtered = item.content.split(' ').filter(function (el) { return el != '' })
  let allowBtn = ["Next", "Back", "Page"]

  // options
  if(allowBtn.indexOf(stripAnsi((filtered[0]))) != -1 && (filtered[1] || 1)) {
    opt.page = parseInt(filtered[1])
    return (ipv4Tab = IPv4Bar (screen, grid, contrib, data, opt))
  } 


  if(stripAnsi(filtered[0]) === 'Logs') {
    // all logs
    rawLogs (screen, grid, contrib, data, {onSelect: ipv4LogSelect}).then(e => {
      e.focus ()
      screen.render ()
    })
  } else {
    // get ipv4 logs
    rawLogs (screen, grid, contrib, data.addresses[stripAnsi(filtered[1].trim())], {onSelect: ipv4LogSelect}).then(e => {
      e.focus()
      screen.render()
    })
    // get all browsers and OS
    ipv4BrowserTab = IPv4Browser(screen, grid, contrib, data.addresses[stripAnsi(filtered[1].trim())])

    // log selected item
    dataLogger.setContent(JSON.stringify(data.addresses[stripAnsi(filtered[1].trim())].raw[0])+'\n\n')

    // get IP info from online source
    getIpInfo(stripAnsi(filtered[1].trim()))
  }

  screenLogger.log(`Selected an item : ${filtered[1]}`)
  screen.render()

}



// show welcome message
board.show()

if(program.file) {
  file = path.resolve(__dirname, program.file)
  console.log(`Source: ${file}`)

  // loading
  //spinner.start()
  console.log('Loading . . .')

  main(file,options).then(res => {
    success()

    // start main screen
    screen = blessed.screen()
    grid = new contrib.grid({rows: 12, cols: 12, screen: screen})
    
    // for verbose inspection
    if(progOpts.dump) console.log(res)

    // event logs
    screenLogger = grid.set(8, 0, 1, 4, blessed.log, { 
      fg: "green",
      selectedFg: "green",
      label: 'Event Logs'
    })

    // data logs
    dataLogger = grid.set(9, 0, 2, 12, blessed.box, { 
      fg: "green",
      selectedFg: "green",
      label: 'Data Logs'
    })

    // event logs
    infoLogger = grid.set(6, 9, 3, 3, blessed.box, { 
      fg: "green",
      selectedFg: "green",
      label: 'IPv4 Info'
    })

   

 

    screen.render()

    // graphs and tables
    logTab = rawLogs (screen, grid, contrib, res)
    headerTab = headerBar(screen, grid, contrib, res)
    OSTab = OSBar (screen, grid, contrib, res)
    ipv4Tab = IPv4Bar (screen, grid, contrib, res, {onSelect: IPv4OnSelect})
    ipv4BrowserTab = IPv4Browser(screen, grid, contrib, {})

    screenLogger.log('Application has been loaded')
    infoLogger.setContent('Show IP Address (v4) information from online resource')
    dataLogger.setContent(`${menuText}`)
    setTimeout(() => enableScreenTab (screen) & screen.render() ,700)

    // enable esc key
    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    }) 
    

    screen.render()

  })
}
