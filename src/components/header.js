import React from 'react';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        console.log(this.props);

    }
    render() {
        return (

            <div>
            <h1>TEST HEADER COMPONENT</h1>
                {this.props.children || 'Welcome to your Inbox'}
            </div>
        );
    }
}

export default Header;
