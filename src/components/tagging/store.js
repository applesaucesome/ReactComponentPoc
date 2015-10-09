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
            currentTitle: 0,
            maxTitles: 5,
            refs: undefined
        };
    }

    @bind(actions.onMount)
    onComponentMount(data){
        
        this.setState({
            refs: data
        })


    }

    @bind(actions.onCancelEdit)
    cancelTagEdit(data) {

        this.setState({
            editTag: false
        });

        if (this.state.initialCount.length < this.state.maxTitles) {
            React.findDOMNode(this.state.refs.tagEntry.refs.tagEntryInput).focus();
        }

    }



    @bind(actions.onRemoveItem)
    removeItem(data) {

        this.state.initialCount.splice(data[0], 1);

        this.setState({
            initialCount: this.state.initialCount
        });

    }

    @bind(actions.onTitleDoubleClick)
    titleDoubleClick(data) {
        
        // console.log('titleDoubleClick arguments -', arguments);
        // console.log('titleDoubleClick data -', data);
        // console.log('titleDoubleClick this -', this);

        this.setState({
            editTag: true,
            currentTitle: data[0]
        });


    }

    @bind(actions.onTitleEdit)
    titleEdit(data) {
        // console.log('titleEdit', data)
        
        this.state.initialCount.splice(this.state.currentTitle, 1, {
            title: data[2]
        });

        this.setState({
            initialCount: this.state.initialCount,
            editTag: false
        });

        console.log('this.state.initialCount=', this.state.initialCount)
        console.log('this.state.maxTitles=', this.state.maxTitles)
        // Refocus to input once you edit a tag
        if (this.state.initialCount.length < this.state.maxTitles) {
            React.findDOMNode(this.state.refs.tagEntry.refs.tagEntryInput).focus();
        }

    }


    @bind(actions.onTagEntry)
    newTagEnter(data) {     
        
        // console.log('newTagEnter=', data);

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
