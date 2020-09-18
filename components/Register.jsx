import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const illegalCharsFormat = /[!@#$%^&*()+\-=[\]{};':"\\|,.<>/?]/;
class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loggedIn: (!!this.props.user) };
        this.click = this.click.bind(this);

        this.username = React.createRef();
        this.password = React.createRef();
        this.message = React.createRef();
        this.name = React.createRef();
    }

    async click() {
        if (!this.username.current.value ||
            !this.password.current.value ||
            !this.name.current.value ||
            illegalCharsFormat.test(this.username.current.value)) return;

        const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: this.username.current.value,
                password: this.password.current.value,
                name: this.name.current.value
            })
        });

        const data = await response.json();

        if (!data.success) {this.message.current.innerHTML = `<span style='color: red'>${data.message}</span>`;}
        else {
            this.message.current.innerHTML = `<span style='color: green'>${data.message}</span>`;

            localStorage.setItem('token', data.token);
            this.props.toggleLogin(data.user);
            this.setState({ loggedIn: true });
        }
    }

    render() {
        if (this.state.loggedIn) {
            return (
                <Redirect to="/" />
            );
        }
        return (
            <div>
                <div className="row center" style={{
                    position: 'absolute',
                    top: '90px',
                    width: '25%'
                }}>
                    <div ref={this.message}></div>
                </div>
                <div className="row" style={{ marginTop: '120px' }}>
                    <form className="col-3 col-gap-3">
                        <div className="row">
                            <input ref={this.name} type="text" placeholder="Name" className="validate fill" />
                        </div>
                        <div className="row">
                            <input ref={this.username} type="text" placeholder="Username" className="validate fill" />
                        </div>
                        <div className="row">
                            <input ref={this.password} type="password"
                                placeholder="Password" className="validate fill" />
                        </div>
                        <div className="row">
                            <button className="fill" onClick={this.click}>Log in</button>
                        </div>
                        <div className="row">
                            Don&rsquo;t have an account?
                            <Link to="/register">
                                {' Sign up in seconds.'}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

Register.propTypes = {
    toggleLogin: PropTypes.func.isRequired,
    user: PropTypes.object
};

export default Register;
