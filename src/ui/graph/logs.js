const logs =  async (screen, grid, contrib, data, opt = {page: 1}) => {

  let table = grid.set(0, 4, 8, 5, contrib.table, { keys: true
    , fg: 'white'
    , selectedFg: 'white'
    , selectedBg: 'blue'
    , interactive: true
    , label: 'Raw Logs'
    , width: '30%'
    , height: '30%'
    , border: {type: "line", fg: "green"}
    , columnSpacing: 4 //in chars
    , columnWidth: [14, 22, 5, 45, 5] 
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
        if((opt.page == 1) && counter <= limit)  await Promise.resolve(d.push([value.ipv4, value.date, value.method, value.url, value.code]))
        // page > 1
        if(opt.page > 1) { 
          if(counter >= start && counter <= start+limit) await Promise.resolve(d.push([value.ipv4, value.date, value.method, value.url, value.code]))
        }

      }
      resolve(d)
    }).then((res) => {
      table.setData({headers: ['IPv4', 'Date', 'Method', 'URI', 'Code'], data: res}) 
      screen.render()
      resolve(table)
    })
  })

}

module.exports = logs