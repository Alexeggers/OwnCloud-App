import React, { Component } from 'react';
import styles from './File.scss';
import cx from 'classnames';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import Button from '@material-ui/core/Button';
import FolderIcon from '@material-ui/icons/Folder';
import TextField from '@material-ui/core/TextField';

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
                            <TextField
                                onChange={e => this.setState({ fileName: e.target.value })}
                                value={this.state.fileName}
                            />
                            <br />
                            <Button type="submit">Confirm</Button>
                        </form>
                    </div>
                )}
                {!this.state.showRenameForm && (
                    <div ref={el => (this.mainBlock = el)} className="file-content">
                        <div className="file-description">
                            {this.props.obj.type === 'directory' && <FolderIcon />}
                            <span className="file-name" onClick={() => this.props.clickHandler(this.props.obj)}>
                                {this.state.fileName}
                            </span>
                            <br />
                            <span className="last-mod">{this.props.obj.lastmod}</span>
                        </div>
                        <div className="file-button-container">
                            <Button onClick={this.handleRenameClick}>Rename</Button>
                            <Button onClick={() => this.props.deleteHandler(this.props.obj.basename)}>Delete</Button>
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
