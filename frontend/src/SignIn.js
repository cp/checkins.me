import React from 'react';
import './App.css';
import connectButton from './connect.png';

class AuthButton extends React.Component {
  constructor(props) {
    super(props);

    this.onAuthClick = this.onAuthClick.bind(this);
  }

  onAuthClick() {
    console.log('clicked!');
  }

  render() {
    return (
      <div className="SignIn-container">
        <a href='http://127.0.0.1:4200/authenticate'>
          <img className="SignIn-button" src={ connectButton } alt="Connect with Foursquare"/>
        </a>
      </div>
    );
  }
}

export default AuthButton;
