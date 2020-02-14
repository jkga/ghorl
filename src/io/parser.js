const browser = require('browser-detect');
const yaml = require('js-yaml');
const fs =require('fs')
const path = require('path')
const url = require('url')

let docYaml = {}
let languagePath = '../languages.yml'

/**
 * String Parser
 * 
 * convert string to a log object
 * please see sample log object below
 * {
    ipv4: '211.11.111.111',
    date: '04/Feb/2020:13:25:18',
    method: 'GET',
    url: '/test&to=2021',
    protocol: 'HTTP/1.1',
    response: '302',
    referer: '"-"',
    agent: '"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36" ',
    browser: {
      name: 'chrome',
      version: '79.0.3945',
      versionNumber: 79.03945,
      mobile: false,
      os: 'Linux x86_64'
    }
  }
  *
  */

 try {
  docYaml = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, languagePath), 'utf8'));
} catch (e) {
  throw new Error('Unable to load languages')
}


const parser = {
  inspect: async (string) => {
    let str = string.split(' ')
    let strLen = str.length
    let agent = await (parser.arrayToString(str, 11, strLen))
    let progL = str[6] ? str[6].split('.') : []
    let progLang = await (parser.detectProgrammingLanguage(progL.length > 1  ? progL[progL.length - 1]: Promise.resolve('')))
    return {
      ipv4: str[0],
      date: str[3] ? str[3].replace('[', '') : '',
      method: str[5] ? str[5].replace('"', '') : '',
      url: str[6] || '',
      protocol: str[7] ? str[7].replace('"', '') : '',
      response: str[8] ? str[8] : '',
      referer: str[10] ? str[10] : '',
      language: progLang,
      agent,
      browser: browser(agent)
    }
  },
  arrayToString: async (string, from, to) => {
    return new Promise((resolve, reject) => {
      let agent = ''
      for(let x = from; x < to; x++) {
        agent+= string[x]+' '
      }
      resolve(agent)
    })
  },
  detectProgrammingLanguage: async (string) => {
    let URI= typeof string === 'object' ? '': `${string}`
    let lang =  url.parse(URI,true);
    return new Promise((resolve, reject) => {
      Object.keys(docYaml).forEach(async (el, index) => {
        if(docYaml[el].extensions) {
          if(docYaml[el].extensions.includes(`.${lang.pathname}`)) return resolve(el)
        }
      })      
      resolve(lang.pathname)
    })
  },
}

const stat = () => {

}

module.exports = { parser }