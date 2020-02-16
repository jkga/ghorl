const headerBar =  async (screen, grid, contrib, data) => {
  let bar = grid.set(0, 0, 4, 2, contrib.bar,
    { label: 'Request Headers (Total)'
    , barWidth: 6
    , barSpacing: 6
    , xOffset: 0
    , maxHeight: 9})

  return new Promise(async (resolve, reject) => { 
    await new Promise(async (resolve, reject) => {
      let inf = {
        titles: [],
        data: []
      }

      for (let [key, value] of Object.entries(data.requests.headers)) {
        inf.titles.push(key)
        await Promise.resolve( inf.data.push(value))
      }
      resolve(inf)
    }).then((res) => {
      bar.setData(res) 
      screen.render() 
      resolve(bar)  
    })
  })
}

module.exports = headerBar
