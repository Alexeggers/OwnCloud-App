import './styles/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

const rootEl = document.getElementById('app');

function render() {
    const App = require('./App').default;
    ReactDOM.render(<App />, rootEl);
}

if (module.hot) {
    module.hot.accept('./App', render);
}

render();
