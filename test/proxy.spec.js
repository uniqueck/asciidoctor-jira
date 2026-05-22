/* global describe it */
const chai = require('chai')
const expect = chai.expect

const { createProxyAgent, getProxyForUrl, shouldBypassProxy } = require('../lib/common/proxy')

const fullProxy = {
  http: 'http://proxy.internal:8080',
  https: 'http://proxy.internal:8443',
  no_proxy: 'jira.example.com,.internal.example'
}

describe('Proxy support', () => {
  it('uses jira proxy config and respects no_proxy', () => {
    expect(getProxyForUrl('https://api.atlassian.com/rest/api/3/search', fullProxy)).to.equal('http://proxy.internal:8443')
    expect(getProxyForUrl('http://jira.example.com/rest/api/3/search', fullProxy)).to.equal(null)
    expect(shouldBypassProxy('https://docs.internal.example/rest/api/3/search', fullProxy)).to.equal(true)
    expect(shouldBypassProxy('https://jira.example.com:8443/rest/api/3/search', {
      no_proxy: 'jira.example.com:443'
    })).to.equal(false)
  })

  it('falls back to the http proxy for https requests', () => {
    expect(getProxyForUrl('https://jira.example.com/rest/api/3/search', {
      http: 'http://proxy.internal:8080'
    })).to.equal('http://proxy.internal:8080')
  })

  it('creates protocol-specific proxy agents only when a request should be proxied', () => {
    const httpAgent = createProxyAgent('http://jira.example.com/rest/api/3/search', {
      http: 'http://proxy.internal:8080'
    })
    expect(httpAgent.constructor.name).to.equal('HttpProxyAgent')

    const httpsAgent = createProxyAgent('https://jira.example.com/rest/api/3/search', {
      https: 'http://proxy.internal:8443'
    })
    expect(httpsAgent.constructor.name).to.equal('HttpsProxyAgent')

    expect(createProxyAgent('https://jira.example.com/rest/api/3/search', {
      https: 'http://proxy.internal:8443',
      no_proxy: 'jira.example.com'
    })).to.equal(null)
  })

  it('ignores malformed URL-like no_proxy entries', () => {
    expect(shouldBypassProxy('https://docs.example.com/rest/api/3/search', {
      no_proxy: 'http://*.example.com'
    })).to.equal(false)

    expect(shouldBypassProxy('https://jira.example.com/rest/api/3/search', {
      no_proxy: 'http://*.example.com,jira.example.com'
    })).to.equal(true)
  })
})
