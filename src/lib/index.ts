import DOMPurify from 'dompurify';
import { marked } from 'marked';
import type { Message } from './types';

export async function generateTTS(text: string) {
	try {
		const response = await fetch('/api/speech', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text })
		});

		if (!response.ok) {
			throw new Error('Failed to generate TTS');
		}

		const blob = await response.blob();
		const audioUrl = URL.createObjectURL(blob);
		const audio = new Audio(audioUrl);
		await audio.play();
	} catch (error) {
		console.error(error);
	}
}

export function autoFocus(node: HTMLElement) {
	node.focus();

	// refocus after clicking in the app
	const handleClick = () => {
		node.focus();
	};

	// refocus after sending a message
	const handleBlur = () => {
		// allow other handlers to execute first
		setTimeout(() => {
			node.focus();
		}, 0);
	};

	document.addEventListener('click', handleClick);
	node.addEventListener('blur', handleBlur);

	return {
		destroy() {
			document.removeEventListener('click', handleClick);
			node.removeEventListener('blur', handleBlur);
		}
	};
}

export async function renderMessage(text: string) {
	return DOMPurify.sanitize(await marked.parse(text));
}

const instructions = [
	'Act as a supportive Italian teacher called Giulia.',
	'Provide a conversation class aimed at a beginner Italian learner.',
	'When they make mistakes, try and offer help.',
	'Stick to Italian for the whole conversation and do not provide translations.',
	'When the user has finished the conversation the user will type "thank you".',
	'After the conversation, provide them with some feedback in English to help them improve.',
	'Start the conversation by introducing yourself and letting the user know the stop phrase.'
];
export const contextMessage: Message[] = [
	{
		role: 'user',
		content: instructions.join(' ')
	}
];
