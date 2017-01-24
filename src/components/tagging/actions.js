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
    onWillMount(){

        let self = this;

        var result = fetch('/api/ideas/56018d113d39e933e442c39a')
        result.then(function(response) {

          console.log('response', response);
          console.log('header', response.headers.get('Content-Type'));

          return response.text();

        }).then(function(text) {

            // console.log('got text', text);

            self.dispatch(text);

        }).catch(function(ex) {

          console.log('failed', ex)

        });
        

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
