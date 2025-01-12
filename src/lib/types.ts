type MessageSender = 'assistant' | 'user';
export interface Message {
	content: string;
	role: MessageSender;
}
