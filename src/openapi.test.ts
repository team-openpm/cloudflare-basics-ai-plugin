import { describe, expect, it } from 'vitest'
import { generateOpenApi } from './openapi'
import { z } from 'zod'

describe('generateOpenApi', () => {
  it('should generate an OpenAPI spec', () => {
    const openApi = generateOpenApi({
      title: 'Reflect Notes',
      description:
        'A plugin that allows the user to save notes. For example, saving a summary of their ChatGPT conversation history.',
      version: '1.0.0',
      paths: [
        {
          path: '/notes',
          method: 'post',
          summary: 'Create a note',
          requestSchema: z.object({
            text: z.string(),
          }),
          responseSchema: z.object({
            id: z.string(),
            text: z.string(),
          }),
        },
      ],
    })

    expect(openApi).toMatchSnapshot()
  })
})
