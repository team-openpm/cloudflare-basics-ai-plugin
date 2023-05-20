# cloudflare-basics-ai-plugin

Simple Cloudflare Worker utilities for building OpenAI's AI plugins.

Uses [cloudflare-basics](https://github.com/maccman/cloudflare-basics).

## Usage

```ts
import { AiPluginRoute, OpenApiRoute } from 'cloudflare-basics-ai-plugin'

const router = new Router()

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
        requestBody: z.object({
          text: z.string(),
        }),
        responseBody: z.object({
          id: z.string(),
          text: z.string(),
        }),
      },
    ],
  })
)

router.get(
  '/.well-known/ai-plugin',
  AiPluginRoute({
    auth: {
      type: 'oauth',
      clientUrl: 'https://example.com/oauth/authorize',
      authorizationUrl: 'https://example.com/oauth/token',
      scope: 'read write',
      openaiVerificationToken: '123',
    },
    nameForHuman: 'Reflect Notes',
    nameForModel: 'reflect_notes',
    descriptionForHuman:
      'A plugin that allows the user to save notes. For example, saving a summary of their ChatGPT conversation history.',
    descriptionForModel:
      'Reflect notes plugin for ChatGPT. This plugin allows the user to save notes. For example, saving a summary of their ChatGPT conversation history.',
    contactEmail: 'support@reflect.app',
    legalInfoUrl: 'https://reflect.app/terms',
    logoUrl: 'https://reflect.app/site/icons/512x512-rounded.png',
  })
)
```
