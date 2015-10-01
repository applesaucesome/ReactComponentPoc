import React from 'react';
import {Route} from 'react-router';

import TaggingComponent from 'components/tagging';


const routes = (
  <Route handler={TaggingComponent}>
    <Route name='tagging' />
  </Route>
);

export default routes;
