import flux from 'control';
import {
    createActions
}
from 'alt/utils/decorators';

@createActions(flux)
class Actions {
    constructor() {
        // if you don't need to parse anything and just want to generate actions to pass to the dispatcher
        // this.generateActions('onMount', 'onCancelEdit', 'onRemoveItem', 'onTagDoubleClick', 'onTagEdit', 'onTagEntry');
    }
    onMount(data) {

        this.dispatch(data)
    }
    onCancelEdit(data) {

        this.dispatch(data)
    }
    onRemoveItem(i, e) {
        const parsedData = {
            i: i,
            e: e
        };
        this.dispatch(parsedData)
    }
    onTagDoubleClick(i, e) {
        e.persist();
        // console.log('double click argu', arguments)
        const parsedData = {
            i: i,
            e: e
        };
        this.dispatch(parsedData)
    }
    onTagEdit(e, i, inputText) {

        const parsedData = {
            e: e,
            i: i,
            inputText: inputText
        };
        this.dispatch(parsedData)
    }
    onTagEntry(e, inputText) {
        const parsedData = {
            e: e,
            inputText: inputText
        };
        this.dispatch(parsedData)
    }
}



export default Actions;
