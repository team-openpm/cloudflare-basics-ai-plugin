import {
  OpenApiZodAny,
  generateSchema as generateBaseSchema,
} from '@anatine/zod-openapi'
import { RequestMethod, json } from 'cloudflare-basics'
import { OpenAPIObject, ParameterObject, PathsObject } from 'openapi3-ts/oas31'

export interface OpenApiPath {
  path: string
  method: RequestMethod
  operationId?: string
  tags?: string[]
  summary: string
  parameters?: ParameterObject
  requestBody: OpenApiZodAny
  responseBody: OpenApiZodAny
}

export interface OpenApiOptions {
  title: string
  description: string
  version: string
  paths: OpenApiPath[]
}

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
      const requestBody = generateBaseSchema(path.requestBody)
      const responseBody = generateBaseSchema(path.responseBody)

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
