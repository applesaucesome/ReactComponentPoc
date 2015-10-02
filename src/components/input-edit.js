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

        const text = e.target.value;

        

        if (e.keyCode === 13 || e.keyCode === 9) {
            

            this.setState({
                message: ''
            });

            this.props.handleTitleEdit(e, i, text);

        }
    }

    render() {
        return (
            <input className="titleInput" value={this.state.message} onChange={this.onChange.bind(this)} onKeyDown={this.onEnterKey.bind(this, this.props.id)} />
        );
    }
}

export default InputTile;
