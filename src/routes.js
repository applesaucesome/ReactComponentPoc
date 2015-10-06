import React from 'react';
import {IndexRoute, Route} from 'react-router';

import Main from 'components/main';  
import Example from 'components/example';
import Header from 'components/header';
import SubHeader from 'components/subheader';

import Tagging from 'components/tagging/component';
import FluxComponent from 'components/flux-component/component';

const routes = (  
  <Route path='/' component={Main}>
    <IndexRoute component={FluxComponent}/>
    <Route path='route1' component={Tagging}/>


    <Route path='route2' component={Header}>
        <Route path="user" component={SubHeader} />
    </Route>

    <Route path='route3' component={Header}>
        <Route path="user/:userId" component={SubHeader} />
    </Route>

    
  </Route>
);

export default routes;  