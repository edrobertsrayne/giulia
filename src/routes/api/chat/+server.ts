import { ANTHROPIC_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

export const POST: RequestHandler = async ({ request }) => {
	const { messages } = await request.json();
	try {
		const response = await anthropic.messages.create({
			model: 'claude-3-5-sonnet-20241022',
			max_tokens: 1024,
			messages
		});
		return json(response);
	} catch (error) {
		console.error('Anthropic API error:', error);
		return new Response(String(error), { status: 500 });
	}
};
