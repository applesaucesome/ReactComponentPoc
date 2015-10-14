import React from 'react/addons';
import Input from '../input/component';

class Tags extends React.Component {
    constructor(props) {
        // you must pass props every time you have props and you don't set them with 'this.props = props' manually
        super(props);
        this.state = {
            tagEdit: '',
            tagEntry: ''
        };
        // console.log('tag item props=', props);

    }
    componentDidMount(){
        // once mounted, save the component refs to the store
        this.props.onMount(this.refs);
        
    }

    onKeyDown(i, e) {

        let inputText = e.target.value;

        if (e.keyCode === 13 || e.keyCode === 9) {
                
            // stop the 'tab' key from unfocusing on 'tagEntryInput'
            // e.preventDefault();

            // if we're editing a tag
            // test for undefined because an index of '0' returns as false
            if (i !== undefined) {
                this.props.onTagEdit(e, i, inputText);
            } else {
                // if 'i' is undefined that means it's the tag entry input not the tag edit input
                this.props.onTagEntry(e, inputText);
            }

   
        }

    }

    render() {

        let inputEl;

        // If we're at the max amount of tags, don't render the input
        if (this.props.initialCount.length < this.props.maxTags) {
            // bind this without an iterator parameter, since this will be used for tag entry and not tag editing
            inputEl = <Input autoFocus ref="tagEntry" {...this.state} onKeyDown={this.onKeyDown.bind(this, undefined)} />;
        }
        

        return (
            <div>
                {
                    // Start rendering out the initial tags
                    this.props.initialCount.map(function(item, i) {


                        let editTag = false,
                            cancelEdit,
                            tag;

                        // If the iterator matches up with the current tag we're editing
                        if (i === this.props.currentTag) {
                            editTag = this.props.editTag;
                        }

                        // If we're not editing this tag, render it out normall
                        if (!editTag) {

                            tag = <div className="tagging__tag-item" onDoubleClick={this.props.onTagDoubleClick.bind(this, i)} >
                                    <span className="tagging__tag-value">{item.tag}</span> - 
                                    <span className="tagging__tag-remove" className="remove" onClick={this.props.onRemoveItem.bind(this, i)}>X</span>
                                </div>;                            

                        } else {
                            // if we are editing this tag, render the input component as well as a cancel button
                            tag = <Input autoFocus ref="tagEdit" {...this.props} onKeyDown={this.onKeyDown.bind(this, i)} />;
                            
                            cancelEdit = <span className="tagging__tag-cancel-edit" onClick={this.props.onCancelEdit}>[cancel edit]</span>;

                        }


                        return(
                            <div key={i}>
                                {tag}
                                {cancelEdit}
                            </div>
                        );
                        
                        
                    }, this)
                }
                {inputEl}
            </div>
        );



    }

}

export default Tags;
