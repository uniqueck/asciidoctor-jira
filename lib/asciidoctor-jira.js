/* global
  Opal
*/
// @ts-check
require('dotenv').config()

module.exports.register = function register (registry, context = {}) {
  // patch context in case of Antora
  if (typeof context.contentCatalog !== 'undefined' && typeof context.contentCatalog.addFile === 'function' && typeof context.file !== 'undefined') {
    context.vfs = require('./antora-adapter.js')(context.file, context.contentCatalog, context.vfs)
  }
  context.logger = Opal.Asciidoctor.LoggerManager.getLogger()
  if (typeof registry.register === 'function') {
    registry.register(function () {
      this.blockMacro(require('./blockmacro/jiraIssuesBlockmacro').blockMacro(context))
      this.blockMacro(require('./blockmacro/roadmapBlockmacro').blockMacro('roadmap', context))
      this.inlineMacro(require('./inlinemacro/jiraIssueInlineMacro').inlineMacro(context))
    })
  } else if (typeof registry.block === 'function') {
    registry.blockMacro(require('./blockmacro/jiraIssuesBlockmacro').blockMacro(context))
    registry.blockMacro(require('./blockmacro/roadmapBlockmacro').blockMacro('roadmap', context))
    registry.inlineMacro(require('./inlinemacro/jiraIssueInlineMacro').inlineMacro(context))
  }
  return registry
}
