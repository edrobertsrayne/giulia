<script lang="ts">
	let value = $state('');
	let inputElement: HTMLInputElement;
	let chatContainer: HTMLDivElement;

	let enableAutoScroll = $state(true);

	type MessageSender = 'host' | 'user';
	interface Message {
		content: string;
		sender: MessageSender;
	}

	let messages = $state<Message[]>([
		{
			sender: 'host',
			content:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc auctor nisi condimentum ipsum tempus consectetur. Nullam eu pharetra metus. Morbi sodales bibendum dolor, at consectetur orci sollicitudin nec. Fusce sit amet interdum quam. Sed augue felis, pulvinar nec aliquet a, hendrerit a arcu. Donec mollis, urna a malesuada pulvinar, erat sapien consequat lorem, in sodales nisl felis nec turpis. Donec rutrum commodo imperdiet. Nam a dignissim justo. Nulla egestas risus arcu, vitae bibendum erat tincidunt ut. Ut aliquet interdum consequat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;'
		},
		{
			sender: 'user',
			content:
				'Maecenas interdum nibh vitae nisi iaculis, a elementum nunc convallis. Proin malesuada tristique neque, sed pharetra dui pulvinar quis. Donec vestibulum a mauris in maximus. Phasellus et ipsum convallis dolor efficitur feugiat. Phasellus facilisis nulla urna, ac imperdiet ipsum elementum accumsan. Curabitur libero odio, convallis vel ex a, laoreet bibendum neque. Aenean id tellus massa. Ut euismod dictum magna et mollis. Proin feugiat fermentum justo. Nunc at tortor cursus tortor feugiat euismod. Etiam erat quam, mattis et lacinia a, fermentum sit amet eros. Vivamus vitae commodo nisi, at pharetra lorem. Fusce a quam id enim dictum rhoncus. Proin sit amet cursus quam. Nullam quis risus a nunc ornare blandit. Nulla nec mi leo.'
		},
		{
			sender: 'host',
			content:
				'Aliquam fermentum nisl nec mattis euismod. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce tristique nibh in rhoncus tincidunt. Cras gravida ex augue, gravida congue leo eleifend consectetur. Phasellus mollis at erat non condimentum. Pellentesque lorem enim, viverra vitae felis at, tincidunt tincidunt orci. Nam a libero facilisis, molestie lorem vitae, venenatis ipsum. Etiam tempus ornare convallis.'
		},
		{
			sender: 'user',
			content:
				'Cras augue quam, vestibulum sit amet viverra at, lobortis ut nulla. Integer ultrices fermentum lacus, non ultrices arcu tincidunt et. Vivamus a accumsan nulla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer venenatis vel nisi id tempor. Integer eros velit, laoreet vitae scelerisque eu, scelerisque sit amet dui. Nulla ultricies erat vel nisi pellentesque, et ultricies justo elementum. In sed blandit mi. Sed ipsum diam, mattis at tortor nec, accumsan ullamcorper ligula. Aenean sed dolor nec nisl ultrices facilisis at vel nulla. Curabitur at ultrices neque. Proin et faucibus massa. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut et velit sed est pellentesque consequat.'
		},
		{
			sender: 'host',
			content:
				'In hac habitasse platea dictumst. Nulla facilisi. Etiam et dui pellentesque dui interdum eleifend consectetur ut diam. Nulla facilisi. Nulla a tortor ac leo aliquam rutrum in nec lorem. Aenean quis ligula nulla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nunc consequat, eros a mollis pellentesque, eros ante euismod risus, venenatis dictum ex libero in sem. Donec tincidunt justo risus, sed volutpat libero iaculis a. Suspendisse vestibulum, ligula molestie lacinia venenatis, augue purus dapibus mauris, nec dictum mi eros quis nibh. Duis in porta nibh.'
		}
	]);

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

	function onScroll() {
		const { scrollTop, scrollHeight, clientHeight } = chatContainer;
		enableAutoScroll = scrollHeight - (scrollTop + clientHeight) < 100;
	}

	function scrollToBottom() {
		setTimeout(() => {
			chatContainer?.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
		}, 0);
	}

	function handleSubmit() {
		if (!value.trim()) return;
		messages.push({ content: value, sender: 'user' });
		value = '';
		enableAutoScroll = true;
	}
</script>

<div class="flex-1 overflow-y-auto bg-base-200 p-4" bind:this={chatContainer} onscroll={onScroll}>
	{#each messages as message}
		<div class="chat chat-{message.sender == 'host' ? 'start' : 'end'}">
			<div class="chat-bubble {message.sender == 'host' ? 'chat-bubble-secondary' : ''}">
				{message.content}
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
