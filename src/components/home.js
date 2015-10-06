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
            <h1>HOME</h1>
            </div>
        );
    }
}

export default Header;
