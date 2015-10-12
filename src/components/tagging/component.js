import React from 'react';
import Actions from './actions';
import Store from './store';
// import connectToStores from 'alt/utils/connectToStores';

import Tags from '../tag-item/component';
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
// @connectToStores
class Tagging extends React.Component {
    constructor(props) {
        super(props);
        this.state = Store.getState();


    }
    /*static getStores(props) {
        return [Store];
    }

    static getPropsFromStores(props) {
        return Store.getState();
    }*/

    
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
