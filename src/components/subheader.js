import React from 'react';

class SubHeader extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {


        return (
            <div>
            <h5>SUB HEADER COMPONENT - {this.props.params.userId || 'Placeholder'}</h5>
            </div>
        );
            
        
    }
}

export default SubHeader;
