import flux from 'control';
import {
    createStore, bind
}
from 'alt/utils/decorators';
import actions from 'actions/actions';

@createStore(flux)
class DummyStore {

    constructor() {
        this.state = {
            value: 'foo'
        };
    }

    @bind(actions.doAnAction)
    onUpdateCity(val) {

        console.log('onUpdateCity fired');

        this.setState({
            value: val
        });
        
    }


}

export default DummyStore;
