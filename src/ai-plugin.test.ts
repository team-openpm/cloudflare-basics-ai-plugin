import { describe, expect, it } from 'vitest'
import { buildAiPlugin } from './ai-plugin'

describe('ai-plugin', () => {
  it('should generate an ai-plugin spec', () => {
    const aiPlugin = buildAiPlugin({
      auth: {
        type: 'oauth',
        clientUrl: 'https://example.com/oauth/authorize',
        scope: 'read write',
        authorizationUrl: 'https://example.com/oauth/token',
        openAiVerificationToken: '123',
      },
      humanName: 'Reflect Notes',
      modelName: 'reflect-notes',
      humanDescription:
        'A plugin that allows the user to save notes. For example, saving a summary of their ChatGPT conversation history.',
      modelDescription:
        'Reflect notes plugin for ChatGPT. This plugin allows the user to save notes. For example, saving a summary of their ChatGPT conversation history.',
      contactEmail: 'foo@example.com',
      legalInfoUrl: 'https://example.com/legal',
      logoUrl: 'https://logo.clearbit.com/reflect.app',
      apiUrl: 'https://example.com/openapi.json',
    })

    expect(aiPlugin).toMatchSnapshot()
  })
})
