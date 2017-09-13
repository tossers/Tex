import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import registerServiceWorker from './registerServiceWorker';
import {Provider} from 'mobx-react';
import store from './stores';
import AppRouter from './routers/index';

ReactDOM.render((<Provider {...store}><AppRouter/></Provider>),
    document.getElementById('root') as HTMLElement
);

// registerServiceWorker();
