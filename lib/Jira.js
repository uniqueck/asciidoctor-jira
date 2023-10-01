const request = require('sync-request')
const path = require('path')

class Jira {
  constructor (doc, jiraUserName, jiraApiToken, jiraBaseUrl) {
    this.doc = doc
    this.jiraBaseUrl = jiraBaseUrl
    const auth = 'Basic ' + Buffer.from(jiraUserName + ':' + jiraApiToken).toString('base64')
    this.headers = {
      authorization: auth
    }
  }

  getDirPath () {
    const imagesOutputDir = this.doc.getAttribute('imagesoutdir')
    const outDir = this.doc.getAttribute('outdir')
    const toDir = this.doc.getAttribute('to_dir')
    const baseDir = this.doc.getBaseDir()
    const imagesDir = this.doc.getAttribute('imagesdir') || ''
    let dirPath
    if (imagesOutputDir) {
      dirPath = imagesOutputDir
    } else if (outDir) {
      dirPath = path.join(outDir, imagesDir)
    } else if (toDir) {
      dirPath = path.join(toDir, imagesDir)
    } else {
      dirPath = path.join(baseDir, imagesDir)
    }
    return dirPath
  }

  download (imageName, imageUrl, vfs) {
    const exists = typeof vfs !== 'undefined' && typeof vfs.exists === 'function' ? vfs.exists : require('./node-fs.js').exists
    const read = typeof vfs !== 'undefined' && typeof vfs.read === 'function' ? vfs.read : require('./node-fs.js').read
    const add = typeof vfs !== 'undefined' && typeof vfs.add === 'function' ? vfs.add : require('./node-fs.js').add

    const dirPath = this.getDirPath()
    const filePath = path.format({ dir: dirPath, base: imageName })
    const encoding = 'binary'
    const mediaType = 'image/svg+xml'

    const contents = exists(filePath) ? read(filePath, encoding) : request('GET', imageUrl, { headers: this.headers }).getBody('utf-8')
    add({
      relative: dirPath,
      basename: imageName,
      mediaType,
      contents: Buffer.from(contents, encoding)
    })
  }

  searchIssues (jql, fields) {
    const data = { jql, fields: fields.join(',') }
    let issues
    try {
      const jiraRestApiSearchEndpoint = this.jiraBaseUrl + '/rest/api/2/search'
      const res = request('GET', jiraRestApiSearchEndpoint, {
        headers: this.headers,
        qs: data
      })
      if (res.statusCode === 200) {
        if (res.headers['x-seraph-loginreason'] === 'AUTHENTICATED_FAILED') {
          this.doc.getLogger().error(`Authentication failed for jira instance ${this.jiraBaseUrl}.`)
          issues = []
        } else {
          issues = JSON.parse(res.getBody('utf-8')).issues
        }
      }
    } catch (err) {
      this.doc.getLogger().error(`Unexpected error occurs on requesting jira instance for issues. ${JSON.stringify(err)}`)
      issues = []
    }
    return issues
  }

  searchIssue (issueKey, fields) {
    const data = { jql: 'issueKey=' + issueKey, fields: fields.join(',') }
    let result
    try {
      const jiraRestApiSearchEndpoint = this.jiraBaseUrl + '/rest/api/2/search'
      const res = request('GET', jiraRestApiSearchEndpoint, {
        headers: this.headers,
        qs: data
      })
      if (res.statusCode === 200) {
        if (res.headers['x-seraph-loginreason'] === 'AUTHENTICATED_FAILED') {
          this.doc.getLogger().error(`Authentication failed for jira instance ${this.jiraBaseUrl}.`)
        } else {
          result = JSON.parse(res.getBody('utf-8')).issues[0]
        }
      }
    } catch (err) {
      this.doc.getLogger().error(`Unexpected error occurs on requesting jira instance for issue ${issueKey}. ${JSON.stringify(err)}`)
    }
    return result
  }
}

module.exports = Jira
