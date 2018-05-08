import React, { Component } from 'react';
import styles from './App.scss';

import Demo from './components/Demo';

export default class App extends Component {
    render() {
        return (
            <div className={styles.App}>
                <h1>App</h1>
                <p>It works!</p>
                <Demo />
            </div>
        );
    }
}
