const Table = require('cli-table');
const table = new Table( {style: { 'padding-left': 0, 'padding-right': 0, 'padding-top': 0, 'padding-bottom': 0 }})


let ui = {
  render: () => {
    return table.toString ()
  },
  header: (data) => {
    table.push(data)
  },
  push: (data) => { 
    for (let [key, value] of Object.entries(data.os)) {
      table.push([key, value.total])
    }

  }
}

module.exports = ui