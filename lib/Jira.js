const sendRequest = require('./common/request')
const path = require('path')

class Jira {
  constructor (doc, jiraConfig) {
    this.doc = doc
    this.jiraConfig = jiraConfig
  }

  request (method, url, options = {}) {
    return sendRequest(method, url, options, this.jiraConfig.proxy)
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

  searchIssues (jql, fields) {
    const data = { jql, fields: fields.join(',') }
    let issues
    try {
      if (this.jiraConfig.authUrl) {
        // OAuth 2.0 (client credentials) authentication
        this.retrieveOAuthAccessToken(this.jiraConfig)
      }
      this.retrieveCloudIdAndFrontendUrl(this.jiraConfig)
      const headers = Object.assign({}, this.jiraConfig.auth, {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      })

      const jiraRestApiSearchEndpoint = this.jiraConfig.baseUrl + '/rest/api/3/search/jql'
      const res = this.request('GET', jiraRestApiSearchEndpoint, {
        headers,
        qs: data
      })
      issues = []
      this.doc.getLogger().debug(`Received response with status code ${res.statusCode} from jira instance.`)
      switch (res.statusCode) {
        case 200: {
          if (res.headers['x-seraph-loginreason'] === 'AUTHENTICATED_FAILED') {
            this.doc.getLogger().error(`Authentication failed for jira instance ${this.jiraConfig.baseUrl}.`)
          } else {
            issues = JSON.parse(res.getBody('utf-8')).issues
            this.doc.getLogger().debug(`Successfully retrieved ${issues.length} issues from jira instance.`)
          }
          break
        }
        case 400: {
          const resBody = JSON.parse(Buffer.from(res.body).toString('utf-8'))
          const errorMessages = resBody.errorMessages
          for (const errorMessage of errorMessages) {
            this.doc.getLogger().error(`${JSON.stringify(data)} - ${errorMessage}`)
          }
          break
        }
        case 401: {
          const resBody = JSON.parse(Buffer.from(res.body).toString('utf-8'))
          const errorMessages = resBody.errorMessages
          for (const errorMessage of errorMessages) {
            this.doc.getLogger().error(`${JSON.stringify(data)} - ${errorMessage}`)
          }
          break
        }
      }
    } catch (err) {
      this.doc.getLogger().error(err instanceof Error ? err.stack : JSON.stringify(err))
      issues = []
    }
    return issues
  }

  searchIssue (issueKey, fields) {
    const data = { jql: 'issueKey=' + issueKey, fields: fields.join(',') }
    let result
    try {
      if (this.jiraConfig.authUrl) {
        // OAuth 2.0 (client credentials) authentication
        this.retrieveOAuthAccessToken(this.jiraConfig)
      }
      this.retrieveCloudIdAndFrontendUrl(this.jiraConfig)
      const headers = Object.assign({}, this.jiraConfig.auth, {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      })

      const jiraRestApiSearchEndpoint = this.jiraConfig.baseUrl + '/rest/api/3/search/jql'
      const res = this.request('GET', jiraRestApiSearchEndpoint, {
        headers,
        qs: data
      })
      if (res.statusCode === 200) {
        if (res.headers['x-seraph-loginreason'] === 'AUTHENTICATED_FAILED') {
          this.doc.getLogger().error(`Authentication failed for jira instance ${this.jiraConfig.baseUrl}.`)
        } else {
          result = JSON.parse(res.getBody('utf-8')).issues[0]
        }
      }
    } catch (err) {
      this.doc.getLogger().error(err instanceof Error ? err.stack : JSON.stringify(err))
    }
    return result
  }

  retrieveCloudIdAndFrontendUrl (jiraConfig) {
    if (jiraConfig.cloudId && jiraConfig.frontendUrl && jiraConfig.baseUrl) {
      this.doc.getLogger().debug('Reuse existing cloud id and frontend url for jira client.')
      return
    }
    let response
    try {
      const headers = Object.assign({}, jiraConfig.auth, {
        'Content-Type': 'application/json'
      })
      response = this.request('GET', 'https://api.atlassian.com/oauth/token/accessible-resources', {
        headers
      })
    } catch (err) {
      throw new Error(`Unexpected error occurs on obtaining cloud id. ${JSON.stringify(err)}`)
    }
    if (response.statusCode === 200) {
      const resContent = JSON.parse(response.getBody('utf-8'))
      const matchedCloud = resContent.find(cloud => cloud.name === jiraConfig.cloudIdName)
      if (matchedCloud) {
        jiraConfig.cloudId = matchedCloud.id
        jiraConfig.baseUrl = jiraConfig.restApiBaseUrl + `${jiraConfig.cloudId}`
        jiraConfig.frontendUrl = matchedCloud.url
      } else {
        throw new Error(`Failed to find matched cloud id for cloud name: '${jiraConfig.cloudIdName}'. [${JSON.stringify(resContent.map(cloud => ({ name: cloud.name, id: cloud.id })))}]`)
      }
    } else {
      throw new Error(`Failed to obtain cloud id. Status code: ${response.statusCode}, Response body: ${response.getBody('utf-8')}`)
    }
  }

  retrieveOAuthAccessToken (jiraConfig) {
    if (!jiraConfig.auth) {
      try {
        let body = ''
        const params = {
          grant_type: 'client_credentials',
          client_id: jiraConfig.clientId,
          client_secret: jiraConfig.clientSecret
        }
        Object.entries(params).forEach(([key, value]) => {
          body += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`
        })
        const response = this.request('POST', jiraConfig.authUrl, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: body.slice(0, -1)
        })
        if (response.statusCode === 200) {
          jiraConfig.auth = { Authorization: `Bearer ${JSON.parse(response.getBody('utf-8')).access_token}` }
        } else {
          throw new Error(`Failed to obtain access token for OAuth 2.0 authentication. Status code: ${response.statusCode}, Response body: ${response.getBody('utf-8')}`)
        }
      } catch (err) {
        throw new Error(`Unexpected error occurs on obtaining access token for OAuth 2.0 authentication. ${JSON.stringify(err)}`)
      }
    } else {
      this.doc.getLogger().debug('Reuse existing auth header for jira client.')
    }
  }
}

module.exports = Jira
