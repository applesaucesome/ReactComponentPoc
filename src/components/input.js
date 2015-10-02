import React from 'react';

class InputTile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    onChange(e) {
        this.setState({
            message: e.target.value
        });
    }
    onEnterKey(e) {
        // e.persist();

        if (e.keyCode === 13 || e.keyCode === 9) {
            console.log(e.target.value);

            this.props.handleInputEnter(e);

            this.setState({
                message: ''
            });

        }
    }

    render() {
        return (
            <input className="titleInput" value={this.state.message} onChange={this.onChange.bind(this)} onKeyDown={this.onEnterKey.bind(this)}/>
        );
    }
}

export default InputTile;
