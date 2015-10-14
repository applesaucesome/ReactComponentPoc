import React from 'react';
import connectToStores from 'alt/utils/connectToStores';
import Store from './store';
import Actions from './actions';
import Tagging from '../tagging/component';


function fooDecorator(functionParam){

    functionParam.prototype.newFunction = function(){
        console.log('blahBlah');
    }

    return functionParam;
}


@fooDecorator
class testFunction{
    constructor(testParam){
        return testParam;
    }
}

var decoratedFunction = new testFunction();
decoratedFunction.newFunction();


@connectToStores
class PitchPhase extends React.Component {
    constructor(props) {
        super(props);

        // Expected initial data set
        this.state = {};


        // foo(testFunction)

    }

    static getStores(props) {
        return [Store];
    }

    static getPropsFromStores(props) {
        return Store.getState();
    }

    render() {

        return (
            <div>

                <h2>Tagging</h2>
                <p>List all Tags</p>
                <Tagging />
                
            </div>
        );

    }

}

export default PitchPhase;
