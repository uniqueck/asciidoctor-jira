const Jira = require('../Jira')

function jiraIssueInlineMacro (context) {
  return function () {
    const self = this
    self.named('jira')
    self.positionalAttributes(['format'])
    self.process((parent, target, attrs) => {
      const doc = parent.getDocument()
      const issueKey = target
      const jiraConfig = require('../common/jiraConfig').createConfig(parent, attrs)
      const displayFormat = attrs.format || doc.getAttribute('jira-inline-format') || 'short'
      const jiraClient = new Jira(doc, jiraConfig)
      const issue = jiraClient.searchIssue(issueKey, ['summary'])
      let title = issueKey
      if (displayFormat === 'long' && issue && issue.fields && issue.fields.summary) {
        title += ' - ' + issue.fields.summary
      }
      if (!jiraConfig.frontendUrl) {
        return title
      }
      const issueLink = require('../common/utils').createLinkToIssue(jiraConfig.frontendUrl, issueKey)
      return self.createInline(parent, 'anchor', title, { type: 'link', target: issueLink }).convert()
    })
  }
}

module.exports = {
  inlineMacro: (context) => {
    return jiraIssueInlineMacro(context)
  }
}
