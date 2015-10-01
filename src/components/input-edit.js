import React from 'react';

class InputTile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // console.log('Input Tile -', props)
    }

    onChange(e) {
        this.setState({
            message: e.target.value
        });
    }
    onEnterKey(i, e) {

        var text = e.target.value;

        

        if (e.keyCode === 13) {
            

            this.setState({
                message: ''
            });

            this.props.handleTitleEdit(e, i, text);

        }
    }

    render() {
        return (
            <input className="titleInput" value={this.state.message} onChange={this.onChange.bind(this)} onKeyUp={this.onEnterKey.bind(this, this.props.id)} />
        );
    }
}

export default InputTile;
