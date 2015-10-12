import React from 'react';

class Input extends React.Component {
    constructor(props) {
        super(props);

        console.log('input props', this.props);

    }
    
    render() {
        let inputName = this.props.name;
        return (
            <input {...this.props} value={this.props[inputName]} />                
        );
    }
}

export default Input;
