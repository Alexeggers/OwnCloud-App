import React, { Component } from 'react';
import styles from './File.scss';
import cx from 'classnames';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

export default class File extends Component {
    static propTypes = {
        obj: PropTypes.object,
        clickHandler: PropTypes.func,
        deleteHandler: PropTypes.func,
        onRename: PropTypes.func
    };

    state = {
        fileName: '',
        showRenameForm: false
    };

    constructor(props) {
        super(props);
        this.state.fileName = this.props.obj.basename;
    }

    render() {
        return (
            <div className={cx('File', styles.File)}>
                {this.state.showRenameForm && (
                    <div>
                        <form onSubmit={this.handleConfirmRenameClick}>
                            <input
                                onChange={e => this.setState({ fileName: e.target.value })}
                                value={this.state.fileName}
                            />
                            <button type="submit">Confirm</button>
                        </form>
                    </div>
                )}
                {!this.state.showRenameForm && (
                    <div ref={el => (this.mainBlock = el)} className="file-content">
                        <div className="file-description">
                            <span className="file-name" onClick={() => this.props.clickHandler(this.props.obj)}>
                                {this.state.fileName}
                            </span>
                            <br />
                            <span className="last-mod">{this.props.obj.lastmod}</span>
                        </div>
                        <div className="file-button-container">
                            <button onClick={this.handleRenameClick}>Rename</button>
                            <button onClick={() => this.props.deleteHandler(this.props.obj.basename)}>Delete</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    @autobind
    handleRenameClick() {
        this.setState({ showRenameForm: true });
    }

    @autobind
    handleConfirmRenameClick(event) {
        event.preventDefault();
        this.setState({ showRenameForm: false });
        this.props.onRename(this.props.obj.basename, this.state.fileName);
    }
}
