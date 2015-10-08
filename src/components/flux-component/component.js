import React from 'react';
import Actions from './actions';
import Store from './store';
import connectToStores from 'alt/utils/connectToStores';
import AltContainer from 'alt/AltContainer';

import Header from '../header';
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

class TestComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        // console.log(this.props);

    }

    onButtonClick(){

        Actions.doAnAction('bar');


    }
    resetInput(){
        Actions.doAnAction('');        
    }
    render() {
        var divStyle = {
            border: '1px solid black'
        };
        var buttonStyle = {
            display: 'inline-block',
            padding: '10px',
            background: 'silver',
            border: '1px solid gray',
            borderRadius: '10%'
        };

        return (

            <AltContainer 
            store={Store}
            actions={Actions}
            style={divStyle}>
                <Header />
                <h1>Flux Test Component</h1>
                <input className="testInput" value={this.props.value} />
                <div style={buttonStyle} className="myButton" onClick={this.onButtonClick}>Test Button</div>
                <div style={buttonStyle} className="resetButton" onClick={this.resetInput}>Reset</div>
            </AltContainer>
        );
    }
}

export default TestComponent;
