
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

let screen = {}
let grid = {}
let screenLogger = {}
let tabIndex = 0
let file = ''


const spinner = new Ora({
  color: 'yellow',
  text: 'Reading Logs . . .\n',
})

const success = () => {
  spinner.text = 'Done'
  spinner.color = 'green'
  spinner.succeed()
}

const IPv4keyPress = (item, index, data) => { 
  let filtered = item.content.split(' ').filter(function (el) { return el != '' })
  rawLogs (screen, grid, contrib, data.addresses[stripAnsi(filtered[1].trim())])
  screenLogger.log(`Selected an item : ${filtered[1]}`)
}

// show welcome message
board.show()

if(program.file) {
  file = path.resolve(__dirname, program.file)
  console.log(`Source: ${file}`)

  // loading
  spinner.start()

  main(file,options).then(res => {
    success()

    // start main screen
    screen = blessed.screen()
    grid = new contrib.grid({rows: 12, cols: 12, screen: screen})
    
    // for verbose inspection
    if(progOpts.dump) console.log(res)

    // event logs
    screenLogger = grid.set(8, 0, 1, 9, blessed.log, { 
      fg: "green",
      selectedFg: "green",
      label: 'Event Logs'
    })

    // graphs and tables
    let logTab = rawLogs (screen, grid, contrib, res)
    let headerTab = headerBar(screen, grid, contrib, res)
    let OSTab = OSBar (screen, grid, contrib, res)
    let ipv4Tab = IPv4Bar (screen, grid, contrib, res, {onSelect: IPv4keyPress})


    // enable shifting focus to table using tab key
    screen.key(['tab'], function(ch, key) {
      Promise.all([ipv4Tab, logTab, OSTab]).then(val => {
        let screenTabs = [ipv4Tab, logTab, OSTab] 

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

    // enable esc key
    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    }) 
    

    screen.render()

  })
}
