import update from 'immutability-helper';
import { Reducer } from 'redux';
import { ChatsActions, ChatsActionTypes } from './chatsActions';
import * as db from '../../db.json';

export type ChatsReducerState = {
    loading: boolean;
    chats: Chat[];
};

const initialState: ChatsReducerState = {
    loading: false,
    chats: [],
};

export const chatsReducer: Reducer<ChatsReducerState, ChatsActions> = (state = initialState, action) => {
    switch (action.type) {
        case ChatsActionTypes.CHATS_LOAD:
            return {
                ...state,
                chats: db.chats,
                activeChatId: db.chats[0].id,
            };

        case ChatsActionTypes.CHATS_ADD:
            return update(state, {
                chats: {
                    $push: [action.chat]
                },
            });

        case ChatsActionTypes.CHATS_DELETE:
            // Getting chat array id
            const id = state.chats.findIndex(chat => chat.id === action.id);
            if (id !== -1) {
                return update(state, {
                    chats: {
                        $splice: [[id, 1]],
                    },
                });
            } else {
                return state;
            }
        default:
            return state;
    }
}