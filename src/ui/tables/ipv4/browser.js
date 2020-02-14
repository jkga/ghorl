const Table = require('cli-table');
const chalk = require('chalk')
const table = new Table( {style: { 'padding-left': 0, 'padding-right': 0, 'padding-top': 0, 'padding-bottom': 0 }})

let ui = {
  render: () => {
    return table.toString ()
  },
  header: (data) => {
    table.push(data)
  },
  push: async (data) => { 
    return await(new Promise(async (resolve, reject) => {
      for (let [key, value] of Object.entries(data)) {
        // browsers
        await new Promise(async(resolve, reject) => {
          await table.push([chalk.yellow(key), '      ', '      ','      ','      ', value.total])
          resolve(value)
        }).then((browserList) => {
          // operating systems
            new Promise(async(resolve, reject) => { 
              for (let [key, value] of Object.entries(browserList.os)) {
                table.push(['      ', chalk.bgGreen.black(key),'      ','      ', value.total, '      '])
                // Headers (GET, POST, PUT, DELETE, etc...)
                await new Promise((resolve, reject) => {                  
                  for (let [keyH, valueH] of Object.entries(value.requests.headers)) { 
                    table.push(['      ', '      ', keyH, valueH, '      ','      '])
                  }
                  resolve('')
                })
              }
              resolve(browserList)
            })
            
        })
      }
      resolve(data)
    }))
  }
}
module.exports = ui