const fs = require('fs')
const request = require('then-request')
const { createProxyAgent } = require('./proxy')

const main = async () => {
  const input = JSON.parse(fs.readFileSync(0, 'utf8'))
  const options = Object.assign({}, input.options)
  const agent = createProxyAgent(input.url, input.proxy)
  if (agent) {
    options.agent = agent
  }
  try {
    const response = await request(input.method, input.url, options)
    process.stdout.write(JSON.stringify({
      statusCode: response.statusCode,
      headers: response.headers,
      body: response.body.toString('base64'),
      url: response.url
    }))
  } finally {
    if (agent && typeof agent.destroy === 'function') {
      agent.destroy()
    }
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack : JSON.stringify(err))
  process.exit(1)
})
