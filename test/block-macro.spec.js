/* global describe, it */
const chai = require('chai')
const expect = chai.expect

const fs = require('fs')

const asciidoctorJira = require('../src/asciidoctor-jira.js')
const asciidoctor = require('@asciidoctor/core')()

describe('Block macro "jira"', () => {
  describe('When extension is registered', () => {

    beforeEach(() => {
      fs.rmSync('test/.images', { recursive: true, force: true })
      expect(fs.existsSync('test/.images')).false
    })

    it('should generate a table based with default jql and fields', () => {
      const input = 'jira::DOC[]'
      const registry = asciidoctor.Extensions.create()
      asciidoctorJira.register(registry)
      const output = asciidoctor.convert(input, { extension_registry: registry, attributes: {imagesdir: `test/.images`} })
      expect(output).to.equal(`<table class="tableblock frame-all grid-all stretch">
<colgroup>
<col style="width: 20%;">
<col style="width: 20%;">
<col style="width: 20%;">
<col style="width: 20%;">
<col style="width: 20%;">
</colgroup>
<thead>
<tr>
<th class="tableblock halign-left valign-top">ID</th>
<th class="tableblock halign-left valign-top">priority</th>
<th class="tableblock halign-left valign-top">created</th>
<th class="tableblock halign-left valign-top">assignee</th>
<th class="tableblock halign-left valign-top">summary</th>
</tr>
</thead>
<tbody>
<tr>
<td class="tableblock halign-left valign-top"><div class="content"><div class="paragraph">
<p><span class="image"><img src="test/.images/jira-issuetype-story.svg" alt="jira issuetype story"></span><a href="https://uniqueck.atlassian.net/browse/DOC-1">DOC-1</a></p>
</div></div></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Medium</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">2021-08-08T12:13:19.203+0200</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Constantin Krüger</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Test123</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><div class="content"><div class="paragraph">
<p><span class="image"><img src="test/.images/jira-issuetype-bug.svg" alt="jira issuetype bug"></span><a href="https://uniqueck.atlassian.net/browse/DOC-2">DOC-2</a></p>
</div></div></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Medium</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">2021-10-09T09:59:31.902+0200</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">-</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Bug123</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><div class="content"><div class="paragraph">
<p><span class="image"><img src="test/.images/jira-issuetype-task.svg" alt="jira issuetype task"></span><a href="https://uniqueck.atlassian.net/browse/DOC-3">DOC-3</a></p>
</div></div></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Medium</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">2021-10-09T10:01:35.706+0200</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">-</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Task123</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><div class="content"><div class="paragraph">
<p><span class="image"><img src="test/.images/jira-issuetype-bug.svg" alt="jira issuetype bug"></span><a href="https://uniqueck.atlassian.net/browse/DOC-4">DOC-4</a></p>
</div></div></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Medium</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">2021-10-09T10:02:04.629+0200</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">-</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">AnotherBug</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><div class="content"><div class="paragraph">
<p><span class="image"><img src="test/.images/jira-issuetype-story.svg" alt="jira issuetype story"></span><a href="https://uniqueck.atlassian.net/browse/DOC-5">DOC-5</a></p>
</div></div></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Medium</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">2021-10-09T13:20:40.690+0200</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Constantin Krüger</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Future Task</p></td>
</tr>
<tr>
<td class="tableblock halign-left valign-top"><div class="content"><div class="paragraph">
<p><span class="image"><img src="test/.images/jira-issuetype-epic.svg" alt="jira issuetype epic"></span><a href="https://uniqueck.atlassian.net/browse/DOC-6">DOC-6</a></p>
</div></div></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Medium</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">2022-01-13T15:09:27.338+0100</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">-</p></td>
<td class="tableblock halign-left valign-top"><p class="tableblock">Summary containing a | pipe</p></td>
</tr>
</tbody>
</table>`)

      expect(fs.existsSync('test/.images/jira-issuetype-epic.svg')).true
      expect(fs.existsSync('test/.images/jira-issuetype-bug.svg')).true
      expect(fs.existsSync('test/.images/jira-issuetype-story.svg')).true
      expect(fs.existsSync('test/.images/jira-issuetype-task.svg')).true
    })
  })
})

