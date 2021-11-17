# Asciidoctor Jira Extension

[![CI](https://github.com/uniqueck/asciidoctor-jira/actions/workflows/build-js.yml/badge.svg?branch=main)](https://github.com/uniqueck/asciidoctor-jira/actions/workflows/build-js.yml)

A set of macros for [Asciidoctor.js](https://github.com/asciidoctor/asciidoctor.js) to integrate Jira!

  * [Install](#install)
    + [Antora Integration](#antora-integration)

## Install

### Antora Integration

If you are using [Antora](https://antora.org/), you can integrate Jira in your documentation site.

Install the extension in your playbook project:

    $ npm i asciidoctor-jira

Register the extension in your playbook file:

  ```yaml
  asciidoc:
    extensions:
      - asciidoctor-jira
  ```
