/* global
  Opal
*/
const Jira = require('../Jira')
const _ = require('lodash')
const moment = require('moment')
const { createLinkToIssue } = require('../common/utils')

function jiraIssuesBlockMacro (context) {
  return function () {
    const self = this
    self.named('jira')
    self.positionalAttributes(['jql'])
    self.process((parent, target, attrs) => {
      const doc = parent.getDocument()
      const jiraProject = parent.applySubstitutions(target, ['attributes'])
      const jql = attrs.jql || (jiraProject === undefined ? 'resolution="Unresolved" ORDER BY priority DESC, key ASC, duedate ASC' : `project = ${jiraProject} AND resolution="Unresolved" ORDER BY priority DESC, key ASC, duedate ASC`)
      const customFields = attrs.customFieldIds || 'priority,created,assignee,issuetype,summary'
      doc.getLogger().info(`customFields: ${customFields}`)
      const customFieldIds = customFields.split(',').map(customField => customField.split('.')[0])
      doc.getLogger().info(`customFieldIds: ${customFieldIds}`)
      const logger = context.logger
      const jiraConfig = require('../common/jiraConfig').createConfig('', doc, jiraProject, attrs, logger)
      const jiraClient = new Jira(doc, jiraConfig.auth, jiraConfig.baseUrl)
      const issues = jiraClient.searchIssues(jql, customFieldIds)

      const headers = createHeaders(doc, customFields)
      const columnSize = createColumnSize(doc, customFields)
      const customFieldsArray = customFields.split(',').filter(item => item !== 'issuetype')

      const content = []
      content.push(`[options="header", cols="${columnSize.join(',')}"]`)
      content.push('|====')
      content.push('|' + headers.join('|'))

      for (const element of issues) {
        const issue = element
        let idColumn = 'a|'
        if (issue.fields.issuetype && customFieldIds.includes('issuetype')) {
          const issueTypeName = issue.fields.issuetype.name
          const issueTypeIconUrl = issue.fields.issuetype.iconUrl
          const imageName = `jira-issuetype-${issueTypeName.toLowerCase()}.svg`
          jiraClient.download(imageName, issueTypeIconUrl, context.vfs)
          idColumn += `image:${imageName}[]`
        }
        idColumn += `${createLinkToIssue(jiraConfig.baseUrl, issue.key)}[${issue.key}]`
        content.push(idColumn)

        for (const element of customFieldsArray) {
          let value
          if (!_.has(issue.fields, element)) {
            logger.warn(`Examining issue '${JSON.stringify(issue, null, 2)}' for custom field '${element}', but was not found.`)
            value = '-'
          } else {
            value = _.get(issue.fields, element)
            if (value !== null && (value.constructor === Array)) {
              value = value.toString()
            } else if ((typeof value === 'object') && value != null) {
              value = value.name || value.displayName || doc.getAttribute(`jira-table-${element.replace(/\./g, '-')}-default`, '-')
            } else {
              value = value || doc.getAttribute(`jira-table-${element.replace(/\./g, '-')}-default`, '-')
            }
          }
          if (typeof value === 'number') {
            content.push('|' + value)
          } else {
            const inputFormatAttr = `jira-${element.replace(/\./g, '-')}-input-format`
            const outputFormatAttr = `jira-${element.replace(/\./g, '-')}-output-format`
            const inputFormat = doc.getAttribute(inputFormatAttr)
            if (inputFormat) {
              const outputFormat = doc.getAttribute(outputFormatAttr)
              value = formatValue(doc, value, inputFormat, outputFormat)
            }
            content.push('|' + value.replace(/\|/g, '\\|'))
          }
        }
      }
      content.push('|====')

      self.parseContent(parent, content.join('\n'), Opal.hash(attrs))

      return undefined
    })
  }
}

function formatValue (doc, value, inputFormat, outputFormat) {
  if (typeof value === 'string') {
    const parsedValue = moment(value, inputFormat, true)
    if (parsedValue.isValid()) {
      return parsedValue.format(outputFormat)
    }
  }
  return value
}

function createHeaders (doc, customFieldIds) {
  const headers = []
  const customFieldsArray = customFieldIds.split(',').filter(item => item !== 'issuetype')
  headers.push(doc.getAttribute('jira-table-header-id-label', 'ID'))
  for (let i = 0; i < customFieldsArray.length; i++) {
    let field = customFieldsArray[i]
    field = `jira-table-header-${field.replace(/\./g, '-').toLowerCase()}-label`
    headers.push(doc.getAttribute(field, customFieldsArray[i]))
  }
  return headers
}

function createColumnSize (doc, customFieldIds) {
  const cols = []
  const customFieldsArray = customFieldIds.split(',').filter(item => item !== 'issuetype')
  cols.push(doc.getAttribute('jira-table-header-id-size', 1))
  for (let i = 0; i < customFieldsArray.length; i++) {
    let field = customFieldsArray[i]
    field = `jira-table-header-${field.replace(/\./g, '-').toLowerCase()}-size`
    cols.push(doc.getAttribute(field, 2))
  }
  return cols
}

module.exports = {
  blockMacro: (context) => {
    return jiraIssuesBlockMacro(context)
  }
}
