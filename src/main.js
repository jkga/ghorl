const reader = require('./reader')

/**
 * INDEXING GUIDE
 * 
 * Please refer below for the structure produced by
 * the generator
 */

let requestsGeneralTemplate = {
  headers: {
    GET: 0,
    POST: 0,
    PUT: 0,
    DELETE: 0,
    HEAD: 0,
  },
  total: 0,
}

/**
 * Main Data
 * 
 * This variable holds all the parsed data
 */
let data = {
  pages: {
    total: 0
  },
  addresses: {
    total: 0
  },
  browsers: {
    total: 0
  },
  os: {
    total: 0
  },
  requests: {
    ...requestsGeneralTemplate
  },
}



/**
 * Excute Program
 */
module.exports = ((file, options = {}) => {
  return new Promise((resolve, reject) => {

    reader.reader.read(file, (res) => {
      if(!res.url) return
      // total
      data.requests.total++
      // ipv4 addresses
      if(!data.addresses[res.ipv4] && options.address) {
        data.addresses[res.ipv4] = {
          requests: Object.assign({}, requestsGeneralTemplate),
          total: 0,
        }
      }

      // browsers
      if(!data.browsers[res.browser.name] && options.browser){
        data.browsers[res.browser.name] = {
          requests: Object.assign({}, requestsGeneralTemplate),
          total: 0,
        }
      } 

      // pages
      if(!data.pages[res.url] && options.page) {
        data.pages[res.url] = {
          requests: Object.assign({}, requestsGeneralTemplate),
          language: res.language,
          total: 0,
        }
      }

      // pages
      if(!data.os[res.browser.os]  && options.os) {
        data.os[res.browser.os] = {
          requests: Object.assign({}, requestsGeneralTemplate),
          total: 0,
        }
      }

      if(options.address) {
        data.addresses.total++
        data.addresses[res.ipv4].total++
        data.addresses[res.ipv4].requests.total++
        data.addresses[res.ipv4].requests.headers[res.method]++;
      }
      
      if(options.browser) {
        data.browsers.total++
        data.browsers[res.browser.name].total++
      }

      if(options.os) {
        data.os.total++
        data.os[res.browser.os].total++
      }

      if(options.page) {
        data.pages.total++
        data.pages[res.url].total++
        data.pages[res.url].requests.total++
      }

      // verbose logging
      if(options.verbose) console.log(data)

    }, (results) => {
      console.log(data)
      resolve(data)
    }) 
  })
})


