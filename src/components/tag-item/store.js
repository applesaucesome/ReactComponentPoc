import flux from 'control';
import {
    createStore, bind
}
from 'alt/utils/decorators';
import actions from './actions';

@createStore(flux)
class DummyStore {

    constructor() {

        // give a default value
        this.state = {
            value: 'foo'
        };
    }

    @bind(actions.onMount)
    onComponentMount(data){
        // console.log('testdfs', data)
        this.setState({
            refs: data
        })
    }


}

export default DummyStore;
