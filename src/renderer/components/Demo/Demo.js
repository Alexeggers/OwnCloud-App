import React, { Component } from 'react';
import styles from './Demo.scss';
import cx from 'classnames';
import webdav from 'webdav';
import Str from '../../../utils/Str';
import downloadsFolder from 'downloads-folder';
import fs from 'fs';
import { shell } from 'electron';
import autobind from 'autobind-decorator';

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
        this.state.downloadsFolder = Str.normalizeSystemPath(downloadsFolder());
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
                    <div className="button" onClick={this.showFolderCreationDialog}>
                        New folder
                    </div>
                    <div className="button">Upload file</div>
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
                            <div className="clickable" onClick={() => this.handleFileClick(obj)} key={obj.basename}>
                                {obj.basename}
                            </div>
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
        window.fileName = obj.filename;
        const imageData = await this.client.getFileContents(obj.filename);
        const downloadPath = this.state.downloadsFolder + '/' + obj.basename;
        fs.writeFileSync(downloadPath, imageData);
        shell.openItem(downloadPath);
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
        this.client.createDirectory(newFolderNamePath);
        this.hideFolderCreationDialog();
        this.getDirectoryContents(this.state.currentDir);
    }
}
