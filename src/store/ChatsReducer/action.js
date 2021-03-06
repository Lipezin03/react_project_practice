import { onValue, set, push } from "firebase/database";
import {
    chatsRef,
    messagesRef,
    getChatMsgsRefById,
    getChatRefById,
    getChatMsgsListRefById,
} from "../../services/firebase";
import { AUTHORS } from "../../utils/constans"

export const ADD_CHAT_LIST = "CHATS::ADD_CHAT_LIST"
export const addChatList = (newName) => ({
    type: ADD_CHAT_LIST,
    payload: newName,
})



export const DELETE_CHAT_LIST = "CHATS::DELETE_CHAT_LIST"
export const deleteChatList = (name) => ({
    type: DELETE_CHAT_LIST,
    payload: name,
})



export const ADD_NEW_CHAT = "CHATS::ADD_NEW_CHAT"
export const addNewChat = (newName) => ({
    type: ADD_NEW_CHAT,
    payload: newName,
})


export const DELETE_CHAT = "CHATS::DELETE_CHAT"
export const deleteChat = (name) => ({
    type: DELETE_CHAT,
    payload: name,
})



export const ADD_NEW_MESSAGE = "CHATS::ADD_NEW_MESSAGE"
export const addNewMessage = (chatName, newMessage) => ({
    type: ADD_NEW_MESSAGE,
    payload: {
        chatName,
        newMessage
    }
})

export const DELETE_MESSAGE = "CHATS::DELETE_MESSAGE";
export const deleteMessage = (chatName, idMessage) => ({
    type: DELETE_MESSAGE,
    payload: {
        chatName,
        idMessage,
    }
})


export const HIDEN_BUTTON_DEL = "CHATS::HIDEN_BUTTON_DEL";
export const hidenButtonDel = () => ({
    type: HIDEN_BUTTON_DEL,
})

export const VISIBLE_BUTTON_DEL = "CHATS::VISIBLE_BUTTON_DEL";
export const visibleButtonDel = (idBtn) => ({
    type: VISIBLE_BUTTON_DEL,
    payload: idBtn,
})


export const SET_CHATS = "CHATS::SET_CHATS";
export const setChats = (chats) => ({
    type: SET_CHATS,
    payload: chats,
});



export const addMessageWithThunk = (chatUrlName, newMessage) => (dispatch) => {
    dispatch(addNewMessage(chatUrlName, newMessage));

    if (newMessage.autor === AUTHORS.User) {
        setTimeout(() => {
            const botMessage = {
                autor: AUTHORS.Bot,
                message: "Сообщение принято, мы с вами свяжимся!",
                id: Date.now()
            }

            dispatch(addNewMessage(chatUrlName, botMessage))

        }, 1500)
    }
}



export const addChatWithFb = (newChat) => (dispatch) => {
    set(getChatMsgsRefById(newChat), { empty: true });
    set(getChatRefById(newChat), { name: newChat });
};


export const addMessageWithFb = (chatUrlName, newMessage) => (dispatch) => {

    push(getChatMsgsListRefById(chatUrlName), newMessage);

};


export const initChatsTracking = () => (dispatch) => {
    onValue(chatsRef, (chatsSnap) => {
        const newChats = [];

        chatsSnap.forEach((snapshot) => {
            newChats.push(snapshot.val().name);
        });

        dispatch(setChats(newChats));
    });
};



export const initChatsMessageTracking = () => (dispatch) => {
    onValue(messagesRef, (snapshot) => {
        const newMsg = {};
        snapshot.forEach((chatMsgSnap) => {
            newMsg[chatMsgSnap.key] = Object.values(chatMsgSnap.val().messageList || {})
        })

        dispatch(addNewChat(newMsg))
    })
};


