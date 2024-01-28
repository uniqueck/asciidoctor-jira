const Jira = require('../Jira')

function jiraIssueInlineMacro (context) {
  return function () {
    const self = this
    self.named('jira')
    self.positionalAttributes(['format'])
    self.process((parent, target, attrs) => {
      const doc = parent.getDocument()
      const issueKey = target
      const jiraConfig = require('../common/jiraConfig').createConfig('', doc, target, attrs, context.logger)
      const displayFormat = attrs.format || doc.getAttribute('jira-inline-format') || 'short'
      const jiraClient = new Jira(doc, jiraConfig.auth, jiraConfig.baseUrl)
      const issue = jiraClient.searchIssue(issueKey, ['summary'])
      let title = issueKey
      if (displayFormat === 'long') {
        title += issue.fields.summary
      }
      const issueLink = require('../common/utils').createLinkToIssue(doc.getAttribute('jira-baseurl') || process.env.JIRA_BASEURL, issueKey)
      return self.createInline(parent, 'anchor', title, { type: 'link', target: issueLink }).convert()
    })
  }
}

module.exports = {
  inlineMacro: (context) => {
    return jiraIssueInlineMacro(context)
  }
}
