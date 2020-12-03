import {
    SAVE_MESSAGE,
} from './types';


export function saveMessage(conversation){
    return {
        type : SAVE_MESSAGE,
        payload : conversation
    }
}
