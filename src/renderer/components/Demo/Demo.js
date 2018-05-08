import React, { Component } from 'react';
import styles from './Demo.scss';
import cx from 'classnames';
import webdav from 'webdav';

export default class Demo extends Component {
    constructor() {
        super();
        let client = webdav('http://192.168.6.30/remote.php/dav', 'admin', 'xailabs123');
        window.client = client;
    }

    render() {
        return (
            <div className={cx('Demo', styles.Demo)}>
                <h2>Demo component</h2>
                <p>This is a demo component.</p>
            </div>
        );
    }
}
