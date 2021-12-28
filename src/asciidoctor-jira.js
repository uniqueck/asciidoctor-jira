/* global
  Opal
*/

// @ts-check
const Jira = require('./Jira.js')
require('dotenv').config()

function jiraIssuesBlockMacro (context) {
  return function () {
    const self = this
    self.named('jira')
    self.positionalAttributes(['jql'])
    self.process((parent, target, attrs) => {
      const doc = parent.getDocument()
      const jql = attrs.jql || "resolution='Unresolved' ORDER BY priority DESC, key ASC, duedate ASC"
      const jiraClient = new Jira(doc)
      const issues = jiraClient.searchIssues(jql)

      const content = []
      content.push('[options="header",cols="2,1,1,2,6"]')
      content.push('|====')
      content.push('|ID | Priority | Created | Assignee | Summary')

      for (let i = 0; i < issues.length; i++) {
        const issue = issues[i]
        content.push('a|jira:' + issue.key + '[]')
        content.push('|' + issue.fields.priority.name)
        content.push('|' + issue.fields.created)
        const assignee = issue.fields.assignee ? issue.fields.assignee.displayName : 'not assigned'
        content.push('|' + assignee)
        content.push('|' + issue.fields.summary)
      }
      content.push('|====')

      self.parseContent(parent, content.join('\n'), Opal.hash(attrs))

      return undefined
    })
  }
}

function jiraIssueInlineMacro (context) {
  return function () {
    const self = this
    self.named('jira')
    self.positionalAttributes(['format'])
    self.process((parent, target, attrs) => {
      const doc = parent.getDocument()
      const displayFormat = attrs.format || doc.getAttribute('jira-inline-format') || 'short'
      const issueKey = target
      const jiraClient = new Jira(doc)
      const issue = jiraClient.searchIssue(issueKey)
      let title = issueKey
      if (displayFormat === 'long') {
        title += issue.fields.summary
      }
      const jiraBaseUrl = doc.getAttribute('jira-host') || process.env.AJE_JIRABASEURL
      const issueLink = jiraBaseUrl + '/browse/' + issueKey
      return self.createInline(parent, 'anchor', title, { type: 'link', target: issueLink }).convert()
    })
  }
}

module.exports.register = function register (registry, context = {}) {
  if (typeof registry.register === 'function') {
    registry.register(function () {
      this.blockMacro(jiraIssuesBlockMacro(context))
      this.inlineMacro(jiraIssueInlineMacro(context))
    })
  } else if (typeof registry.block === 'function') {
    registry.blockMacro(jiraIssuesBlockMacro(context))
    registry.inlineMacro(jiraIssueInlineMacro(context))
  }
  return registry
}
