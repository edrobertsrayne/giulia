import { ELEVENLABS_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';
const voice_id = 'EXAVITQu4vr4xnSDxMaL';
const model_id = 'eleven_flash_v2';

export async function POST({ request }) {
	const { text } = await request.json();
	try {
		const response = await fetch(`${ELEVENLABS_API_URL}/${voice_id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'xi-api-key': ELEVENLABS_API_KEY
			},
			body: JSON.stringify({ text, model_id })
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Elevenlabs API error:', errorData);
			return json({ error: 'Failed to generate TTS' }, { status: 500 });
		}

		const audioBuffer = await response.arrayBuffer();
		return new Response(audioBuffer, {
			headers: {
				'Content-Type': 'audio/mpeg'
			}
		});
	} catch (error) {
		console.error('Elevenlabs API error:', error);
		return new Response(String(error), { status: 500 });
	}
}
