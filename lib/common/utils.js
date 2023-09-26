function createLinkToIssue (jiraBaseUrl, issueKey) {
  return `${jiraBaseUrl}/browse/${issueKey}`
}

module.exports = {
  createLinkToIssue: (jiraBaseUrl, issueKey) => {
    return createLinkToIssue(jiraBaseUrl, issueKey)
  }
}
