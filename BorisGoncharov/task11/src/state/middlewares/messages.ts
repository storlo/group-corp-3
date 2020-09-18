import { Middleware } from 'redux';
import { generate } from 'shortid';
import { chatsMarkUnread, chatsResetTypingAuthor, chatsSetTypingAuthor, MessagesActionTypes, messagesAdd, MessagesAddSuccessAction } from '../actions';
import { AppState } from '../store';

const BOT = {
  id: '007213',
  name: 'Bot'
}

export const messagesMiddleware: Middleware = store => next => action => {
  if (action.type === MessagesActionTypes.MESSAGES_ADD_SUCCESS) {
    const messageId = (action as MessagesAddSuccessAction).payload;
    const state = (store.getState() as AppState);
    const foundMessage = state.messages.messages.find(message => message.id === messageId);

    if (!foundMessage) {
      return next(action);
    }

    const { chatId, authorId, authorName } = foundMessage;
    const typingAuthor = state.chats.chats.find(chat => chat.id === chatId)?.typingAuthor;
    const botIsWriting = typingAuthor === BOT.name;
    const activeChatId = state.router.location.pathname.substring(1);

    // Send Bot's response on user message
    // We don't send another Bot's response if Bot is already typing
    if (authorId !== BOT.id && !botIsWriting) {
      store.dispatch(chatsSetTypingAuthor({ chatId, author: BOT.name }));

      setTimeout(() => {
        store.dispatch(messagesAdd({
          id: generate(),
          chatId,
          authorName: BOT.name,
          authorId: BOT.id,
          text: `Hi, ${authorName}! This is ${BOT.name}...`,
          closable: true,
          date: new Date().toISOString(),
          sentOnServer: true,
        }) as any);

        store.dispatch(chatsResetTypingAuthor(chatId));
      }, 2000);
    }

    // Highlight chat if message arrived in inactive chat
    if (chatId !== activeChatId) {
      store.dispatch(chatsMarkUnread(chatId));
    }
  }

  return next(action);
};