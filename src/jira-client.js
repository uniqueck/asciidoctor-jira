const request = require('sync-request')
const path = require('path')

class JiraClient {
  constructor (doc) {
    this.doc = doc
    this.jiraBaseUrl = doc.getAttribute('jira-baseurl') || process.env.JIRA_BASEURL
    const jiraUserName = this.doc.getAttribute('jira-username') || process.env.JIRA_USERNAME
    const jiraApiToken = this.doc.getAttribute('jira-apitoken') || process.env.JIRA_APITOKEN
    if (jiraUserName !== undefined && jiraApiToken !== undefined) {
      const auth = 'Basic ' + Buffer.from(jiraUserName + ':' + jiraApiToken).toString('base64')
      this.headers = { authorization: auth }
    } else {
      this.headers = {}
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
    const data = { jql, fields }
    let issues
    try {
      const res = request('GET', `${this.jiraBaseUrl}/rest/api/2/search`, {
        headers: this.headers,
        qs: data
      })
      issues = JSON.parse(res.getBody('utf-8')).issues
    } catch (err) {
      this.logError(err)
      issues = null
    }
    return issues
  }

  searchIssue (issueKey, fields) {
    const data = { jql: `issueKey=${issueKey}`, fields }
    let result = {}
    try {
      const res = request('GET', `${this.jiraBaseUrl}/rest/api/2/search`, {
        headers: this.headers,
        qs: data
      })
      result = JSON.parse(res.getBody('utf-8')).issues[0]
    } catch (err) {
      this.logError(err)
    }
    return result
  }

  createLinkToIssue (issue) {
    return `${this.jiraBaseUrl}/browse/${issue}`
  }

  logError (err) {
    // noinspection JSUnresolvedVariable
    const errorMessages = JSON.parse(err.body).errorMessages.join(',')
    this.doc.getLogger().error(`Request for '${err.url}' response with status code '${err.statusCode}' and detail message '${errorMessages}'`)
  }
}

module.exports = JiraClient
