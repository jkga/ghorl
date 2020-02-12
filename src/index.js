
const path = require('path')
const program = require('commander')
const board = require('./board')
const main = require('./main')
const Ora = require('ora');

let file = ''
board.show()

program
.option('-f, --file <string>', 'File source')
.option('-v, --verbose', 'Dump all results to the console')
.option('-a, --address', 'IPv4 address')
.option('-b, --browser', 'Browsers')
.option('-o, --os', 'Operatings systems')
.option('-p, --page', 'Page accessed')
.option('-s, --save [location]', 'Save to file')
program.parse(process.argv);

let progOpts = program.opts()
let options = {
  verbose: progOpts.verbose,
  address: progOpts.address,
  browser: progOpts.browser,
  os: progOpts.os,
  page: progOpts.page,
}


if(program.file) {
  file = path.resolve(__dirname, program.file)
  console.log(`Source: ${file}`)


  const spinner = new Ora({
    color: 'yellow',
    text: 'Reading Logs . . .\n',
  })
  spinner.start()

  let success = () => {
    spinner.text = 'Parsed Successfully'
    spinner.color = 'green'
    spinner.succeed()
  }

  let saving = () => {
    spinner.start()
    spinner.text = `Saving to ${program.save}`
    spinner.color = 'yellow'
  }

  main(file,options).then(res => {
    success()
    //if(progOpts.save) saving ()
  })
}
