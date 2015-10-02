import flux from 'control';
import {
    createStore, bind
}
from 'alt/utils/decorators';
import actions from 'actions/dummyActions';

@createStore(flux)
class DummyStore {

    // Default <input> value
    name = 'awesome';

    @bind(actions.updateName)
    updateName(name) {
        this.name = name;
    }

    @bind(actions.fireTest)
    fireTest(test) {
        console.log(test);
    }


    @bind(actions.spliceCount)
    spliceCount(id) {
        console.log('~~~', this)
    }

}

export default DummyStore;
