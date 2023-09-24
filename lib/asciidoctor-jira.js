/* global
  Opal
*/

// @ts-check
const plantumlEncoder = require('plantuml-encoder')
const Jira = require('./Jira.js')
require('dotenv').config()
const _ = require('lodash')
const JIRA = require('./Jira')
const rusha = require('rusha')

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
      const customFieldIds = customFields.split(',').map(customField => customField.split('.')[0])
      const jiraClient = new Jira(doc)
      const issues = jiraClient.searchIssues(jql, customFieldIds)
      const logger = context.logger

      const headers = createHeaders(doc, customFields)
      const customFieldsArray = customFields.split(',').filter(item => item !== 'issuetype')

      const content = []
      content.push('[options="header"]')
      content.push('|====')
      content.push('|' + headers.join('|'))

      for (let i = 0; i < issues.length; i++) {
        const issue = issues[i]
        let idColumn = 'a|'
        if (issue.fields.issuetype && customFieldIds.includes('issuetype')) {
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
          if (!_.has(issue.fields, customFieldsArray[j])) {
            logger.warn(`Examining issue '${JSON.stringify(issue, null, 2)}' for custom field '${customFieldsArray[j]}', but was not found.`)
            value = '-'
          } else {
            value = _.get(issue.fields, customFieldsArray[j])
            if (value !== null && (value.constructor === Array)) {
              value = value.toString()
            } else if ((typeof value === 'object') && value != null) {
              value = value.name || value.displayName || doc.getAttribute(`jira-table-${customFieldsArray[j].replace(/\./g, '-')}-default`, '-')
            } else {
              value = value || doc.getAttribute(`jira-table-${customFieldsArray[j].replace(/\./g, '-')}-default`, '-')
            }
          }
          if (typeof value === 'number') {
            content.push('|' + value)
          } else {
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

function roadmapBlockMacro (name, context) {
  return function () {
    const self = this
    self.named(name)
    self.positionalAttributes(['year', 'categories', 'release-date'])
    self.process((parent, target, attrs) => {
      const vfs = context.vfs
      const doc = parent.getDocument()
      const jiraProject = parent.applySubstitutions(target, ['attributes'])

      const categories = (attrs.categories || doc.getAttribute(`${name}-categories`) || 'maintenance,feature,security,infrastructure,deprecated,migration').split(',').map(it => it.trim())
      const year = (attrs.year || doc.getAttribute(`${name}-year`) || new Date().toLocaleDateString('en-US', { year: 'numeric' }))

      const lastRoadmapReleaseDate = attrs['release-date'] || doc.getAttribute(`${name}-release-date`)

      const plantUmlServerUrl = doc.getAttribute('roadmap-plantuml-server-url') || 'https://kroki.io/plantuml'
      const jiraBaseUrl = doc.getAttribute(`${jiraProject.toLowerCase()}-roadmap-jira-baseurl`) || doc.getAttribute('roadmap-jira-baseurl')
      const theme = attrs[`${name}-theme`] || doc.getAttribute(`${name}-theme`) || 'hacker'
      const legendForStatus = (attrs[`${name}-legend-for-status`] || doc.getAttribute(`${name}-legend-for-status`) || 'Open,In Progress,Closed').split(',').map(it => it.trim())
      const jiraStatusClosed = (attrs[`${name}-closed-status`] || doc.getAttribute(`${name}-closed-status`) || 'Closed,Resolved').split(',').map(it => it.trim())

      const jiraClient = new JIRA(doc)

      const jiraFields = {
        epicName: 'customfield_10004',
        summary: 'summary',
        status: 'status',
        issueType: 'issuetype',
        resolutionDate: 'resolutiondate',
        dueDate: 'duedate',
        created: 'created'
      }

      const content = []
      content.push('@startgantt', 'printscale monthly zoom 3', 'language de', `Project starts the 1st of january ${year}`, 'hide footbox')
      if (theme !== null) {
        content.push(`!theme ${theme}`)
      }

      content.push(`<style>
      ganttdiagram {
        milestone {
            FontSize 18
        }
        separator {
            FontSize 18
        }
      }
      </style>`)

      for (const catIndex in categories) {
        const category = categories[catIndex]
        const categoryLabel = doc.getAttribute(`roadmap-${category}-label`, `${category}`)
        const jql = `project = ${jiraProject} and labels in (Roadmap) and labels in ('${year}') and labels in (${category})`

        const issues = jiraClient.searchIssues(jql, Object.keys(jiraFields).map(it => jiraFields[it]).join(','))

        if (issues != null && issues.length > 0) {
          // add category label as separator
          content.push(`-- ${categoryLabel} --`)

          for (const issueIndex in issues) {
            const issue = issues[issueIndex]
            const issueKey = issue.key
            let dueDate = issue.fields[jiraFields.dueDate]
            const status = issue.fields[jiraFields.status].name
            const jiraIssueLink = `${jiraBaseUrl}/browse/${issueKey}`
            const roadmapEntryName = issue.fields[jiraFields.epicName] || issue.fields[jiraFields.summary]

            const isAfterLastRoadmapReleaseDate = lastRoadmapReleaseDate === null || (new Date(lastRoadmapReleaseDate) < new Date(issue.fields[jiraFields.created]))

            if (jiraStatusClosed.includes(status)) {
              const resolutionDate = new Date(issue.fields[jiraFields.resolutionDate])
              dueDate = `${resolutionDate.getFullYear()}-${resolutionDate.getMonth() + 1}-${resolutionDate.getDate()}`
            }

            // calculate dua date
            if (dueDate !== undefined) {
              content.push(`[${roadmapEntryName}] as [${issueKey}] happens at ${dueDate}`)
            } else {
              doc.getLogger().warn(`${jiraIssueLink} has no due date, to appear on roadmap this is needed.`)
              continue
            }

            // link to jira issue
            content.push(`[${issueKey}] links to [[${jiraIssueLink}]]`)

            // render completion status
            if (isAfterLastRoadmapReleaseDate && !jiraStatusClosed.includes(status)) {
              const color4TaskAfterLastRoadmapReleaseDate = attrs[`${name}-milestone-after-last-roadmap-release-date-color`] || doc.getAttribute(`${name}-milestone-after-last-roadmap-release-date-color`) || 'black'
              content.push(`[${issueKey}] is colored in ${color4TaskAfterLastRoadmapReleaseDate}`)
            } else {
              const status4Attribute = status.toLowerCase().replace(' ', '_')
              const color4Task = attrs[`${name}-milestone-${status4Attribute}-color`] || doc.getAttribute(`${name}-milestone-${status4Attribute}-color`) || 'black'
              content.push(`[${issueKey}] is colored in ${color4Task}`)
            }
          }
        }
      }
      content.push('--')

      // add legend
      for (const legendIndex in legendForStatus) {
        const legend = legendForStatus[legendIndex]
        const status4Attribute = legend.toLowerCase().replace(' ', '_')
        const color4Task = attrs[`${name}-milestone-${status4Attribute}-color`] || doc.getAttribute(`${name}-milestone-${status4Attribute}-color`) || 'black'
        content.push(`[${legend}] happens at 1st of january ${year} and is colored in ${color4Task}`)
      }
      if (lastRoadmapReleaseDate !== undefined) {
        const releaseDateFormattedForLegend = `${new Date(lastRoadmapReleaseDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`
        content.push(`[Added after initial roadmap from ${releaseDateFormattedForLegend}] happens at 1st of january ${year} and is colored in orange`)
      }

      content.push('@endgantt')

      doc.getLogger().debug(`${content.join('\n')}`)

      const downloadUrl = `${plantUmlServerUrl}/svg/${plantumlEncoder.encode(content.join('\n'))} `
      const diagramName = `roadmap-${target}-${year}-${rusha.createHash().update(content).digest('hex')}.svg`
      require('./common/fetch.js').save(diagramName, downloadUrl, doc, 'svg', vfs)

      self.parseContent(parent, `image::${diagramName}[opts=interactive]`, Opal.hash(attrs))
      return undefined
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
  context.logger = Opal.Asciidoctor.LoggerManager.getLogger()
  if (typeof registry.register === 'function') {
    registry.register(function () {
      this.blockMacro(jiraIssuesBlockMacro(context))
      this.blockMacro(roadmapBlockMacro('roadmap', context))
      this.inlineMacro(jiraIssueInlineMacro(context))
    })
  } else if (typeof registry.block === 'function') {
    registry.blockMacro(jiraIssuesBlockMacro(context))
    registry.blockMacro(roadmapBlockMacro('roadmap', context))
    registry.inlineMacro(jiraIssueInlineMacro(context))
  }
  return registry
}
