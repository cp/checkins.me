import React from 'react';

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
      <a href='http://127.0.0.1:4200/authenticate'>
        auth with foursquare
      </a>
    );
  }
}

export default AuthButton;
