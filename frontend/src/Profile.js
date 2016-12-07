import React from 'react';
import ReactDOM from 'react-dom';

class Profile extends React.Component {
  componentDidMount() {
    const element = ReactDOM.findDOMNode(this);
    const query = this.props.location.query;
    const tokens = [query.access, query.token]
    const rUI = new ReflectUI(tokens); // eslint-disable-line no-undef

    rUI.withParameters([
      { field: 'User ID', op: '=', value: query.user }
    ])

    rUI.view(element, 'checkins', 'test');
  }

  render() {
    return <div className="reflect-view" />
  }
}

export default Profile
