import {Middleware} from "redux";
import {ChatActionTypes, ChatAddAction} from "../actions/chats";
import {push} from "connected-react-router";

export const AddChatMiddleware: Middleware = store => next => action =>{
    if (action.type === ChatActionTypes.CHAT_ADD || action.type === ChatActionTypes.CHAT_ADD_SUCCESS){
        let chat = (action as ChatAddAction).payload;

        const newId = store.getState().chats.entries.length;
        chat.id = newId;

        store.dispatch(push(`/chat/${newId}`));
    }

    return next(action);
};
