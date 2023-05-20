import { Router, json, withZod } from 'cloudflare-basics';
import { addOpenApiRoute, addAiPluginRoute } from 'cloudflare-basics-ai-plugin';
import { z } from 'zod';

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
  //
  // Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
  // MY_QUEUE: Queue;

  FOO: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const router = new Router<Env>();

    const requestSchema = z.object({
      markdown: z.string(),
    });

    const responseSchema = z.object({
      success: z.boolean(),
    });

    const route = withZod<Env, z.infer<typeof requestSchema>>(requestSchema, async (options) => {
      console.log('Creating note', options.data.markdown);

      return json({ success: true });
    });

    router.post('/notes', route);

    addOpenApiRoute(router, {
      title: 'Reflect Notes',
      description: 'A plugin that allows the user to save notes. For example, saving a summary of their ChatGPT conversation history.',
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
    });

    addAiPluginRoute(router, {
      humanName: 'Reflect Notes',
      modelName: 'reflect_notes',
      humanDescription: 'A plugin that allows the user to save notes. For example, saving a summary of their ChatGPT conversation history.',
      modelDescription:
        'Reflect notes plugin for ChatGPT. This plugin allows the user to save notes. For example, saving a summary of their ChatGPT conversation history.',
      contactEmail: 'support@reflect.app',
      legalInfoUrl: 'https://reflect.app/terms',
      logoUrl: 'https://logo.clearbit.com/reflect.app',
    });

    return router.handle(request, env, ctx) ?? new Response('Not Found', { status: 404 });
  },
};
