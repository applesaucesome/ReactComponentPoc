import React from 'react';
import Actions from './actions';
import Store from './store';
import connectToStores from 'alt/utils/connectToStores';

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
@connectToStores
class TestComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        // console.log(this.props);

    }
    static getStores(props) {
        return [Store];
    }

    static getPropsFromStores(props) {
        return Store.getState();
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

            <div style={divStyle}>
            <h1>Flux Test Component</h1>
            <input className="testInput" value={this.props.value} />
            <div style={buttonStyle} className="myButton" onClick={this.onButtonClick}>Test Button</div>
            <div style={buttonStyle} className="resetButton" onClick={this.resetInput}>Reset</div>
            </div>
        );
    }
}

export default TestComponent;
