const fs = require('fs')
const readline = require('readline');
const Parser = require('./parser')

/**
 * FileReader
 * 
 * read files based on the given filepath
 */
const reader = {
  fileExists: (file, callback) => {
    return fs.stat(file, callback)
  },
  read: (file, callback, promiseCallback = () => {}) => {
    reader.fileExists(file, (res) => {
      if(res === null) {
        let results = []
        const readInterface = readline.createInterface({
          input: fs.createReadStream(file)
        })

        readInterface.on('line', async function(line) {
          let res = await Parser.parser.inspect(line)
          results.push(res)
          callback(res)
        })

        readInterface.on('close', async function(line) {
          promiseCallback ? promiseCallback(Promise.resolve(results)) : new Promise.resolve('')
        })
        
      } else {
        throw new Error('File not found')
      }
      
    })
    
  },
  process: ((data, callback) => {
    callback(data)
  })
}





module.exports = { reader }