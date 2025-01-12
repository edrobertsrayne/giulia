<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import { firekitUser } from 'svelte-firekit';

	let value = $state('');
	let inputElement: HTMLInputElement;
	let chatContainer: HTMLDivElement;
	let enableAutoScroll = $state(true);

	type MessageSender = 'assistant' | 'user';
	interface Message {
		content: string;
		role: MessageSender;
	}

	let messages = $state<Message[]>([]);

	async function generateTTS(text: string) {
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

	function autoFocus(node: HTMLElement) {
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

	$effect(() => {
		if (chatContainer && enableAutoScroll) {
			scrollToBottom();
			enableAutoScroll = false;
		}
	});

	async function renderMessage(text: string) {
		return DOMPurify.sanitize(await marked.parse(text));
	}

	function onscroll() {
		const { scrollTop, scrollHeight, clientHeight } = chatContainer;
		enableAutoScroll = scrollHeight - (scrollTop + clientHeight) < 100;
	}

	async function sendMessages(messagesToSend: Message[]) {
		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				body: JSON.stringify({ messages: messagesToSend })
			});

			const data = await response.json();
			for (let message of data.content) {
				messages.push({ content: message.text, role: 'assistant' });
				await generateTTS(message.text);
			}

			enableAutoScroll = true;
		} catch (error) {
			console.error('Error sending message:', error);
		}
	}

	function scrollToBottom() {
		setTimeout(() => {
			chatContainer?.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
		}, 0);
	}

	async function handleSubmit() {
		if (!value.trim()) return;

		messages.push({ content: value, role: 'user' });
		enableAutoScroll = true;

		await sendMessages($state.snapshot(messages));

		value = '';
	}

	onMount(async () => {
		const instructions = [
			'Act as a supportive Italian teacher called Giulia.',
			'Provide a conversation class aimed at a beginner Italian learner.',
			'When they make mistakes, try and offer help.',
			'Stick to Italian for the whole conversation and do not provide translations.',
			'When the user has finished the conversation the user will type "thank you".',
			'After the conversation, provide them with some feedback in English to help them improve.',
			'Start the conversation by introducing yourself and letting the user know the stop phrase.'
		];
		const contextMessage: Message[] = [
			{
				role: 'user',
				content: instructions.join(' ')
			}
		];
		sendMessages(contextMessage);
	});
</script>

<div class="flex-1 overflow-y-auto bg-base-200 p-4" bind:this={chatContainer} {onscroll}>
	{#each messages as message}
		<div class="chat chat-{message.role == 'assistant' ? 'start' : 'end'}">
			<div class="avatar chat-image">
				<div class="w-10 rounded-full">
					{#if message.role == 'assistant'}
						<img src="/avatar.webp" alt="Giulia's avatar" />
					{:else}
						<img src={firekitUser.photoURL} alt="User's avatar" />
					{/if}
				</div>
			</div>
			<div class="chat-bubble {message.role == 'assistant' ? 'chat-bubble-secondary' : ''}">
				{#await renderMessage(message.content) then content}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html content}
				{/await}
			</div>
		</div>
	{/each}
</div>

<div class="bg-base-100 p-2">
	<form class="join flex" onsubmit={handleSubmit}>
		<input
			bind:value
			bind:this={inputElement}
			use:autoFocus
			type="text"
			placeholder="Type a message..."
			class="no-highlight input join-item flex-1"
		/>
		<button type="submit" class="btn btn-primary join-item" disabled={!value.trim()}>Send</button>
	</form>
</div>

<style>
	/*  Hide scrollbar for a cleaner look */
	.overflow-y-auto::-webkit-scrollbar {
		display: none;
	}

	.overflow-y-auto {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	/* Prevent input highlight/selection styles */
	.no-highlight {
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	/* Remove the focus outline */
	.no-highlight:focus {
		outline: none;
	}
</style>
