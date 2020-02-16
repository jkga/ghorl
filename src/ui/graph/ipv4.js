const chalk = require('chalk')


const pager = (table, screen, grid, contrib, data, opt = {page: 1}) => {
  table.rows.on('select', (item, index) => {
    // only alllow next and back
    let i = item.content.split(' ')
    let allowBtn = ["\u001b[32mNext", "\u001b[32mBack", "Page"]
    let filtered = i.filter(function (el) {
      return el != ''
    })

    if(allowBtn.indexOf(filtered[0]) != -1 && (filtered[1] || 1)) {
      opt.page = parseInt(filtered[1])
      return ipv4 (screen, grid, contrib, data, opt)
    } 

    if(opt.onSelect) opt.onSelect (item, index, data)
  })
}
const ipv4 =  async (screen, grid, contrib, data, opt = {page: 1}) => {

  let table = grid.set(0, 2, 8, 2, contrib.table, { keys: true
    , fg: 'white'
    , selectedFg: 'white'
    , selectedBg: 'blue'
    , interactive: true
    , label: 'IPv4 Addresses'
    , width: '30%'
    , height: '30%'
    , border: {type: "line", fg: "green"}
    , columnSpacing: 2 //in chars
    , columnWidth: [5, 16, 10] 
    ,
  })

  let limit = 100
  let counter = 0
  let start = 0
  opt.page = opt.page || 1
  let total = Object.entries(data.addresses).length
  let numberOfPage = total <= limit ? 1 : Math.ceil(total/limit)
  // index of current page
  if(opt.page > 1) start = opt.page-1 === 0? 1 : (opt.page-1) * limit
  return new Promise(async (resolve, reject) => { 
    await new Promise(async (resolve, reject) => {
      let d = []
      for (let [key, value] of Object.entries(data.addresses)) {
        counter++
        // page 1
        if((opt.page == 1) && counter <= limit)  await Promise.resolve(d.push([counter, chalk.yellow(`${key}`), value.total || 0]))
        // page > 1
        if(opt.page > 1) { 
          if(counter >= start && counter <= start+limit) await Promise.resolve(d.push([counter, chalk.yellow(`${key}`), value.total || 0]))
        }
      }
      // pager
      d.push(['Page :    ', `${opt.page}`, `Total: ${numberOfPage}`])
      d.push([chalk.green('Back', '  ', ` ${(opt.page - 1) || 1}`)])
      d.push([chalk.green('Next', '  ', ` ${opt.page + 1}`)])
      resolve(d)
    }).then((res) => {
      table.setData({headers: ['Index', 'Address', 'Total'], data: res}) 
      table.focus()
      pager(table, screen, grid, contrib, data, opt)
      screen.render() 
      resolve(table)
    })
  })
}

module.exports = ipv4