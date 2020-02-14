const Table = require('cli-table');
const table = new Table( {style: { 'padding-left': 0, 'padding-right': 0, 'padding-top': 0, 'padding-bottom': 0 }})
const chalk = require('chalk')


let ui = {
  render: () => {
    return table.toString ()
  },
  pager: () => {

  },
  header: (data) => {
    table.push(data)
  },
  push: (data, opt = {page: 1}) => { 
    let limit = 50
    let counter = 0
    let start = 0
    opt.page = opt.page || 1
    let total = Object.entries(data.addresses).length
    let numberOfPage = total <= 50 ? 1 : Math.ceil(total/50)
    // index of current page
    if(opt.page > 1) start = opt.page-1 === 0? 1 : (opt.page-1) * limit
    // header
    table.push([chalk.red(`Current Page : ${opt.page}`), chalk.red(`Total Page: ${numberOfPage}`), 'Hits'])
    for (let [key, value] of Object.entries(data.addresses)) {
      counter++

      // page 1
      if((opt.page == 1) && counter <= limit) table.push([counter, key, value.total || 0])
      // page > 1
      if(opt.page > 1) { 
        if(counter >= start && counter <= start+limit) table.push([counter, chalk.yellow(`${key}`), value.total])
      }
    }

  }
}

module.exports = ui