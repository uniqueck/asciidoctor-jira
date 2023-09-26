/* global
  Opal
*/
const JIRA = require('../Jira')
const plantumlEncoder = require('plantuml-encoder')
const rusha = require('rusha')

function roadmapBlockMacro (name, context) {
  return function () {
    const self = this
    self.named(name)
    self.positionalAttributes(['year', 'categories', 'release-date'])
    self.process((parent, target, attrs) => {
      const vfs = context.vfs
      const config = require('./roadmapBlockmacroConfig').createConfig(name, parent, target, attrs, parent.getDocument().getLogger())
      const doc = parent.getDocument()

      const jiraProject = config.projectKey
      const categories = config.categories
      const year = config.year
      const jiraBaseUrl = config.jira.baseUrl
      const jiraFields = config.jiraFields
      const plantUmlServerUrl = config.plantumlServerUrl
      const jiraStatusClosed = config.closedStatus
      const theme = config.plantumlTheme
      const lastRoadmapReleaseDate = config.lastRoadmapReleaseDate
      const legendForStatus = config.legendForStatus

      const jiraClient = new JIRA(doc, config.jira.username, config.jira.password, config.jira.baseUrl)

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
        const categoryLabel = config.getCategoryLabel(catIndex)
        const jql = config.getCategoryJQL(catIndex)

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

      doc.getLogger().info(`${content.join('\n')}`)
      const downloadUrl = `${plantUmlServerUrl}/svg/${plantumlEncoder.encode(content.join('\n'))} `
      const diagramName = `roadmap-${jiraProject}-${year}-${rusha.createHash().update(content).digest('hex')}.svg`
      require('../common/fetch.js').save(diagramName, downloadUrl, doc, 'svg', vfs)

      self.parseContent(parent, `image::${diagramName}[opts=interactive]`, Opal.hash(attrs))
      return undefined
    })
  }
}

module.exports = {
  blockMacro: (macroName, context) => {
    return roadmapBlockMacro(macroName, context)
  }
}
