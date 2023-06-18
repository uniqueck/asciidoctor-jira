
const rimrafSync = require('rimraf')
const cheerio = require('cheerio')
const fs = require('fs')
const existsFile = fs.existsSync
const chai = require('chai')
const expect = chai.expect

const generateSite = require('@antora/site-generator-default')

describe('Antora integration', () => {
  before(async function () {
    this.timeout(50000)
    rimrafSync(`${__dirname}/public`, function (error) {})
    await generateSite([`--playbook=${__dirname}/antora-playbook.yml`])
  })
  it('blockmacro: default jql', async () => {
    const $ = cheerio.load(fs.readFileSync(`${__dirname}/public/antora-jira/blockmacro.html`))
    const tableElement = $('h3[id="_defaults"]').parent().find('table')
    expect(tableElement).to.not.be.null
    const thElements = $(tableElement).find('thead tr th')
    expect(thElements).to.not.be.null
    expect(thElements.length).to.equal(5)

    // check column header ID
    let thElement = thElements.get(0)
    expect(thElement).to.not.be.null
    expect($(thElement).text()).to.equal('ID')

    // check column header Priority
    thElement = thElements.get(1)
    expect(thElement).to.not.be.null
    expect($(thElement).text()).to.equal('Priority')

    // check column header Created
    thElement = thElements.get(2)
    expect(thElement).to.not.be.null
    expect($(thElement).text()).to.equal('Created')

    // check column header Assignee
    thElement = thElements.get(3)
    expect(thElement).to.not.be.null
    expect($(thElement).text()).to.equal('Assignee')

    // check column header Summary
    thElement = thElements.get(4)
    expect(thElement).to.not.be.null
    expect($(thElement).text()).to.equal('Summary')

    // select table rows with content
    const trElements = $(tableElement).find('tbody tr')
    expect(trElements).to.not.be.null
    expect(trElements.length).to.equal(6)

    const trElement = trElements.get(5)

    expect(trElement).to.not.be.null
    const tdElements = $(trElement).find('td')
    expect(tdElements).to.not.be.null
    expect(tdElements.length).to.equal(5)

    let tdElement = tdElements.get(0)
    const imageElement = $(tdElement).find('div div p span img')
    expect(imageElement).to.not.be.null
    expect($(imageElement).attr('src')).to.equal('_images/jira-issuetype-epic.svg')
    expect(existsFile(`${__dirname}/public/antora-jira/_images/jira-issuetype-epic.svg`))
    expect($($(tdElement).find('div div p a')).attr('href')).to.equal('https://uniqueck.atlassian.net/browse/DOC-6')

    // column summary
    tdElement = tdElements.get(4)
    expect($(tdElement).text()).to.equal('Summary containing a | pipe')
  })
  it('blockmacro: define a custom jql', async () => {
    const $ = cheerio.load(fs.readFileSync(`${__dirname}/public/antora-jira/blockmacro.html`))
    const tableElement = $('h3[id="_custom_jql"]').parent().find('table')
    expect(tableElement).to.not.be.null
    expect($(tableElement).find('caption').text()).to.equal('Table 1. custom')
    const thElements = $(tableElement).find('thead tr th')
    expect(thElements).to.not.be.null
    expect(thElements.length).to.equal(5)
    // check column header ID
    let thElement = thElements.get(0)
    expect(thElement).to.not.be.null
    expect($(thElement).text()).to.equal('ID')

    // check column header Priority
    thElement = thElements.get(1)
    expect(thElement).to.not.be.null
    expect($(thElement).text()).to.equal('Priority')

    // check column header Created
    thElement = thElements.get(2)
    expect(thElement).to.not.be.null
    expect($(thElement).text()).to.equal('Created')

    // check column header Assignee
    thElement = thElements.get(3)
    expect(thElement).to.not.be.null
    expect($(thElement).text()).to.equal('Assignee')

    // check column header Summary
    thElement = thElements.get(4)
    expect(thElement).to.not.be.null
    expect($(thElement).text()).to.equal('Summary')

    // select table rows with content
    const trElements = $(tableElement).find('tbody tr')
    expect(trElements).to.not.be.null
    expect(trElements.length).to.equal(1)

    const trElement = trElements.get(0)
    expect(trElement).to.not.be.null
    const tdElements = $(trElement).find('td')
    expect(tdElements).to.not.be.null
    expect(tdElements.length).to.equal(5)

    // column id
    let tdElement = tdElements.get(0)
    const imageElement = $(tdElement).find('div div p span img')
    expect(imageElement).to.not.be.null
    expect($(imageElement).attr('src')).to.equal('_images/jira-issuetype-story.svg')
    expect(existsFile(`${__dirname}/public/antora-jira/_images/jira-issuetype-story.svg`))
    expect($($(tdElement).find('div div p a')).attr('href')).to.equal('https://uniqueck.atlassian.net/browse/DOC-1')

    // column priority
    tdElement = tdElements.get(1)
    expect($(tdElement).text()).to.equal('Medium')

    // column created
    tdElement = tdElements.get(2)
    expect($(tdElement).text()).to.equal('2021-08-08T12:13:19.203+0200')

    // column assignee
    tdElement = tdElements.get(3)
    expect($(tdElement).text()).to.equal('Constantin Krüger')

    // column summary
    tdElement = tdElements.get(4)
    expect($(tdElement).text()).to.equal('Test123')
  })
  it('blockmacro: define custom fields', async () => {
    const $ = cheerio.load(fs.readFileSync(`${__dirname}/public/antora-jira/blockmacro.html`))
    const tableElement = $('h3[id="_custom_fields"]').parent().find('table')
    expect(tableElement).to.not.be.null

    const thElements = $(tableElement).find('thead tr th')
    expect(thElements).to.not.be.null
    expect(thElements.length).to.equal(2)

    const thElement = thElements.get(1)
    expect(thElement).to.not.be.null
    expect($(thElement).text()).to.equal('status')

    // table data

    // select table rows with content
    const trElements = $(tableElement).find('tbody tr')
    expect(trElements).to.not.be.null
    expect(trElements.length).to.equal(6)

    const trElement = trElements.get(0)
    expect(trElement).to.not.be.null
    const tdElements = $(trElement).find('td')
    expect(tdElements).to.not.be.null
    expect(tdElements.length).to.equal(2)

    // column id
    let tdElement = tdElements.get(0)
    expect($(tdElement).find('div > div > p')).to.not.be.null
    expect($(tdElement).find('div > div > p').children.length).to.equal(1)
    expect($(tdElement).find('div > div > p > a')).to.not.be.null
    expect($(tdElement).find('div > div > p > a').attr('href')).to.equal('https://uniqueck.atlassian.net/browse/DOC-1')
  })
  it('blockmacro: define nested custom fields', async () => {
    const $ = cheerio.load(fs.readFileSync(`${__dirname}/public/antora-jira/blockmacro.html`))
    const tableElement = $('h3[id="_nested_custom_fields"]').parent().find('table')
    expect(tableElement).to.not.be.null

    const thElements = $(tableElement).find('thead tr th')
    expect(thElements).to.not.be.null
    expect(thElements.length).to.equal(2)

    const thElement = thElements.get(1)
    expect(thElement).to.not.be.null
    expect($(thElement).text()).to.equal('Reporter')
  })
  it('inlinemacro: standard', async () => {
    const $ = cheerio.load(fs.readFileSync(`${__dirname}/public/antora-jira/inlinemacro.html`))
    const anchorElement = $('h3[id="_defaults"]').parent().find('p a')
    expect(anchorElement).to.not.be.null
    expect($(anchorElement).attr('href')).to.not.be.null
    expect($(anchorElement).attr('href')).to.equal('https://uniqueck.atlassian.net/browse/DOC-1')
    expect($(anchorElement).text()).to.equal('DOC-1')
  })
})
