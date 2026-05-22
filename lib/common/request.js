const { spawnSync } = require('child_process')
const path = require('path')

const workerPath = path.join(__dirname, 'request-worker.js')

const request = (method, url, options = {}, proxy = null) => {
  const result = spawnSync(process.execPath, [workerPath], {
    input: JSON.stringify({ method, url, options, proxy }),
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    windowsHide: true
  })

  if (result.error) {
    throw result.error
  }
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || `Request worker exited with code ${result.status}`).trim())
  }

  const response = JSON.parse(result.stdout)
  return {
    statusCode: response.statusCode,
    headers: response.headers,
    body: Buffer.from(response.body, 'base64'),
    url: response.url,
    getBody (encoding) {
      if (this.statusCode >= 300) {
        const err = new Error(
          'Server responded with status code ' +
          this.statusCode +
          ':\n' +
          this.body.toString(encoding)
        )
        err.statusCode = this.statusCode
        err.headers = this.headers
        err.body = this.body
        throw err
      }
      return encoding ? this.body.toString(encoding) : this.body
    }
  }
}

module.exports = request
