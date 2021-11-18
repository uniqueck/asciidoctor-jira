
function jiraIssuesBlockMacro (name, context) {
  return function () {
    const self = this
    self.named(name)
  }
}

module.exports = function (registry, context = {}) {
  if (typeof registry.register === 'function') {
    registry.register(function () {
      this.blockMacro(jiraIssuesBlockMacro('jiraIssues', context))
    })
  } else if (typeof registry.block === 'function') {
    this.blockMacro(jiraIssuesBlockMacro('jiraIssues', context))
  }
  return registry
}
