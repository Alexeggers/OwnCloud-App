import React, { Component } from 'react';
import styles from './Folder.scss';
import cx from 'classnames';
import PropTypes from 'prop-types';

export default class Folder extends Component {
    static propTypes = {
        clickHandler: PropTypes.func,
        obj: PropTypes.object,
        deleteHandler: PropTypes.func
    };

    render() {
        return (
            <div className={cx('Folder', styles.Folder)}>
                <span onClick={() => this.props.clickHandler(this.props.obj)}>{this.props.obj.basename}</span>
                <button>Rename</button>
                <button onClick={() => this.props.deleteHandler(this.props.obj.basename)}>Delete</button>
            </div>
        );
    }
}
