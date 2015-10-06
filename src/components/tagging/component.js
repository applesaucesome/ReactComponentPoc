import React from 'react';
import Actions from './actions';
import Store from './store';
import connectToStores from 'alt/utils/connectToStores';
import TitleItem from '../title-item';
import Input from '../input';

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
class Tagging extends React.Component {
    constructor(props) {
        super(props);
        this.state = Store.getState();

        console.log('this state=', this.state);


    }
    static getStores(props) {
        return [Store];
    }

    static getPropsFromStores(props) {
        return Store.getState();
    }

    removeItem(id){
        const data = {id}
        Actions.removeItem(data);
    }
    titleDoubleClick(id, e){
        const data = {id, e}
        Actions.titleDoubleClick(data);
    }
    handleTitleEdit(e, id, text){
        const data = {e, id, text}
        Actions.handleTitleEdit(data);
    }
    handleInputEnter(e){
        const data = {e}
        Actions.handleInputEnter(data);
    }
    render() {

        let inputEl,
            editTagAttr;

        if (this.state.initialCount.length < this.state.maxTitles) {
            inputEl = <Input handleInputEnter={this.handleInputEnter.bind(this)} />;
        }        

        return (
            <div>
                <h2>Tagging</h2>
                <p>List all Tags</p>

                {
                    this.state.initialCount.map(function(item, i) {

                        if (i === this.state.currentTitle) {
                            editTagAttr = this.state.editTag;
                        } else {
                            editTagAttr = false;
                        }

                        return (
                            <TitleItem editTag={editTagAttr} titleDoubleClick={this.titleDoubleClick.bind(this, i)} handleTitleEdit={this.handleTitleEdit.bind(this)} removeItem={this.removeItem.bind(this, i)} id={i} {...item} />
                        );
                        
                        
                    }, this)
                }


                {inputEl}
                
            </div>
        );
    }
}

export default Tagging;
