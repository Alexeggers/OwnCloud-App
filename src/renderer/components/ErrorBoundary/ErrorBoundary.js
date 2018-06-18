import React from 'react';
import PrettyJson from '@loopmode/react-pretty-json';
import cx from 'classnames';
import css from './ErrorBoundary.css';
/* eslint-disable react/prop-types */
export default class ErrorBoundary extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { error: undefined, info: undefined };
    }

    componentDidCatch(error, info) {
        if (process.env.NODE_ENV !== 'production') {
            console.info(`[ErrorBoundary]${this.props.name ? ` ${this.props.name}` : ''}`, { error, info });
        }
        this.setState({ error, info });
    }

    render() {
        const { name: ErrorBoundary = 'ErrorBoundary' } = this.props;
        const { error, info } = this.state;
        if (error) {
            return (
                <div className={cx('ErrorBoundary', css.ErrorBoundary)}>
                    <h1 classnames={css.title}>Something went wrong.</h1>
                    {process.env.NODE_ENV !== 'production' && <PrettyJson data={{ ErrorBoundary, error, info }} />}
                </div>
            );
        }
        return this.props.children;
    }
}
