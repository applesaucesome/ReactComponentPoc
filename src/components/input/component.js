import React from 'react';

class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }
    
    onChange(e) {
        this.setState({
            message: e.target.value
        });
    }
    onEnterKey(i, e) {

        const text = e.target.value;        

        if (e.keyCode === 13 || e.keyCode === 9) {
            
            // stop the 'tab' key from unfocusing on 'tagEntryInput'
            e.preventDefault();
            

            this.setState({
                message: ''
            });

            // if we're editing a tag
            // test for undefined because an indedx of '0' returns as false
            if (i !== undefined) {
                this.props.handleTitleEdit(e, i, text);
            } else {
                // if 'i' is undefined that means it's the tag entry input not the tag edit input
                this.props.handleTagEntry(e);
            }
            
        }
    }

    render() {
        let cancelEdit = '';
        if (this.props.editTag) {
            cancelEdit = <span style={{ margin: 10 + 'px' }} className="cancelEdit" onClick={this.props.handleCancelEdit}>X</span>;
        }
        return (
            <div>
                <input autoFocus ref="tagEntryInput" value={this.state.message} onChange={this.onChange.bind(this)} onKeyDown={this.onEnterKey.bind(this, this.props.id)} />
                {cancelEdit}
            </div>
        );
    }
}

export default Input;
