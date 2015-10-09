import flux from 'control';
import {createActions} from 'alt/utils/decorators';


@createActions(flux)
class Actions {
    constructor() {
        this.generateActions('onMount');
        

    }

}

export default Actions;



