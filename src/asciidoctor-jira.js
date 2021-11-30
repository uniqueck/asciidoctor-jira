// @ts-check
const Jira = require('./Jira.js')
require('dotenv').config()

function jiraIssuesBlockMacro (context) {
  return function () {
    const self = this
    self.named('jiraIssues')
    self.positionalAttributes(['target', 'jql'])
    self.process((parent, target, attrs) => {
      const doc = parent.getDocument()
      const projectKey = target
      const jql = attrs.jql || "resolution='Unresolved' ORDER BY priority DESC, duedate ASC"
      const jiraClient = new Jira(doc)
      const issues = jiraClient.searchIssues(jql)

      var content = []
      content.push('[options=\"header\",cols=\"2,1,1,2,6\"]')
      content.push('|====')
      content.push('|ID | Priority | Created | Assignee | Summary')

      for (var i=0; i< issues.length; i++) {
        var issue = issues[i]
        content.push('|' + issue.key );
        content.push('|' + issue.fields.priority.name);
        content.push('|' + issue.fields.created);
        content.push('|' + (issue.fields.assignee && issue.fields.assignee.displayName) || 'not assigned');
        content.push('|' + issue.fields.summary);
      }
      content.push('|====')
      console.log(content.join('\n'))


      return self.parseContent(parent, content.join('\n'), Opal.hash(attrs))

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
      var title = issueKey
      if (displayFormat == 'long') {
        title += issue.fields.summary
      }
      const jiraBaseUrl = doc.getAttribute('jira-host') || process.env.AJE_JIRABASEURL;
      var issueLink = jiraBaseUrl + "/browse/" + issueKey
      return self.createInline(parent, 'anchor', title, { type: "link", target: issueLink }).convert()
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
