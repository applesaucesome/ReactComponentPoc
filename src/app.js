import React from 'react';
import { RouteHandler, Link } from 'react-router';
import ReactDOM from 'react-dom'

import Tags from './components/tag-item/component';
class Main extends React.Component {
    render() {
        return (
            <div>
                <h1>Example</h1>
                
                <Link to='example'>Go to the Example page...</Link>
                
            </div>
        );
    }
}


ReactDOM.render(
  <Main/>,
   document.getElementById('content')
);
