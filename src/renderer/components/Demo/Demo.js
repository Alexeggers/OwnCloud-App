import React, { Component } from 'react';
import styles from './Demo.scss';
import cx from 'classnames';
import webdav from 'webdav';
import Str from '../../../utils/Str';
//import downloadsFolder from 'downloads-folder';
import fs from 'fs';
import { shell, remote } from 'electron';
import autobind from 'autobind-decorator';
import Folder from '../Folder';

export default class Demo extends Component {
    state = {
        currentUser: 'admin',
        currentDir: '/',
        contents: [],
        downloadsFolder: ''
    };

    componentDidMount() {
        this.client = this.createClient();
        this.getDirectoryContents(this.state.currentDir);
        window.client = this.client;
        window.fs = fs;
        this.dialog = remote.dialog;
        /*this.state.downloadsFolder = Str.normalizeSystemPath(downloadsFolder());*/
        this.state.downloadsFolder = Str.normalizeSystemPath(remote.app.getPath('downloads'));
    }

    render() {
        return (
            <div className={cx('Demo', styles.Demo)}>
                <h2>File System</h2>
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
                <div id="folder-creation-block">
                    <label>Folder name: </label>
                    <input id="folder-input" type="text" />
                    <div
                        className="folder-button"
                        onClick={() => {
                            let newFolderName = document.getElementById('folder-input').value;
                            this.createFolder(newFolderName);
                        }}
                    >
                        Create
                    </div>
                </div>
                <div className="file-list">
                    {this.state.contents.map(obj => {
                        return (
                            <Folder
                                key={obj.basename}
                                obj={obj}
                                clickHandler={this.handleFileClick}
                                deleteHandler={this.handleDeleteFileClick}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }

    get rootPath() {
        return `files/${this.state.currentUser}`;
    }

    createClient({ user = 'admin', pass = 'xailabs123' } = {}) {
        return webdav('http://192.168.6.30/remote.php/dav', user, pass);
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

    showFolderCreationDialog() {
        let folderCreationBlock = document.getElementById('folder-creation-block');
        folderCreationBlock.style.display = 'block';
    }

    hideFolderCreationDialog() {
        let folderCreationBlock = document.getElementById('folder-creation-block');
        folderCreationBlock.style.display = 'none';
    }

    @autobind
    async createFolder(name) {
        let newFolderNamePath = `${this.rootPath}/${this.state.currentDir}/${name}`;
        console.log(newFolderNamePath);
        await this.client.createDirectory(newFolderNamePath);
        this.hideFolderCreationDialog();
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
    async handleRenameFileClick(oldFileName, newFileName) {
        await this.renameFile(oldFileName, newFileName);
        this.getDirectoryContents(this.state.currentDir);
    }

    async renameFile(oldFileName, newFileName) {
        const oldFilePath = `${this.rootPath}/${this.state.currentDir}/${oldFileName}`;
        const newFilePath = `${this.rootPath}/${this.state.currentDir}/${newFileName}`;
        await this.client.moveFile(oldFilePath, newFilePath);
    }
}
