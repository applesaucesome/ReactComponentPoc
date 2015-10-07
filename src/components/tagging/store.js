import React from 'react';
import flux from 'control';
import {
    createStore, bind
}
from 'alt/utils/decorators';
import actions from './actions';

@createStore(flux)
class Store {

    constructor() {

        // give a default value
        this.state = {
            initialCount: [{
                title: 'hi'
            }, {
                title: 'hello'
            }, {
                title: 'bye'
            }],
            changeContent: true,
            inputText: '',
            editTag: false,
            currentTitle: undefined,
            maxTitles: 5
        };
    }

    @bind(actions.onCancelEdit)
    cancelTagEdit(data) {

        this.setState({
            editTag: false
        });

    }



    @bind(actions.onRemoveItem)
    removeItem(data) {

        this.state.initialCount.splice(data.id, 1);

        this.setState({
            initialCount: this.state.initialCount
        });

    }

    @bind(actions.onTitleDoubleClick)
    titleDoubleClick(data) {
        
        this.setState({
            editTag: true,
            currentTitle: data.id
        });

    }

    @bind(actions.onTitleEdit)
    titleEdit(data) {
        
        this.state.initialCount.splice(data.id, 1, {
            title: data.text
        });

        this.setState({
            initialCount: this.state.initialCount,
            editTag: false
        });

        // Refocus to input once you edit a tag
        React.findDOMNode(data.this.refs.tagEntry.refs.tagEntryInput).focus();

    }

    @bind(actions.onInputEnter)
    inputEnter(data) {

        const inputText = data.e.target.value;

        this.setState({
            title: inputText
        });
    }

    @bind(actions.onTagEntry)
    newTagEnter(data) {     

        const inputText = data.e.target.value;

        this.state.initialCount.push({
            title: inputText
        });

        this.setState({
            initialCount: this.state.initialCount
        });
   
    }

}

export default Store;
