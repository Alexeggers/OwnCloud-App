import React, { Component } from 'react';
import styles from './Login.scss';
import cx from 'classnames';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

export default class Login extends Component {
    static propTypes = {
        onLoginSubmit: PropTypes.func
    };

    state = {
        username: '',
        password: ''
    };

    render() {
        return (
            <div className={cx('Login', styles.Login)}>
                <div className="login-panel">
                    <form className="login-form" onSubmit={this.handleLoginSubmit}>
                        <label htmlFor="username-input">Username</label>
                        <input id="username-input" onChange={e => this.setState({ username: e.target.value })} />
                        <label htmlFor="password-input">Password</label>
                        <input id="password-input" onChange={e => this.setState({ password: e.target.value })} />
                        <button type="submit" className="login-button">
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    @autobind
    handleLoginSubmit(event) {
        event.preventDefault();
        this.props.onLoginSubmit(this.state.username, this.state.password);
    }
}
