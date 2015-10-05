import React from 'react';
import Route from 'react-router';

import Main from 'components/main';  
import Example from 'components/example';
import Header from 'components/header';
import SubHeader from 'components/subheader';


const routes = (  
  <Route path='/' component={Main}>
    <Route path='route1' component={Example}/>


    <Route path='route2' component={Header}>
        <Route path="user" component={SubHeader} />
    </Route>

    
  </Route>
);

export default routes;  