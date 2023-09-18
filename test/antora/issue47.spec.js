/* global describe before it */
const { rimrafSync } = require('rimraf')
const cheerio = require('cheerio')
const fs = require('fs')
const chai = require('chai')
const expect = chai.expect
const path = require('path')

const generateSite = require('@antora/site-generator-default')

describe('Antora integration', () => {
  before(async function () {
    this.timeout(50000)
    rimrafSync(path.join(__dirname, 'public'), {})
    await generateSite([`--playbook=${path.join(__dirname, 'antora-playbook.yml')}`])
  })
  it('blockmacro: custom field with type number', async () => {
    const $ = cheerio.load(fs.readFileSync(path.join(__dirname, 'public/antora-jira/blockmacro/issue_47.html')))
    const tableElement = $('h2[id="_issue_47"]').parent().find('table')
    /* eslint-disable no-unused-expressions */
    expect(tableElement).to.not.be.null
    const thElements = $(tableElement).find('thead tr th')
    expect(thElements).to.not.be.null
    expect(thElements.length).to.equal(2)

    // check column header story points
    const thElement = thElements.get(1)
    expect(thElement).to.not.be.null
    expect($(thElement).text()).to.equal('Storypoints')

    // select table rows with content
    const trElements = $(tableElement).find('tbody tr')
    expect(trElements).to.not.be.null
    expect(trElements.length).to.equal(6)

    let trElement = trElements.get(0)

    let tdElements = $(trElement).find('td')
    expect(tdElements).to.not.be.null
    expect(tdElements.length).to.equal(2)

    let tdElement = tdElements.get(1)
    expect($(tdElement).text()).to.equal('-')

    trElement = trElements.get(2)

    tdElements = $(trElement).find('td')
    expect(tdElements).to.not.be.null
    expect(tdElements.length).to.equal(2)

    tdElement = tdElements.get(1)
    expect($(tdElement).text()).to.equal('1')
  })
})
