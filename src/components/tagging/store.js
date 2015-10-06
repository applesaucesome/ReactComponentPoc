import flux from 'control';
import {
    createStore, bind
}
from 'alt/utils/decorators';
import actions from './actions';

@createStore(flux)
class Store {

    constructor() {

        // give a default value
        this.state = {
            initialCount: [{
                title: 'hi'
            }, {
                title: 'hello'
            }, {
                title: 'bye'
            }]
        };
    }



    @bind(actions.removeItem)
    removeItem(data) {
        
        console.log('data=', data);


        this.state.initialCount.splice(data.id, 1);

        this.setState({
            initialCount: 'this.state.initialCount'
        });

    }

    @bind(actions.titleDoubleClick)
    titleDoubleClick(data) {
        
        console.log('data=', data);

        this.setState({
            editTag: true,
            currentTitle: data.id
        });
    }

    @bind(actions.handleTitleEdit)
    handleTitleEdit(data) {
        
        console.log('data=', data);


        this.state.initialCount.splice(data.id, 1, {
            title: data.text
        });

        this.setState({
            initialCount: this.state.initialCount,
            editTag: false
        });
    }

    @bind(actions.handleInputEnter)
    handleInputEnter(data) {
        
        console.log('data=', data);


        const inputText = data.e.target.value;

        this.setState({
            title: inputText
        });
    }


}

export default Store;
