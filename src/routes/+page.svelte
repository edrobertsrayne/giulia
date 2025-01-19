<script lang="ts">
	import { autoFocus, contextMessage, generateTTS, renderMessage } from '$lib';
	import { LocalStore } from '$lib/localstore.svelte';
	import type { Message } from '$lib/types';
	import { getContext, onMount } from 'svelte';
	import { firekitUser } from 'svelte-firekit';

	let value = $state('');
	let inputElement: HTMLInputElement;
	let chatContainer: HTMLDivElement;
	let micButton: HTMLButtonElement;

	const SpeechRecognition =
		window.SpeechRecognition ||
		window.webkitSpeechRecognition ||
		window.mozSpeechRecognition ||
		window.msSpeechRecognition;
	let recognition: typeof SpeechRecognition | null = null;

	if (SpeechRecognition) {
		recognition = new SpeechRecognition();
		recognition.lang = 'it-IT';

		recognition.onresult = (event: SpeechRecognitionEvent) => {
			const transcript = event.results[0][0].transcript;
			value = transcript;
			handleSubmit();
			console.log(transcript);
		};
	} else {
		console.error('Speech recognition is not supported in this browser.');
	}

	let enableAutoScroll = $state(true);

	let messages = $state<Message[]>([]);

	let enableTextToSpeech: LocalStore<boolean> = getContext('enableTextToSpeech');

	$effect(() => {
		if (chatContainer && enableAutoScroll) {
			scrollToBottom();
			enableAutoScroll = false;
		}
	});

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
				if (enableTextToSpeech.value) {
					await generateTTS(message.text);
				}
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

	function handleRecognition() {
		recognition.start();
	}

	onMount(async () => {
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

<div class="flex bg-base-100 p-2">
	<div class="flex-1">
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
	<button
		type="button"
		aria-label="record voice input"
		class="btn btn-circle {SpeechRecognition ? 'btn-accent' : 'btn-disabled'} ml-2 flex-none"
		bind:this={micButton}
		onclick={handleRecognition}
		disabled={!SpeechRecognition}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height="24px"
			viewBox="0 -960 960 960"
			width="24px"
			fill="#e8eaed"
		>
			<path
				d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z"
			/>
		</svg>
	</button>
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
