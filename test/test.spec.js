/* global Opal describe it */
const jiraExt = require('../lib/asciidoctor-jira.js')
const asciidoctor = require('@asciidoctor/core')()

const chai = require('chai')
const expect = chai.expect

Opal.Asciidoctor.LoggerManager.getLogger().setLevel(1)

describe('Registration', () => {
  it('should register the jira extensions', () => {
    const registry = asciidoctor.Extensions.create()
    /* eslint-disable no-unused-expressions */
    expect(registry['$block_macros?']()).to.be.false
    jiraExt.register(registry)
    /* eslint-disable no-unused-expressions */
    expect(registry['$block_macros?']()).to.be.true
    expect(registry['$registered_for_block_macro?']('jira')).to.be.an('object')

    expect(registry['$block_macros?']()).to.be.true
    expect(registry['$registered_for_block_macro?']('roadmap')).to.be.an('object')
  })
})

describe('Conversion', () => {
  describe('When jira extension is registered', () => {
    it('Issue-97: Add support for rendering fields returned as array by Jira', () => {
      const registry = asciidoctor.Extensions.create()
      jiraExt.register(registry)

      const html = asciidoctor.convert('jira::DOC[jql="project=DOC and labels in (Label1,Label2)",customFieldIds="issuetype,summary,labels"]', { extension_registry: registry, attributes: { imagesoutdir: 'test/.images' } })
      expect(html).to.equal(`<table class="tableblock frame-all grid-all stretch">
<colgroup>
<col style="width: 20%;">
<col style="width: 40%;">
<col style="width: 40%;">
</colgroup>
<thead>
<tr>
<th class="tableblock halign-left valign-top">ID</th>
<th class="tableblock halign-left valign-top">summary</th>
<th class="tableblock halign-left valign-top">labels</th>
</tr>
</thead>
<tbody>
<tr>
<td class="tableblock halign-left valign-top"><div class="content"><div class="paragraph">
<p><span class="image"><img src="jira-issuetype-bug.svg" alt="jira issuetype bug"></span><a href="https://uniqueck.atlassian.net/browse/DOC-2">DOC-2</a></p>
</div></div></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Bug123</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Label1</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><div class="content"><div class="paragraph">
<p><span class="image"><img src="jira-issuetype-story.svg" alt="jira issuetype story"></span><a href="https://uniqueck.atlassian.net/browse/DOC-1">DOC-1</a></p>
</div></div></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Test123</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Label1,Label2</p></td>
</tr>
</tbody>
</table>`)
    })
    it('#147 - wrong jql', () => {
      const registry = asciidoctor.Extensions.create()
      jiraExt.register(registry)

      const html = asciidoctor.convert('jira::DOC[jql="project=DOC and",customFieldIds="issuetype,summary,labels"]', { extension_registry: registry, attributes: { imagesoutdir: 'test/.images' } })
      expect(html).to.equal(`<table class="tableblock frame-all grid-all stretch">
<colgroup>
<col style="width: 20%;">
<col style="width: 40%;">
<col style="width: 40%;">
</colgroup>
<thead>
<tr>
<th class="tableblock halign-left valign-top">ID</th>
<th class="tableblock halign-left valign-top">summary</th>
<th class="tableblock halign-left valign-top">labels</th>
</tr>
</thead>
</table>`)
    })
    it('#152 - customizable column size', () => {
      const registry = asciidoctor.Extensions.create()
      jiraExt.register(registry)

      const html = asciidoctor.convert('jira::DOC[jql="project=DOC and",customFieldIds="issuetype,summary,labels"]', { extension_registry: registry, attributes: { imagesoutdir: 'test/.images', 'jira-table-header-summary-size': 1 } })
      expect(html).to.equal(`<table class="tableblock frame-all grid-all stretch">
<colgroup>
<col style="width: 25%;">
<col style="width: 25%;">
<col style="width: 50%;">
</colgroup>
<thead>
<tr>
<th class="tableblock halign-left valign-top">ID</th>
<th class="tableblock halign-left valign-top">summary</th>
<th class="tableblock halign-left valign-top">labels</th>
</tr>
</thead>
</table>`)
    })
  })

  describe('When roadmap extension is registered', () => {
    it('render default roadmap', () => {
      const registry = asciidoctor.Extensions.create()
      jiraExt.register(registry)

      const html = asciidoctor.convert('roadmap::ROADMAP[]', { extension_registry: registry, attributes: { imagesoutdir: 'test/.images', 'roadmap-jira-baseurl': 'https://uniqueck.atlassian.net' } })

      const expectedPlantumlContent = ['@startgantt', 'printscale monthly zoom 3']
      expectedPlantumlContent.push('language de', 'Project starts the 1st of january 2023')
      expectedPlantumlContent.push('hide footbox', '!theme hacker')
      expectedPlantumlContent.push(`<style>
      ganttdiagram {
        milestone {
            FontSize 18
        }
        separator {
            FontSize 18
        }
      }
      </style>`)
      expectedPlantumlContent.push('-- feature --')
      expectedPlantumlContent.push('[Roadmap Entry for category Feature] as [ROAD-1] happens at 2023-09-21')
      expectedPlantumlContent.push('[ROAD-1] links to [[https://uniqueck.atlassian.net/browse/ROAD-1]]')
      expectedPlantumlContent.push('[ROAD-1] is colored in black')
      expectedPlantumlContent.push('--')
      expectedPlantumlContent.push('[Open] happens at 1st of january 2023 and is colored in black')
      expectedPlantumlContent.push('[In Progress] happens at 1st of january 2023 and is colored in black')
      expectedPlantumlContent.push('[Closed] happens at 1st of january 2023 and is colored in black')
      expectedPlantumlContent.push('@endgantt')

      const contentAsHex = require('rusha').createHash().update(expectedPlantumlContent).digest('hex')
      const diagramName = `roadmap-ROADMAP-2023-${contentAsHex}.svg`

      expect(html).to.equal(`<div class="imageblock">
<div class="content">
<img src="${diagramName}" alt="roadmap ROADMAP 2023 ${contentAsHex}">
</div>
</div>`)
    }).timeout(50000)
  })
})
