import React, { Component } from 'react';
import styles from './Folder.scss';
import cx from 'classnames';

export default class Demo extends Component {
    render() {
        return <div className={cx('Folder', styles.Folder)} />;
    }
}
