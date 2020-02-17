const pager = (table, screen, grid, contrib, data, opt = {page: 1}) => {
  table.rows.on('select', (item, index) => {
    if(opt.onSelect) opt.onSelect (item, index, data, opt)
  })
}

const logs =  async (screen, grid, contrib, data, opt = {page: 1}) => {
  const chalk = require('chalk')

  let table = grid.set(0, 4, 6, 8, contrib.table, { keys: true
    , fg: 'white'
    , selectedFg: 'white'
    , selectedBg: 'blue'
    , interactive: true
    , label: 'Raw Logs'
    , width: '30%'
    , height: '30%'
    , border: {type: "line", fg: "green"}
    , columnSpacing: 4 //in chars
    , columnWidth: [5, 14, 22, 5, 50, 5] 
    ,
  })

  
  let limit = 100
  let counter = 0
  let start = 0
  opt.page = opt.page || 1
  let total = Object.entries(data.raw).length
  let numberOfPage = total <= limit ? 1 : Math.ceil(total/limit)
  // index of current page
  if(opt.page > 1) start = opt.page-1 === 0? 1 : (opt.page-1) * limit
  return new Promise(async (resolve, reject) => { 
    await new Promise(async (resolve, reject) => {
      let d = []
      for (let [key, value] of Object.entries(data.raw)) {
        counter++
        // page 1
        if((opt.page == 1) && counter <= limit)  await Promise.resolve(d.push([counter, value.ipv4, value.date, value.method, value.url, value.code]))
        // page > 1
        if(opt.page > 1) { 
          if(counter >= start && counter <= start+limit) await Promise.resolve(d.push([counter, value.ipv4, value.date, value.method, value.url, value.code]))
        }

      }

      // pager
      d.push(['Page :    ', `${opt.page}`, `Total: ${numberOfPage}`, '', ''])
      d.push([chalk.green('Back', '  ', ` ${(opt.page - 1) || 1}`, '', '')])
      d.push([chalk.green('Next', '  ', ` ${opt.page + 1}`, '', '')])

      resolve(d)
    }).then((res) => {
      table.focus()
      table.setData({headers: ['   ', 'IPv4', 'Date', 'Method', 'URI', 'Code'], data: res}) 
      screen.render()
      pager(table, screen, grid, contrib, data, opt)
      resolve(table)
    })
  })

}

module.exports = logs