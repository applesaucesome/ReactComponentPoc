import React from 'react';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            test: [1, 2, 3]
        };

        console.log(this.props);

    }
    render() {
        return (

            <div>
            <h1>TEST HEADER COMPONENT</h1>
            {this.props.children}
            </div>
        );
    }
}

export default Header;
