const Browser =  async (screen, grid, contrib, data) => {

  let table = grid.set(6, 4, 3, 5, contrib.table, { keys: true
    , interactive: true
    , vi: true
    , fg: 'white'
    , selectedFg: 'black'
    , selectedBg: 'light-blue'
    , interactive: true
    , label: 'Browsers & OS\'s'
    , width: '30%'
    , height: '30%'
    , border: {type: "line", fg: "green"}
    , columnSpacing: 2 //in chars
    , columnWidth: [15, 20, 10, 5, 5, 5] 
    ,
  })

  return new Promise(async (resolve, reject) => { 
    data.browsers = data.browsers || {}
    await(new Promise(async (resolve, reject) => {
      let d = []
      for (let [key, value] of Object.entries(data.browsers)) { 
        // browsers
        await new Promise(async(resolve, reject) => {
          d.push([key, '', '','','', value.total])
          resolve(value)
        }).then((browserList) => {
          // operating systems
            new Promise(async(resolve, reject) => { 
              for (let [key, value] of Object.entries(browserList.os)) {
                d.push(['', key,'','', value.total, ''])
                // Headers (GET, POST, PUT, DELETE, etc...)
                await new Promise((resolve, reject) => {                  
                  for (let [keyH, valueH] of Object.entries(value.requests.headers)) { 
                    d.push(['', '', keyH, valueH, '',''])
                  }
                  resolve('')
                })
              }
              resolve(browserList)
            })
            
        })
      }
      resolve(d)
    })).then((res) => {
      table.focus()
      table.setData({headers: ['Browser', 'OS', 'Method', '', '', ''], data: res})
      screen.render()
      resolve(table)

      /*
      table.setData({headers: ['Browser', 'OS', 'Method', '', '', ''], 
        data: [
          ['Android 4.2.1', '', '', '','',''],
          ['', 'Chrome', '', '','',''],
          ['', '', 'GET','10001','', '']
        ]
      })  */
    })
  })
}

module.exports = Browser