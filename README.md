# Asciidoctor Jira Extension

[![Build status](https://github.com/uniqueck/asciidoctor-jira/actions/workflows/ci.yaml/badge.svg?branch=main)](https://github.com/uniqueck/asciidoctor-jira/actions/workflows/ci.yaml)
[![npm version](http://img.shields.io/npm/v/asciidoctor-jira.svg)](https://www.npmjs.com/package/asciidoctor-jira)

A set of macros for [Asciidoctor.js](https://github.com/asciidoctor/asciidoctor.js) to integrate Jira!

## Install

### Node.js

Install the dependencies:

```shell
npm i asciidoctor asciidoctor-jira
```

Create a file named jira.js with following content and run it:

```javascript
const asciidoctor = require('@asciidoctor/core')()
const jira = require('asciidoctor-jira')

const input = 'jira::DOC[]'

jira.register(asciidoctor.Extensions) // <1>
console.log(asciidoctor.convert(input, { safe: 'safe' }))

const registry = asciidoctor.Extensions.create()
jira.register(registry) // <2>
console.log(asciidoctor.convert(input, { safe: 'safe', extension_registry: registry }))
```
**<1>** Register the extension in the global registry

**<2>** Register the extension in a dedicated registry

### Antora Integration

If you are using [Antora](https://antora.org/), you can integrate Jira in your documentation site.

Install the extension in your playbook project:

```shell
npm i asciidoctor-jira
```

Register the extension in your playbook file:

```yaml
asciidoc:
  extensions:
    - asciidoctor-jira
```

## Usage

### common

For this extension in general you have to provide the following minimal attributes and/or environment variables.

| Attribute / Env variable      | Description                                                                     |
|-------------------------------|---------------------------------------------------------------------------------|
| jira-baseurl / JIRA_BASEURL   | Schema and domain of jira instance to use                                       |
| jira-username / JIRA_USERNAME | Username to authenticate against given jira instance  (Basic auth)              |
| JIRA_APITOKEN                 | API token to authenticate against given jira instance (Basic auth)              |
| JIRA_PASSWORD                 | Password to authenticate against given jira instance (Basic auth)               |
| JIRA_PAT                      | Personal access token to authenticate against given jira instance (Bearer auth) |

### block macro

```adoc
jira::DOC[]
```

To control the header of the generated table, you can define Asciidoctor attribute e.g. `:jira-table-header-status-label: Status`.
If no asciidoctor attribute for a given field is provided, the field name is used as table header.
To control the default value for an empty field value, you can define an Asciidoctor attribute e.g. `:jira-table-status-default: No Status`, if no attribute is present, the sign `-` is used in general.
For more examples and configuration settings see [documentation](https://uniqueck.github.io/asciidoctor-jira/antora-jira/blockmacro.html)

### inline macro

```adoc
jira:DOC-123[]
```

### roadmap macro

```adoc
roadmap::DOC[]
```

## Configuration


| Macro type | Attribute name   | Description                                           | Default value                                                          |
|------------|------------------|-------------------------------------------------------|------------------------------------------------------------------------|
| block      | `jql`            | Define the query to obtain issues from jira instance. | `resolution='Unresolved' ORDER BY priority DESC, key ASC, duedate ASC` |
| block      | `customFieldIds` | Create only for these custom fields a table           | `priority,created,assignee,issuetype,summary`                          |
