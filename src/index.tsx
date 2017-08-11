import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import {Routers} from './router'

ReactDOM.render(<Routers/>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
