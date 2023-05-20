import { RouteOptions, Router, json } from 'cloudflare-basics'
import { AiPluginOptions, AiPlugin } from './types'

export function buildAiPlugin(options: AiPluginOptions): AiPlugin {
  const aiPlugin: AiPlugin = {
    schema_version: 'v1',
    auth: options.auth
      ? options.auth.type === 'oauth'
        ? {
            type: 'oauth',
            client_url: options.auth.clientUrl,
            scope: options.auth.scope,
            authorization_url: options.auth.authorizationUrl,
            authorization_content_type: 'application/json',
            verification_tokens: {
              openai: options.auth.openaiVerificationToken,
            },
          }
        : options.auth.type === 'service_http'
        ? {
            type: 'service_http',
            authorization_type: options.auth.authorizationType,
          }
        : options.auth.type === 'user_http'
        ? {
            type: 'user_http',
            authorization_type: options.auth.authorizationType,
          }
        : {
            type: 'none',
          }
      : {
          type: 'none',
        },
    name_for_human: options.humanName,
    name_for_model: options.modelName,
    description_for_human: options.humanDescription,
    description_for_model: options.modelDescription,
    contact_email: options.contactEmail,
    legal_info_url: options.legalInfoUrl,
    logo_url: options.logoUrl,
    api: {
      type: 'openapi',
      has_user_authentication: false,
      url: options.apiUrl,
    },
  }

  return aiPlugin
}

export function AiPluginRoute<Env>(options: Omit<AiPluginOptions, 'apiUrl'>) {
  return async (route: RouteOptions<Env>) => {
    const origin = route.request.url.origin
    const apiUrl = `${origin}/openapi.json`

    return json(buildAiPlugin({ ...options, apiUrl }))
  }
}

export function addAiPluginRoute<Env>(
  router: Router<Env>,
  options: Omit<AiPluginOptions, 'apiUrl'>,
  path = '/.well-known/ai-plugin.json'
) {
  router.get(path, AiPluginRoute(options))
}
