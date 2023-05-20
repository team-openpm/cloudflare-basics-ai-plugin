# cloudflare-basics-ai-plugin

Simple Cloudflare Worker utilities for building OpenAI's AI plugins.

Uses [cloudflare-basics](https://github.com/maccman/cloudflare-basics).

## Usage

```ts
import { Router, json, withZod } from 'cloudflare-basics'
import { AiPluginRoute, OpenApiRoute } from 'cloudflare-basics-ai-plugin'
import { z } from 'zod'

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const router = new Router<Env>()

    const requestSchema = z.object({
      markdown: z.string(),
    })

    const responseSchema = z.object({
      success: z.boolean(),
    })

    const route = withZod<Env, z.infer<typeof requestSchema>>(
      requestSchema,
      async (options) => {
        console.log('Creating note', options.data.markdown)

        return json({ success: true })
      }
    )

    router.post('/notes', route)

    router.get(
      '/openapi.json',
      OpenApiRoute({
        title: 'Reflect Notes',
        description:
          'A plugin that allows the user to save notes. For example, saving a summary of their ChatGPT conversation history.',
        version: '1.0.0',
        paths: [
          {
            path: '/notes',
            method: 'post',
            summary: 'Create a note',
            requestSchema,
            responseSchema,
          },
        ],
      })
    )

    router.get(
      '/.well-known/ai-plugin.json',
      AiPluginRoute({
        humanName: 'Reflect Notes',
        modelName: 'reflect_notes',
        humanDescription:
          'A plugin that allows the user to save notes. For example, saving a summary of their ChatGPT conversation history.',
        modelDescription:
          'Reflect notes plugin for ChatGPT. This plugin allows the user to save notes. For example, saving a summary of their ChatGPT conversation history.',
        contactEmail: 'support@reflect.app',
        legalInfoUrl: 'https://reflect.app/terms',
        logoUrl: 'https://logo.clearbit.com/reflect.app',
      })
    )

    return (
      router.handle(request, env, ctx) ??
      new Response('Not Found', { status: 404 })
    )
  },
}
```
