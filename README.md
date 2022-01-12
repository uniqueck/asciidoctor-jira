# Asciidoctor Jira Extension

[![Build status](https://github.com/uniqueck/asciidoctor-jira/actions/workflows/build-js.yml/badge.svg?branch=main)](https://github.com/uniqueck/asciidoctor-jira/actions/workflows/build-js.yml)
[![npm version](http://img.shields.io/npm/v/asciidoctor-jira.svg)](https://www.npmjs.com/package/asciidoctor-jira)

A set of macros for [Asciidoctor.js](https://github.com/asciidoctor/asciidoctor.js) to integrate Jira!

## Install

### Node.js

Install the dependencies:

```shell
npm i asciidoctor asciidoctor-kroki
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

If you are using https://antora.org/[Antora], you can integrate Jira in your documentation site.

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

### block macro

### inline macro

## Configuration


| Macro type | Attribute name | Description | Default value |
| ---------- | -------------- | ----------- | ------------- |
| block      | `jql`          | Define the query to obtain issues from jira instance. |`resolution='Unresolved' ORDER BY priority DESC, key ASC, duedate ASC` |
