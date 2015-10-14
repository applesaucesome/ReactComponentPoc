import React from 'react';

class Input extends React.Component {
    constructor(props) {
        super(props);

        // console.log('input props', this.props);

    }

    render() {

        return (
            <input {...this.props} defaultValue={this.props.editTagValue} />                
        );
    }
}

export default Input;
