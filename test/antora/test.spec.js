
const rimrafSync = require('rimraf')
const cheerio = require('cheerio')
const fs = require('fs')
const chai = require('chai')
const expect = chai.expect

const generateSite = require('@antora/site-generator-default')

describe('Antora integration', () => {
  beforeEach(() => {
    rimrafSync(`${__dirname}/public`, function (error) {})
  })
  it('should generate a site with jira table', async () => {
    await generateSite([`--playbook=${__dirname}/site.yml`])
    const $ = cheerio.load(fs.readFileSync(`${__dirname}/public/antora-jira/index.html`))
    // const imageElements = $('table')
    // expect(imageElements.length).to.equal(1)
  }).timeout(50000)
})
