module.exports = function (registry, context = {}) {
  registry.blockMacro(function () {
    var self = this
    self.named('jiraIssues')
    self.onContext('paragraph')
    self.process(function (parent, target, attrs) {
        var jiraHost = parseString(attrs.jira-host)
        var jql = parseString(attrs.jql)
        var lines = []
        return self.createBlock(parent, 'paragraph', lines)
    })
  })
}