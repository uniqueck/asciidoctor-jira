/* global describe, it */
const chai = require('chai')
const expect = chai.expect

const asciidoctorJira = require('../src/asciidoctor-jira.js')
const asciidoctor = require('@asciidoctor/core')()
const registry = asciidoctor.Extensions.create()

describe('Inline Macro "jira"', () => {

  describe('When extension is registered', () => {

    before(() => {
      asciidoctorJira.register(registry)
    });

    describe('When attribute "jira-baseurl" and no credentials provided', () => {

      before(() => {
        process.env.JIRA_APITOKEN_SAVED = process.env.JIRA_APITOKEN;
        process.env.JIRA_USERNAME_SAVED = process.env.JIRA_USERNAME;
        delete process.env.JIRA_USERNAME;
        delete process.env.JIRA_APITOKEN;
      });

      it('should generate a link to jira issue', () => {
        const input = 'jira:DOC-1[]'

        const output = asciidoctor.convert(input, {
          extension_registry: registry,
          attributes: {imagesdir: `test/.images`}
        })
        expect(output).to.equal(`<div class="paragraph">
<p><a href="https://uniqueck.atlassian.net/browse/DOC-1">DOC-1</a></p>
</div>`)
      })

      it('for a closed jira issue, the link should equal to a not close jira issue', () => {
        const input = 'jira:DOC-7[]'
        const output = asciidoctor.convert(input, {
          extension_registry: registry,
          attributes: {imagesdir: `test/.images`}
        })
        expect(output).to.equal(`<div class="paragraph">
<p><a href="https://uniqueck.atlassian.net/browse/DOC-7">DOC-7</a></p>
</div>`)
      })

    })

    describe('When attribute "jira-baseurl" and credentials provided', () => {

      before(() => {
        process.env.JIRA_USERNAME = process.env.JIRA_USERNAME_SAVED;
        process.env.JIRA_APITOKEN = process.env.JIRA_APITOKEN_SAVED;
      })

      it('should generate a link to jira issue', () => {
        const input = 'jira:DOC-1[]'

        const output = asciidoctor.convert(input, {
          extension_registry: registry,
          attributes: {imagesdir: `test/.images`}
        })
        expect(output).to.equal(`<div class="paragraph">
<p><a href="https://uniqueck.atlassian.net/browse/DOC-1">DOC-1</a></p>
</div>`)
      })

    })

  })

})

