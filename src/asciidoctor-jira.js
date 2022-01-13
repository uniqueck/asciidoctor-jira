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
      const jql = attrs.jql || 'resolution="Unresolved" ORDER BY priority DESC, key ASC, duedate ASC'
      const customFields = attrs.customFieldIds || 'priority,created,assignee,issuetype,summary'
      const jiraClient = new Jira(doc)
      const issues = jiraClient.searchIssues(jql, customFields)

      const headers = createHeaders(doc, customFields)
      const customFieldsArray = customFields.split(',').filter(item => item !== 'issuetype')

      const content = []
      content.push('[options="header"]')
      content.push('|====')
      content.push('|' + headers.join('|'))

      for (let i = 0; i < issues.length; i++) {
        const issue = issues[i]
        let idColumn = 'a|'
        if (issue.fields.issuetype) {
          const issueTypeName = issue.fields.issuetype.name
          const issueTypeIconUrl = issue.fields.issuetype.iconUrl
          const imageName = `jira-issuetype-${issueTypeName.toLowerCase()}.svg`
          jiraClient.download(imageName, issueTypeIconUrl, context.vfs)
          idColumn += `image:${imageName}[]`
        }
        idColumn += `${createLinkToIssue(doc, issue.key)}[${issue.key}]`
        content.push(idColumn)

        for (let j = 0; j < customFieldsArray.length; j++) {
          let value
          if (!issue.fields[customFieldsArray[j]]) {
            console.warn(`Examining issue '${JSON.stringify(issue, null, 2)}' for custom field '${customFieldsArray[j]}', but was not found.`)
            value = '-'
          } else {
            const field = issue.fields[customFieldsArray[j]]
            if ((typeof field === 'object') && field != null) {
              value = field.name || field.displayName || doc.getAttribute(`jira-table-${customFieldsArray[j]}-default`, '-')
            } else {
              value = field
            }
          }
          content.push('|' + value.replace(/\|/g, '\\|'))
        }
      }
      content.push('|====')

      self.parseContent(parent, content.join('\n'), Opal.hash(attrs))

      return undefined
    })
  }
}

function createHeaders (doc, customFieldIds) {
  const headers = []
  const customFieldsArray = customFieldIds.split(',').filter(item => item !== 'issuetype')
  headers.push(doc.getAttribute('jira-table-header-id-label', 'ID'))
  for (let i = 0; i < customFieldsArray.length; i++) {
    headers.push(doc.getAttribute('jira-table-header-' + customFieldsArray[i] + '-label', customFieldsArray[i]))
  }
  return headers
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
      const issueLink = createLinkToIssue(doc, issueKey)
      return self.createInline(parent, 'anchor', title, { type: 'link', target: issueLink }).convert()
    })
  }
}

function createLinkToIssue (doc, issueKey) {
  const jiraBaseUrl = doc.getAttribute('jira-baseurl') || process.env.JIRA_BASEURL
  return `${jiraBaseUrl}/browse/${issueKey}`
}

module.exports.register = function register (registry, context = {}) {
  // patch context in case of Antora
  if (typeof context.contentCatalog !== 'undefined' && typeof context.contentCatalog.addFile === 'function' && typeof context.file !== 'undefined') {
    context.vfs = require('./antora-adapter.js')(context.file, context.contentCatalog, context.vfs)
  }
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
