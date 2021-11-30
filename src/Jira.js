
var request = require('sync-request');

class Jira {
  constructor(doc) {
    this.doc = doc
  }

  searchIssues(jql) {
    const data = {jql: jql, fields: 'created,resolutiondate,priority,summary,timeoriginalestimate,assignee,issuetype'}
    let issues
    try {
      const jiraBaseUrl = this.doc.getAttribute('jira-host') || process.env.AJE_JIRABASEURL;
      const jiraRestApiSearchEndpoint = jiraBaseUrl + '/rest/api/2/search';
      const jiraUserName = this.doc.getAttribute('jira-username') || process.env.AJE_USERNAME
      const jiraApiToken = this.doc.getAttribute('jira-apitoken') || process.env.AJE_APITOKEN || process.env.AJE_PASSWORD
      const auth = 'Basic ' + Buffer.from(jiraUserName + ':' + jiraApiToken).toString('base64')
      var headers = {
        authorization: auth
      }
      var res = request('GET', jiraRestApiSearchEndpoint, {
        headers: headers,
        qs: data
      });
      issues = JSON.parse(res.getBody('utf-8')).issues
    } catch (err) {
      console.log(err)
      issues = null
    }
    return issues
  }

  searchIssue(issueKey) {
     const data = {jql: 'issueKey=' + issueKey, fields: 'created,resolutiondate,priority,summary,timeoriginalestimate,assignee,issuetype'}
     let result
     try {
       const jiraBaseUrl = this.doc.getAttribute('jira-host') || process.env.AJE_JIRABASEURL;
       const jiraRestApiSearchEndpoint = jiraBaseUrl + '/rest/api/2/search';
       const jiraUserName = this.doc.getAttribute('jira-username') || process.env.AJE_USERNAME
       const jiraApiToken = this.doc.getAttribute('jira-apitoken') || process.env.AJE_APITOKEN || process.env.AJE_PASSWORD
       const auth = 'Basic ' + Buffer.from(jiraUserName + ':' + jiraApiToken).toString('base64')
       var headers = {
         authorization: auth
       }
       var res = request('GET', jiraRestApiSearchEndpoint, {
         headers: headers,
         qs: data
       });
       result = JSON.parse(res.getBody('utf-8')).issues[0]
     } catch (err) {
       console.log(err)
       result = null
     }
     return result
  }



}


module.exports = Jira;
