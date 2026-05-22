/* global describe it afterEach */
const chai = require('chai')
const expect = chai.expect
const childProcess = require('child_process')

const requestModulePath = require.resolve('../lib/common/request')
const originalSpawnSync = childProcess.spawnSync

describe('Request worker handoff', () => {
  afterEach(() => {
    childProcess.spawnSync = originalSpawnSync
    delete require.cache[requestModulePath]
  })

  it('forwards proxy config to the request worker payload', () => {
    const proxy = {
      http: 'http://proxy.internal:8080',
      https: 'http://proxy.internal:8443',
      no_proxy: 'jira.example.com'
    }

    childProcess.spawnSync = (command, args, options) => {
      expect(command).to.equal(process.execPath)
      expect(args).to.be.an('array').with.lengthOf(1)

      const payload = JSON.parse(options.input)
      expect(payload).to.deep.equal({
        method: 'GET',
        url: 'https://api.atlassian.com/ex/jira/test',
        options: { headers: { Accept: 'application/json' } },
        proxy
      })

      return {
        status: 0,
        stdout: JSON.stringify({
          statusCode: 200,
          headers: {},
          body: Buffer.from('ok').toString('base64'),
          url: payload.url
        })
      }
    }

    delete require.cache[requestModulePath]
    const request = require('../lib/common/request')
    const response = request('GET', 'https://api.atlassian.com/ex/jira/test', {
      headers: { Accept: 'application/json' }
    }, proxy)

    expect(response.statusCode).to.equal(200)
    expect(response.getBody('utf-8')).to.equal('ok')
  })
})
