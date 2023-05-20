import { generateSchema as generateBaseSchema } from '@anatine/zod-openapi'
import { Router, json } from 'cloudflare-basics'
import { OpenAPIObject, PathsObject } from 'openapi3-ts/oas31'
import { OpenApiOptions } from './types'

export function generateOpenApi(options: OpenApiOptions): OpenAPIObject {
  return {
    openapi: '3.0.2',
    info: {
      title: options.title,
      description: options.description,
      version: options.version,
    },
    paths: options.paths.reduce((paths, path) => {
      const { path: pathString, method } = path
      const pathObject = paths[pathString] || {}
      const methodObject = pathObject[method] || {}
      const requestBody = generateBaseSchema(path.requestSchema)
      const responseBody = generateBaseSchema(path.responseSchema)

      const operationId =
        path.operationId ?? `${method}_${pathString.replace(/\//g, '_')}')}`

      return {
        ...paths,
        [pathString]: {
          ...pathObject,
          [method]: {
            ...methodObject,
            operationId,
            ...(path.tags && { tags: path.tags }),
            summary: path.summary,
            requestBody: {
              content: {
                'application/json': {
                  schema: requestBody,
                },
              },
            },
            responses: {
              200: {
                description: 'Successful Response',
                content: {
                  'application/json': {
                    schema: responseBody,
                  },
                },
              },
            },
            ...(path.parameters && { parameters: path.parameters }),
          },
        },
      }
    }, {} as PathsObject),
  }
}

export function OpenApiRoute(options: OpenApiOptions) {
  return async () => {
    return json(generateOpenApi(options))
  }
}

export function addOpenApiRoute<Env>(
  router: Router<Env>,
  options: OpenApiOptions,
  path = '/openapi.json'
) {
  router.get(path, OpenApiRoute(options))
}
