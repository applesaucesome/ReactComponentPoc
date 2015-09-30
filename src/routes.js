import React from 'react';
import {Route} from 'react-router';

import Main from 'components/main';


const routes = (
  <Route handler={Main}>
    <Route name='example' />
  </Route>
);

export default routes;
