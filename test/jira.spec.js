/* global describe it beforeEach */
const chai = require('chai')
const expect = chai.expect
const Jira = require('../lib/Jira')

const response = (statusCode, contentType, body) => ({
  statusCode,
  headers: { 'content-type': contentType },
  body: Buffer.from(body),
  getBody (encoding) {
    return this.body.toString(encoding)
  }
})

const TOMCAT_400 = '<!doctype html><html lang="en"><head><title>HTTP Status 400 – Bad Request</title>' +
  '<style type="text/css">body {font-family:Tahoma,Arial,sans-serif;}</style></head>' +
  '<body><h1>HTTP Status 400 – Bad Request</h1></body></html>'

describe('Jira search', () => {
  let errors
  let calls
  let jira

  beforeEach(() => {
    errors = []
    calls = []
    const doc = { getLogger: () => ({ debug () {}, error (message) { errors.push(message) } }) }
    jira = new Jira(doc, {
      auth: { Authorization: 'Bearer test' },
      cloudId: 'cloud',
      frontendUrl: 'https://example.atlassian.net',
      baseUrl: 'https://api.atlassian.com/ex/jira/cloud'
    })
  })

  const stub = (res) => {
    jira.request = (method, url, options) => {
      calls.push({ method, url, options })
      return res
    }
  }

  it('sends the JQL as JSON body of a POST request', () => {
    stub(response(200, 'application/json', JSON.stringify({ issues: [{ key: 'DOC-1' }] })))

    const jql = "project = DOC and component in ('a','b','c','d','e')"
    const issues = jira.searchIssues(jql, ['summary', 'status'])

    expect(issues).to.deep.equal([{ key: 'DOC-1' }])
    expect(calls).to.have.lengthOf(1)
    expect(calls[0].method).to.equal('POST')
    expect(calls[0].url).to.equal('https://api.atlassian.com/ex/jira/cloud/rest/api/3/search/jql')
    expect(calls[0].options.json).to.deep.equal({ jql, fields: ['summary', 'status'] })
    expect(calls[0].options).to.not.have.property('qs')
    expect(calls[0].options.headers.Authorization).to.equal('Bearer test')
    expect(errors).to.deep.equal([])
  })

  it('logs a readable error for a non-JSON error page instead of a JSON parse error', () => {
    stub(response(400, 'text/html;charset=utf-8', TOMCAT_400))

    const issues = jira.searchIssues('project = DOC', ['summary'])

    expect(issues).to.deep.equal([])
    expect(errors).to.have.lengthOf(1)
    expect(errors[0]).to.contain('HTTP 400 (text/html;charset=utf-8): HTTP Status 400 – Bad Request')
    expect(errors[0]).to.not.contain('SyntaxError')
    expect(errors[0]).to.not.contain('font-family')
  })

  it('logs Jira error messages of a JSON error response', () => {
    stub(response(400, 'application/json', JSON.stringify({ errorMessages: ["Field 'foo' does not exist."] })))

    const issues = jira.searchIssues('foo = bar', ['summary'])

    expect(issues).to.deep.equal([])
    expect(errors).to.deep.equal(['{"jql":"foo = bar","fields":"summary"} - Field \'foo\' does not exist.'])
  })

  it('searches a single issue with a POST request', () => {
    stub(response(200, 'application/json', JSON.stringify({ issues: [{ key: 'DOC-7' }] })))

    const issue = jira.searchIssue('DOC-7', ['summary'])

    expect(issue).to.deep.equal({ key: 'DOC-7' })
    expect(calls[0].method).to.equal('POST')
    expect(calls[0].options.json).to.deep.equal({ jql: 'issueKey=DOC-7', fields: ['summary'] })
  })
})
