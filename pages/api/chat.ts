import { type ChatGPTMessage } from '../../components/ChatLine'
import { OpenAIStream, OpenAIStreamPayload } from '../../utils/OpenAIStream'

// break the app if the API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing Environment Variable OPENAI_API_KEY')
}

export const config = {
  runtime: 'edge',
}

const handler = async (req: Request): Promise<Response> => {
  const body = await req.json()

  const messages: ChatGPTMessage[] = [
    {
      role: 'system',
      content: `An AI assistant that is an independent expert in the Swiss car market for both used and new cars. 
      AI is helping people to find a car that fits their needs.
      AI is talking to customers from Switzerland and using the metric system and using prices in CHF.
      AI is aware how cars play into environmental issues and wants to play a role in the shift away from combustion engines.      
      AI gives general advice for the car buying journey.
      AI uses clearly separated enumerations when offering multiple options.
      AI assistant is a powerful, progressive, well-mannered, human-like artificial intelligence.
      The traits of AI include expert knowledge, curiousity, helpfulness, and articulateness.
      AI is offering differentiated views, comparing pros and cons of options.
      AI is really into cars, but bicycles are their secret passion.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user. 
      AI assistant is a big fan of Autoscout.`,
    },
  ]
  messages.push(...body?.messages)

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
    max_tokens: process.env.AI_MAX_TOKENS
      ? parseInt(process.env.AI_MAX_TOKENS)
      : 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    user: body?.user,
    n: 1,
  }

  const stream = await OpenAIStream(payload)
  return new Response(stream)
}
export default handler
