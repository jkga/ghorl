const reader = require('./io/reader')

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
    browsers: {
      requests: Object.assign({}, requestsGeneralTemplate),
      total: 0,
    },
    total: 0
  },
  browsers: {
    total: 0
  },
  os: {
   
  },
  protocol: {
    total: 0
  },
  raw : [],
  requests: Object.assign({}, requestsGeneralTemplate),
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
      // raw logs
      data.raw.push(res)
      // ipv4 addresses
      if(!data.addresses[res.ipv4]) {
        data.addresses[res.ipv4] = {
          browsers: {
          },
          requests: {
            headers: {
              GET: 0,
              POST: 0,
              PUT: 0,
              DELETE: 0,
              HEAD: 0,
            },
            total: 0,
          },
          raw: [],
          total: 0,
        }
      }

      // browsers
      if(!data.browsers[res.browser.name]){
        data.browsers[res.browser.name] = {
          requests: Object.assign({}, requestsGeneralTemplate),
          total: 0,
        }
      } 

      // pages
      if(!data.pages[res.url]) {
        data.pages[res.url] = {
          requests: Object.assign({}, requestsGeneralTemplate),
          language: res.language,
          total: 0,
        }
      }

      // os
      if(!data.os[res.browser.os]) {
        data.os[res.browser.os] = {
          requests: Object.assign({}, requestsGeneralTemplate),
          total: 0,
        }
      }

      // protocol
      if(!data.protocol[res.protocol]) {
        data.protocol[res.protocol] = {
          requests: Object.assign({}, requestsGeneralTemplate),
          total: 0,
        }
      }

      data.addresses[res.ipv4].raw.push(res)


        //data.addresses.total++
        //data.addresses.requests.headers[res.method]++;
       data.requests.headers[res.method]++

        data.addresses[res.ipv4].total++
        data.addresses[res.ipv4].requests.total++
        data.addresses[res.ipv4].requests.headers[res.method]++;
      

        data.browsers.total++
        data.browsers[res.browser.name].total++
      


        //data.os.total++
        data.os[res.browser.os].total++
      

        data.pages.total++
        data.pages[res.url].total++
        data.pages[res.url].requests.total++
      


        data.protocol.total++
        data.protocol[res.protocol].total++
        data.protocol[res.protocol].requests.total++
      

      //ipv4 browser
      if(!data.addresses[res.ipv4].browsers[res.browser.name]) {
        data.addresses[res.ipv4].browsers[res.browser.name] = {
          requests: Object.assign({}, requestsGeneralTemplate),
          os: {},
          total: 0,
        }
      }


       //ipv4 browser os
       if(!data.addresses[res.ipv4].browsers[res.browser.name].os[res.browser.os]) {
        data.addresses[res.ipv4].browsers[res.browser.name].os[res.browser.os] = {
          requests: {
            headers: {
              GET: 0,
              POST: 0,
              PUT: 0,
              DELETE: 0,
              HEAD: 0,
            },
            total: 0,
          },
          total: 0,
        } 
       } 

       if(!data.addresses[res.ipv4].browsers[res.browser.name].os[res.browser.os].requests.headers[res.method]) {
        data.addresses[res.ipv4].browsers[res.browser.name].os[res.browser.os].requests.headers[res.method] = 0
       }


      data.addresses[res.ipv4].browsers[res.browser.name].total++
      data.addresses[res.ipv4].browsers[res.browser.name].os[res.browser.os].total++
      data.addresses[res.ipv4].browsers[res.browser.name].os[res.browser.os].requests.headers[res.method]++


      // verbose logging
      if(options.verbose) console.log(data)

    }, (results) => {
      resolve(data)
    }) 
  })
})


