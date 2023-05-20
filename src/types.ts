// For reference:
//
// {
//   "schema_version": "v1",
//   "auth": {
//     "type": "oauth",
//     "client_url": "https://reflect-chatgpt.teamreflect.workers.dev/auth",
//     "scope": "",
//     "authorization_url": "https://reflect-chatgpt.teamreflect.workers.dev/token",
//     "authorization_content_type": "application/json",
//     "verification_tokens": {
//       "openai": "1232"
//     }
//   },
//   "name_for_human": "Reflect Notes",
//   "name_for_model": "reflect_notes",
//   "description_for_human": "Reflect notes plugin for ChatGPT.",
//   "description_for_model": "Reflect notes plugin for ChatGPT. This plugin allows the user to save notes. For example, saving a summary of their ChatGPT conversation history.",
//   "contact_email": "support@reflect.app",
//   "legal_info_url": "https://reflect.app/terms",
//   "logo_url": "https://reflect.app/site/icons/512x512-rounded.png",
//   "api": {
//     "type": "openapi",
//     "has_user_authentication": false,
//     "url": "https://reflect-chatgpt.teamreflect.workers.dev/openapi.json"
//   }
// }

import { OpenApiZodAny } from '@anatine/zod-openapi'
import { RequestMethod } from 'cloudflare-basics'
import { ParameterObject } from 'openapi3-ts/oas31'

interface AiPluginAuthOAuth {
  type: 'oauth'
  client_url: string
  scope: string
  authorization_url: string
  authorization_content_type: string
  verification_tokens: {
    openai: string
  }
}

type HttpAuthorizationType = 'bearer' | 'basic'

interface AiPluginAuthServiceHttp {
  type: 'service_http'
  authorization_type: HttpAuthorizationType
}

interface AiPluginAuthUserHttp {
  type: 'user_http'
  authorization_type: HttpAuthorizationType
}

interface AiPluginAuthNone {
  type: 'none'
}

type AiPluginAuth =
  | AiPluginAuthOAuth
  | AiPluginAuthServiceHttp
  | AiPluginAuthUserHttp
  | AiPluginAuthNone

export interface AiPlugin {
  schema_version: 'v1'
  auth: AiPluginAuth
  name_for_human: string
  name_for_model: string
  description_for_human: string
  description_for_model: string
  contact_email: string
  legal_info_url: string
  logo_url: string
  api: {
    type: 'openapi'
    has_user_authentication: boolean
    url: string
  }
}

interface AiPluginOptionsAuthOAuth {
  type: 'oauth'
  // OAuth authorization url
  clientUrl: string
  // OAuth scope
  scope: string
  // OAuth access token url
  authorizationUrl: string
  openAiVerificationToken: string
}

interface AiPluginOptionsAuthServiceHttp {
  type: 'service_http'
  authorizationType: HttpAuthorizationType
}

interface AiPluginOptionsAuthUserHttp {
  type: 'user_http'
  authorizationType: HttpAuthorizationType
}

export interface AiPluginOptions {
  // Human readable plugin name (e.g. "Reflect Notes")
  humanName: string
  // Model name (e.g. "reflect_notes")
  modelName: string
  // Human readable plugin description
  humanDescription: string
  // Model description
  modelDescription: string
  // Contact email
  contactEmail: string
  // Legal terms of service url
  legalInfoUrl: string
  // Logo url (e.g. https://logo.clearbit.com/reflect.app)
  logoUrl: string
  // OpenAPI url (e.g. https://reflect-chatgpt.teamreflect.workers.dev/openapi.json)
  apiUrl: string

  // Authentication options
  auth?:
    | AiPluginOptionsAuthOAuth
    | AiPluginOptionsAuthServiceHttp
    | AiPluginOptionsAuthUserHttp
}

// openapi

export interface OpenApiPath {
  path: string
  method: RequestMethod
  operationId?: string
  tags?: string[]
  summary: string
  parameters?: ParameterObject
  requestSchema: OpenApiZodAny
  responseSchema: OpenApiZodAny
}

export interface OpenApiOptions {
  title: string
  description: string
  version: string
  paths: OpenApiPath[]
}
