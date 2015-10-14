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
                tag: 'hi'
            }, {
                tag: 'hello'
            }, {
                tag: 'bye'
            }],
            changeContent: true,
            inputText: '',
            editTag: false,
            currentTag: 0,
            maxTags: 5,
            refs: undefined
        };
    }

    @bind(actions.onMount)
    onComponentMount(data){
        
        this.setState({
            refs: data
        });

    }

    @bind(actions.onCancelEdit)
    cancelTagEdit(data) {

        this.setState({
            editTag: false
        });

        if (this.state.initialCount.length < this.state.maxTags) {
            React.findDOMNode(this.state.refs.tagEntry).focus();
        }

    }



    @bind(actions.onRemoveItem)
    removeItem(data) {

        this.state.initialCount.splice(data.i, 1);

        this.setState({
            initialCount: this.state.initialCount
        });

    }

    @bind(actions.onTagDoubleClick)
    tagDoubleClick(data) {

        
        const tagValue = data.e.target.innerText;

        this.setState({
            editTag: true,
            editTagValue: tagValue,
            currentTag: data.i
        });

    }

    @bind(actions.onTagEdit)
    tagEdit(data) {
        
        this.state.initialCount.splice(this.state.currentTag, 1, {
            tag: data.inputText
        });

        this.setState({
            initialCount: this.state.initialCount,
            editTag: false
        });


        // Refocus to input once you edit a tag
        if (this.state.initialCount.length < this.state.maxTags) {
            React.findDOMNode(this.state.refs.tagEntry).focus();
        }

    }


    @bind(actions.onTagEntry)
    newTagEnter(data) {     
        
        // console.log('newTagEnter=', data);

        const inputText = data.e.target.value;

        this.state.initialCount.push({
            tag: inputText
        });

        this.setState({
            initialCount: this.state.initialCount
        });
   
    }

}

export default Store;
