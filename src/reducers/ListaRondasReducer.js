import { LISTA_RONDA } from '../Actions/Types';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case LISTA_RONDA:
            console.log("passouaqui");
            return action.payload;
        default:
            return state;
    }
}