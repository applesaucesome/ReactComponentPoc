import React from 'react';

class InputTile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }
    componentWillMount() {


    }
    componentWillUnmount() {

    }
    componentDidMount() {

    }
    onChange(e) {
        this.setState({
            message: e.target.value
        });
    }
    onEnterKey(e) {
        e.persist();

        if (e.keyCode === 13) {
            console.log(e.target.value);

            this.props.handleInputEnter(e);

            this.setState({
                message: ''
            });

        }
    }

    render() {
        return (
            <input className="titleInput" value={this.state.message} onChange={this.onChange.bind(this)} onKeyUp={this.onEnterKey.bind(this)} />
        );
    }
}

export default InputTile;
