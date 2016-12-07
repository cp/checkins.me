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
        <a href='http://checkinsdotme.herokuapp.com/authenticate'>
          <img className="SignIn-button" src={ connectButton } alt="Connect with Foursquare"/>
        </a>
      </div>
    );
  }
}

export default AuthButton;
