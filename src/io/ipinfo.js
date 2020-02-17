const puppeteer = require('puppeteer')

let checkIP = async (IP) => {

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // go to page
  await page.goto(`https://www.abuseipdb.com/check/${IP}`).catch((res) => {
    return {
      error: res
    }
  })

  // parse result
  let json = await page.evaluate(() => {
    let ip =document.querySelector('#report > b').textContent
    let table = document.querySelector('table > tbody')
    let tr = table.querySelectorAll('tr')
    let data = {}
    // get all elements in table
    tr.forEach((el, index) => {
      data[el.querySelector('th').textContent] = el.querySelector('td').textContent
    })
    // get status
    stat = document.querySelector('#report').nextElementSibling
    if(stat.nodeName === 'P') data.report = stat.textContent
    return data
  });
  
  await browser.close();
  return Promise.resolve(json)
}

module.exports = checkIP
