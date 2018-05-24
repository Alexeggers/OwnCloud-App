import React, { Component } from 'react';
import styles from './Core.scss';
import cx from 'classnames';
import webdav from 'webdav';
import Str from '../../../utils/Str';
import fs from 'fs';
import { shell, remote, ipcRenderer as ipc } from 'electron';
import autobind from 'autobind-decorator';
import File from '../File';

export default class Core extends Component {
    state = {
        currentUser: 'admin',
        currentDir: '/',
        contents: [],
        downloadsFolder: '',
        showFolderCreationDialog: false,
        newFolderName: '',
        showLogin: true,
        username: '',
        password: ''
    };

    componentDidMount() {
        //this.client = this.createClient();
        //this.getDirectoryContents(this.state.currentDir);
        window.webdav = webdav;
        window.client = this.client;
        window.fs = fs;
        this.dialog = remote.dialog;
        this.state.downloadsFolder = Str.normalizeSystemPath(remote.app.getPath('downloads'));
    }

    render() {
        return (
            <div className="appWrapper">
                {this.state.showLogin && (
                    <div className={cx('Login', styles.Login)}>
                        <div className="login-panel">
                            <form className="login-form" onSubmit={this.handleLoginSubmit}>
                                <label htmlFor="username-input">Username</label>
                                <input
                                    id="username-input"
                                    onChange={e => this.setState({ username: e.target.value })}
                                    value={this.state.username}
                                />
                                <label htmlFor="password-input">Password</label>
                                <input
                                    type="password"
                                    id="password-input"
                                    onChange={e => this.setState({ password: e.target.value })}
                                    value={this.state.password}
                                />
                                <button type="submit" className="login-button">
                                    Sign In
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                {!this.state.showLogin && (
                    <div className="coreWrapper">
                        <div className={cx('Headers', styles.Headers)}>
                            <div className="headers__top-bar">
                                <div>Overview</div>
                                <div onClick={this.handleLogoutClick} className="logout">
                                    Logout
                                </div>
                            </div>
                            <div className="headers__bottom-bar" />
                        </div>
                        <div className={cx('Core', styles.Core)}>
                            <div className="title">File System</div>
                            <p>Current Files:</p>
                            <div className="button-row">
                                <div className="button" onClick={this.handleUpClick}>
                                    Up
                                </div>
                                <div className="button" onClick={this.handleNewFolderClick}>
                                    New folder
                                </div>
                                <div className="button" onClick={this.handleUploadClick}>
                                    Upload file
                                </div>
                            </div>
                            {this.state.showFolderCreationDialog && (
                                <div>
                                    <form
                                        onSubmit={event => {
                                            event.preventDefault();
                                            this.createFolder(this.state.newFolderName);
                                        }}
                                    >
                                        <label>Folder name: </label>
                                        <input onChange={e => this.setState({ newFolderName: e.target.value })} />
                                        <button type="submit">Create</button>
                                        <button onClick={this.handleNewFolderCancelClick}>Cancel</button>
                                    </form>
                                </div>
                            )}
                            <div className="file-list">
                                {this.state.contents.map(obj => {
                                    return (
                                        <File
                                            key={obj.basename}
                                            obj={obj}
                                            onRename={this.handleRenameFile}
                                            clickHandler={this.handleFileClick}
                                            deleteHandler={this.handleDeleteFileClick}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    get rootPath() {
        return `files/${this.state.currentUser}`;
    }

    createClient(user, pass) {
        return webdav('http://192.168.6.30/remote.php/dav', user, pass);
    }

    @autobind
    async handleLoginSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        if ((await this.doLogin(this.state.username, this.state.password)) === true) {
            this.setState({ showLogin: false });
            this.getDirectoryContents(this.state.currentDir);
            window.client = this.client;
        } else {
            ipc.send('bad-credentials');
        }
    }

    async doLogin(user, pass) {
        let createdClient = this.createClient(user, pass);
        try {
            await createdClient.getDirectoryContents('/');
            this.client = createdClient;
            return true;
        } catch (error) {
            this.setState({ password: '' });
            return false;
        }
    }

    async getDirectoryContents(path) {
        let result = await this.client.getDirectoryContents(Str.normalizePath(`${this.rootPath}/${path}`));
        result = result.map(obj => {
            return { ...obj, filename: Str.normalizePath(obj.filename) };
        });
        const [currentDirObject, ...contents] = result;
        this.setState({
            currentDir: currentDirObject.filename.replace(this.rootPath, ''),
            contents
        });
    }

    @autobind
    handleFileClick(obj) {
        // Handle file clicking
        if (obj.type === 'directory') {
            this.getDirectoryContents(this.state.currentDir + obj.basename);
        } else if (obj.type === 'file') {
            this.downloadFile(obj);
        }
    }

    @autobind
    handleUpClick() {
        let tempArr = this.state.currentDir.split('/');
        tempArr.pop();
        const parentDir = tempArr.join('/');
        this.getDirectoryContents(parentDir);
    }

    async downloadFile(obj) {
        const fileData = await this.client.getFileContents(obj.filename);
        const downloadPath = this.state.downloadsFolder + '/' + obj.basename;
        fs.writeFileSync(downloadPath, fileData);
        shell.openItem(downloadPath);
    }

    @autobind
    handleNewFolderClick() {
        this.showFolderCreationDialog();
    }

    @autobind
    handleNewFolderCancelClick(event) {
        event.preventDefault();
        this.hideFolderCreationDialog();
    }

    showFolderCreationDialog() {
        this.setState({ showFolderCreationDialog: true });
    }

    hideFolderCreationDialog() {
        this.setState({ showFolderCreationDialog: false });
    }

    @autobind
    async createFolder(name) {
        let newFolderNamePath = `${this.rootPath}/${this.state.currentDir}/${name}`;
        await this.client.createDirectory(newFolderNamePath);
        this.hideFolderCreationDialog();
        this.setState({ newFolderName: '' });
        this.getDirectoryContents(this.state.currentDir);
    }

    @autobind
    async handleUploadClick() {
        const filePath = this.chooseFileToUpload();
        await this.uploadFile(filePath);
        this.getDirectoryContents(this.state.currentDir);
    }

    @autobind
    async uploadFile(filePath) {
        let fileData = fs.readFileSync(filePath);
        const fileName = Str.removeLeadingSlash(filePath.substr(filePath.lastIndexOf('/')));
        await this.client.putFileContents(`${this.rootPath}/${this.state.currentDir}/${fileName}`, fileData, {
            format: 'binary'
        });
        this.getDirectoryContents(this.state.currentDir);
    }

    chooseFileToUpload() {
        return Str.replaceBackSlashes(this.dialog.showOpenDialog()[0]);
    }

    @autobind
    async handleDeleteFileClick(fileName) {
        await this.deleteFile(fileName);
        this.getDirectoryContents(this.state.currentDir);
    }

    async deleteFile(fileName) {
        const filePath = `${this.rootPath}/${this.state.currentDir}/${fileName}`;
        await this.client.deleteFile(filePath);
    }

    @autobind
    async handleRenameFile(oldFileName, newFileName) {
        await this.renameFile(oldFileName, newFileName);
        this.getDirectoryContents(this.state.currentDir);
    }

    async renameFile(oldFileName, newFileName) {
        const oldFilePath = `${this.rootPath}/${this.state.currentDir}/${oldFileName}`;
        const newFilePath = `${this.rootPath}/${this.state.currentDir}/${newFileName}`;
        await this.client.moveFile(oldFilePath, newFilePath);
    }

    @autobind
    handleLogoutClick() {
        this.setState({ username: '', password: '', showLogin: true });
    }
}
