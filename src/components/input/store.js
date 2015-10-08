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

    @bind(actions.doAnAction)
    onUpdate(val) {


        
    }


}

export default DummyStore;
