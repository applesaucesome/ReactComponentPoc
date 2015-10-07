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


    }
    static getStores(props) {
        return [Store];
    }

    static getPropsFromStores(props) {
        return Store.getState();
    }

    handleCancelEdit(e){
        const data = {e}
        Actions.onCancelEdit(data);
    }

    handleRemoveItem(id){
        const data = {id}
        Actions.onRemoveItem(data);
    }

    handleTitleDoubleClick(id, e){
        const data = {id, e}
        Actions.onTitleDoubleClick(data);
    }

    handleTitleEdit(e, id, text){
        const data = {e, id, text, this}
        Actions.onTitleEdit(data);
    }

    handleInputEnter(e){
        const data = {e}
        Actions.onInputEnter(data);
    }
    handleTagEntry(e) {

        const data = {e}
        Actions.onTagEntry(data);

    }
    render() {

        let inputEl,
            editTagAttr;

        if (this.state.initialCount.length < this.state.maxTitles) {
            inputEl = <Input ref="tagEntry" handleInputEnter={this.handleInputEnter.bind(this)} handleTagEntry={this.handleTagEntry.bind(this)} />;
        }        

        return (
            <div>

                {
                    this.state.initialCount.map(function(item, i) {

                        if (i === this.props.currentTitle) {
                            editTagAttr = this.props.editTag;
                        } else {
                            editTagAttr = false;
                        }

                        return (
                            <TitleItem 
                                handleCancelEdit={this.handleCancelEdit.bind(this)}
                                handleTagEntry={this.handleTagEntry.bind(this)} 
                                handleTitleDoubleClick={this.handleTitleDoubleClick.bind(this, i)} 
                                handleTitleEdit={this.handleTitleEdit.bind(this)} 
                                handleRemoveItem={this.handleRemoveItem.bind(this, i)} 
                                editTag={editTagAttr} 
                                id={i} 
                                key={i} 
                                {...item} 
                            />
                        );
                        
                        
                    }, this)
                }

                {inputEl}
                
            </div>
        );
    }
}

export default Tagging;
