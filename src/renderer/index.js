import './styles/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

const rootEl = document.getElementById('app');

function render() {
    const Core = require('./components/Core').default;
    ReactDOM.render(<Core />, rootEl);
}

if (module.hot) {
    module.hot.accept('./components/Core', render);
}

render();
