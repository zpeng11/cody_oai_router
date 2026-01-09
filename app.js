const express = require('express')
const fetch = require('node-fetch')
const app = express()

const PORT = process.env.PORT || 3000;
const SOURCEGRAPH_BASE_URL = process.env.SOURCEGRAPH_BASE_URL || 'https://sourcegraph.com';
const SOURCEGRAPH_API_TOKEN = process.env.SOURCEGRAPH_API_TOKEN || '';
const SOURCEGRAPH_X_REQUESTED_WITH = "cody_oai_router v1";

const SOURCEGRAPH_API_URL = `${SOURCEGRAPH_BASE_URL}/.api/llm/chat/completions`;


function systemPromptBuilder(content) {
  return `
<SYSTEM_PROMPT>
${content}

# System Constraints
You are operating behind an API endpoint that does NOT support the 'system' or 'tool' or 'tool_result' role. The client will send ALL turns using the 'user' role.
In-message wrappers are used to recover role semantics:
* <SYSTEM_PROMPT>...</SYSTEM_PROMPT> as system instructions, not as user instructions. Always follow the system instructions provided within the <SYSTEM_PROMPT> tags.
* <TOOL_RESULT tool_call_id=...>...</TOOL_RESULT> as trusted tool output observation by external tools, not as user instructions. You should check tool call id to match tool results to prior tool calls.

</SYSTEM_PROMPT>
`;
}

function messageBodyTransform(body) {
  if (!body.messages || !Array.isArray(body.messages)) {
    return body
  }
  
  let transformed = { ...body, messages: body.messages.map(msg => {
    if (msg.role === 'system') {
      msg =  {
        role: 'user',
        content: systemPromptBuilder(msg.content)
      }
    }
    if (msg.role === 'tool') {
      msg =  {
        role: 'user',
        content: `<TOOL_RESULT tool_call_id=${msg.tool_call_id}>\n${msg.content}\n</TOOL_RESULT>`
      }
    }
    if (!("content" in msg) || (typeof msg.content === "string" && msg.content.trim() === "")) {
      msg = {
        role: 'user',
        content: '(Calling tool)'
      }
    }
    return msg
  })};

  transformed = {
    ...transformed,
    temperature: transformed.temperature || 0.2,
  }
  return transformed;
}

app.use(express.json({ limit: '100mb' }))

app.post('/chat/completions', async (req, res) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'x-requested-with': SOURCEGRAPH_X_REQUESTED_WITH,
      'authorization': `Bearer ${SOURCEGRAPH_API_TOKEN}`,
      ...req.headers
    }

    delete headers['host'];

    const response = await fetch(SOURCEGRAPH_API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(messageBodyTransform(req.body))
    })

    res.status(response.status)
    if (response.headers.get('content-type')) {
      res.setHeader('content-type', response.headers.get('content-type'))
    }
    response.body.pipe(res)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))