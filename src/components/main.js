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
                <div><Link to='/' activeClassName="active">Home</Link></div>
                <div><Link to='/route1' activeClassName="active">Route1 page</Link></div>
                <div><Link to='/route2' activeClassName="active">Route2 page</Link></div>
                <div><Link to="/route2/user" activeClassName="active">Route2 - sub header</Link></div>
                <div><Link to='/route3' activeClassName="active">Route3 page</Link></div>
                <div><Link to="/route3/user/kyle123" activeClassName="active">Route3 - sub header w/ param 'Kyle123'</Link></div>
                
                {React.cloneElement(this.props.children, {someExtraProp: 'testing' })}
            </div>
        );
    }
}

export default Main;