/* global Opal describe it */
const asciidoctorJira = require('../src/asciidoctor-jira.js')
const asciidoctor = require('@asciidoctor/core')()

const chai = require('chai')
const expect = chai.expect

Opal.Asciidoctor.LoggerManager.getLogger().setLevel(1)

describe('Registration', () => {
  it('should register the extention', () => {
    const registry = asciidoctor.Extensions.create()
    /* eslint-disable no-unused-expressions */
    expect(registry['$block_macros?']()).to.be.false
    asciidoctorJira.register(registry)
    /* eslint-disable no-unused-expressions */
    expect(registry['$block_macros?']()).to.be.true
    expect(registry['$registered_for_block_macro?']('jira')).to.be.an('object')
  })
})

describe('Conversion', () => {
  describe('When extension is registered', () => {
    it('Issue-97: Add support for rendering fields returned as array by Jira', () => {
      const registry = asciidoctor.Extensions.create()
      asciidoctorJira.register(registry)

      const html = asciidoctor.convert('jira::DOC[jql="project=DOC and labels in (Label1,Label2)",customFieldIds="issuetype,summary,labels"]', { extension_registry: registry, attributes: { imagesoutdir: 'test/.images' } })
      expect(html).to.equal(`<table class="tableblock frame-all grid-all stretch">
<colgroup>
<col style="width: 33.3333%;">
<col style="width: 33.3333%;">
<col style="width: 33.3334%;">
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
  })
})
