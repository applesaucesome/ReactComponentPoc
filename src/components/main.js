import React from 'react';
import { Link } from 'react-router';

class Main extends React.Component {
    constructor(props){
        super(props);
    }
    render() {


        return (
            <div>
                <h1>Example</h1>
                
                <div><Link to='/route1' activeClassName="active">Go to the route1 page</Link></div>
                <div><Link to='/route2' activeClassName="active">Go to the route2 page</Link></div>
                <div><Link to="/route2/user" activeClassName="active">Subroute header</Link></div>
                <div><Link to='/route3' activeClassName="active">Go to the route3 page</Link></div>
                <div><Link to="/route3/user/kyle" activeClassName="active">Subroute header - Kyle</Link></div>
                
                {React.cloneElement(this.props.children, {someExtraProp: 'testing' })}
            </div>
        );
    }
}

export default Main;