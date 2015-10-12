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
    componentWillUpdate(nextProps, nextState){
        // console.log('nextProps=', nextProps);
        // console.log('nextState=', nextState);

    }
    componentDidUpdate(prevProps, prevState){

        // console.log('prevProps=', prevProps);
        // console.log('prevState=', prevState);
    }
    onChange(inputName, e){
        const inputText = e.target.value;

        let inputValue = {};
        
        inputValue[inputName] = inputText;
        this.setState(inputValue);

    }
    onKeyDown(i, inputName, e) {

        const inputText = this.state[inputName];


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


            // Clear out the input
            let inputValue = {};
            
            inputValue[inputName] = '';
            this.setState(inputValue);
   
        }

    }

    render() {

        let inputEl;

        // If we're at the max amount of tags, don't render the input
        if (this.props.initialCount.length < this.props.maxTags) {
            // bind this without an iterator parameter, since this will be used for tag entry and not tag editing
            inputEl = <Input autoFocus ref="tagEntry" name="tagEntry" {...this.state} onChange={this.onChange.bind(this, 'tagEntry')} onKeyDown={this.onKeyDown.bind(this, undefined, 'tagEntry')} />;
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

                            tag = <div style={{margin: 10 + 'px', border: 1+'px solid #cc0000', padding: 10+'px'}} >
                                    <span className="tag-container" onDoubleClick={this.props.onTagDoubleClick.bind(this, i)}>
                                        <span>Tag:</span> {item.tag}
                                    </span>
                                    <span style={{ margin: 10 + 'px' }} className="remove" onClick={this.props.onRemoveItem.bind(this, i)}>X</span>
                                </div>;                            

                        } else {
                            // if we are editing this tag, render the input component as well as a cancel button
                            tag = <Input autoFocus ref="tagEdit" name="tagEdit" onChange={this.onChange.bind(this, 'tagEdit')} onKeyDown={this.onKeyDown.bind(this, i, 'tagEdit')} />;
                            
                            cancelEdit = <span style={{ margin: 10 + 'px' }} className="cancelEdit" onClick={this.props.onCancelEdit}>[cancel edit]</span>;

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
