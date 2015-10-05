import React from 'react';

class SubHeader extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.userId) {
            return (
                <div>
                <h5>SUB HEADER COMPONENT</h5>
                </div>
            );

        } else {

            return (
                <div>
                <h5>SUB HEADER COMPONENT - {this.props.userId}</h5>
                </div>
            );
            
        }
    }
}

export default SubHeader;
