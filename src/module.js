import React from 'react';
import Router from 'react-router';
import routes from 'routes';
import createBrowserHistory from 'history/lib/createBrowserHistory';

let history = createBrowserHistory();

// Listen for changes to the current location. The
// listener is called once immediately.
let unlisten = history.listen(function(location) {
    console.log(location.pathname);
});

// When you're finished, stop the listener.
// unlisten();


React.render(<Router history={history}>{routes}</Router>, document.getElementById('content'));
