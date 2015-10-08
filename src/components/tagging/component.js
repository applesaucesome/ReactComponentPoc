import React from 'react';
import Actions from './actions';
import Store from './store';
import connectToStores from 'alt/utils/connectToStores';
import Tags from '../title-item';
import Input from '../input';

import AltContainer from 'alt/AltContainer';
/**
*
* need to make sure the "@connectToStores" decorator is the outermost decorator to ensure that your other decorators are applied to your actual component rather than the wrapped component
* 
* example:
* @connectToStores
* @someDecorator
* @anotherDecorator
*
**/

class Tagging extends React.Component {
    constructor(props) {
        super(props);
        this.state = Store.getState();


    }
    static getStores(props) {
        return [Store];
    }

    static getPropsFromStores(props) {
        return Store.getState();
    }

    handleCancelEdit(e){
        const data = {e}
        Actions.onCancelEdit(data);
    }

    handleRemoveItem(id){
        const data = {id}
        Actions.onRemoveItem(data);
    }

    handleTitleDoubleClick(id, e){

        const data = {id, e}
        Actions.onTitleDoubleClick(data);
    }

    handleTitleEdit(e, id, text){
        const data = {e, id, text, this}
        Actions.onTitleEdit(data);
    }

    handleTagEntry(e) {

        const data = {e}
        Actions.onTagEntry(data);

    }

    render() {

 

        return (
            <AltContainer
            store={Store}
            actions={Actions}
            >

            <Tags />

            </AltContainer>
        );
    }
}

export default Tagging;
