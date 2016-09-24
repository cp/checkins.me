import React from 'react';
import ReactDOM from 'react-dom';

class Profile extends React.Component {
  componentDidMount() {
    const element = ReactDOM.findDOMNode(this);
    const token = 'c77b12dd-a370-48be-9b94-ee388b14510c'
    const rUI = new ReflectUI(token); // eslint-disable-line no-undef

    rUI.view(element, 'checkins', 'test');
  }

  render() {
    return <div className="reflect-view" />
  }
}

export default Profile
