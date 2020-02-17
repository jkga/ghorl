const OSBar =  async (screen, grid, contrib, data) => {

  let table = grid.set(4, 0, 4, 2, contrib.table, { keys: true
    , fg: 'white'
    , selectedFg: 'white'
    , selectedBg: 'blue'
    , interactive: true
    , label: 'Operating Sytems'
    , width: '30%'
    , height: '30%'
    , border: {type: "line", fg: "green"}
    , columnSpacing: 10 //in chars
    , columnWidth: [16, 12, 12] 
    ,
  })

  return new Promise(async (resolve, reject) => { 
    await new Promise(async (resolve, reject) => {
      let d = []
      for (let [key, value] of Object.entries(data.os)) {
        await Promise.resolve(d.push([key,value.total]))
      }
      resolve(d)
    }).then((res) => {
      table.focus()
      table.setData({headers: ['Name', 'Total'], data: res}) 
      screen.render()
      resolve(table)
    })
  })
}

module.exports = OSBar