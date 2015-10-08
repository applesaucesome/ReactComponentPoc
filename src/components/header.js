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

                {
                    this.props.test.map(function(item, i){
                        return( <h5>{item}</h5>);
                    })
                }
            </div>
        );
    }
}

export default Header;
