import React from 'react';
import { RouteHandler, Link } from 'react-router';
import ReactDOM from 'react-dom'

import Header from './components/header';
import SearchBar from './components/search-bar/typeahead2';
class Main extends React.Component {

    constructor(props) {
        super(props);

        

    }

    render() {

        

        return (
            <div>
                <Header/>
                <h1>Example</h1>
                <Link to='example'>Go to the Example page...</Link>
                <SearchBar />
            </div>
        );
    }
}


ReactDOM.render(
  <Main/>,
   document.getElementById('content')
);
