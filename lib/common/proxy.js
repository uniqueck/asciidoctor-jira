const { HttpProxyAgent } = require('http-proxy-agent')
const { HttpsProxyAgent } = require('https-proxy-agent')

const getProxyValue = (proxy, name) => {
  const value = proxy?.[name]
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }
  return null
}

const getDefaultPort = (protocol) => {
  return protocol === 'https:' ? '443' : '80'
}

const getNoProxyCandidate = (entry) => {
  if (!entry.includes('://')) {
    return entry
  }

  try {
    const parsedEntry = new URL(entry)
    return parsedEntry.hostname.includes('*') ? null : parsedEntry.host
  } catch {
    return null
  }
}

const shouldBypassProxy = (requestUrl, proxy = null) => {
  const noProxy = getProxyValue(proxy, 'no_proxy')
  if (!noProxy) {
    return false
  }

  const targetUrl = new URL(requestUrl)
  const hostname = targetUrl.hostname.toLowerCase()
  const port = targetUrl.port || getDefaultPort(targetUrl.protocol)

  return noProxy.split(',').some((entry) => {
    const trimmedEntry = entry.trim()
    if (!trimmedEntry) {
      return false
    }
    if (trimmedEntry === '*') {
      return true
    }

    const candidate = getNoProxyCandidate(trimmedEntry)
    if (!candidate) {
      return false
    }

    let candidateHost = candidate
    let candidatePort
    if (candidate.startsWith('[')) {
      const hostEnd = candidate.indexOf(']')
      candidateHost = candidate.slice(1, hostEnd)
      if (candidate[hostEnd + 1] === ':') {
        candidatePort = candidate.slice(hostEnd + 2)
      }
    } else {
      const separatorIndex = candidate.lastIndexOf(':')
      if (separatorIndex > -1 && candidate.indexOf(':') === separatorIndex) {
        candidateHost = candidate.slice(0, separatorIndex)
        candidatePort = candidate.slice(separatorIndex + 1)
      }
    }

    candidateHost = candidateHost.replace(/^\*\./, '').replace(/^\./, '').toLowerCase()
    if (!candidateHost) {
      return false
    }
    if (candidatePort && candidatePort !== port) {
      return false
    }
    return hostname === candidateHost || hostname.endsWith(`.${candidateHost}`)
  })
}

const getProxyForUrl = (requestUrl, proxy = null) => {
  if (shouldBypassProxy(requestUrl, proxy)) {
    return null
  }

  const protocol = new URL(requestUrl).protocol
  return protocol === 'https:'
    ? getProxyValue(proxy, 'https') || getProxyValue(proxy, 'http')
    : getProxyValue(proxy, 'http')
}

const createProxyAgent = (requestUrl, proxy = null) => {
  const proxyUrl = getProxyForUrl(requestUrl, proxy)
  if (!proxyUrl) {
    return null
  }
  return new URL(requestUrl).protocol === 'https:'
    ? new HttpsProxyAgent(proxyUrl)
    : new HttpProxyAgent(proxyUrl)
}

module.exports = {
  createProxyAgent,
  getProxyForUrl,
  shouldBypassProxy
}
