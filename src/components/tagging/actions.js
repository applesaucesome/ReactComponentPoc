import flux from 'control';
import {createActions} from 'alt/utils/decorators';

@createActions(flux)
class Actions {
    constructor() {
        this.generateActions('onCancelEdit', 'onRemoveItem', 'onTitleDoubleClick', 'onTitleEdit', 'onInputEnter', 'onTagEntry');

    }
}

export default Actions;



