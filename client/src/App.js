import React, { Component } from 'react';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Listing from './Listing';
import badge from './badge.png';

class App extends Component {
  constructor() {
    //initialize state here
    super();
    this.state = {
      tweets: [],
      isLoaded: false,
      childData: 'cherry'
    };
  }
  componentDidMount() {
    this.callApi();
  }

  callApi = (searchParam) => {
    fetch(`/tweets?searchTerm=${searchParam ? searchParam : this.state.childData}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          tweets: data || [],
          isLoaded: true
        });
        console.log("Dataa", data);
      }).catch(e => console.log("Error while retrieving tweets! ", e));
  }

  receiveChildData = input => {
    this.callApi(input);
    console.log("Child Searched for..", input);
  }

  // Conditionally rendering components based on the isLoaded flag in order to show loader
  render() {
    let { isLoaded, tweets } = this.state;
    if (!isLoaded) {
      return <div className="loader">
        <div className="loading">
        </div>
      </div>
    } else {
      return (
        <div>
          <Listing parentCallback={this.receiveChildData} />
          <p className="text-success text-center">Tweets Matched</p>
          {tweets.map((tweet, i) =>
            <div>
              <ul key={i} className="list-group">
                <li className="list-group-item display-flex" style={{background:"#F5F8FA"}}>
                  <img alt="User Profile Pic" src={tweet.profilePic} />
                  <div className="tweets-list-group">
                    <div className="display-flex">
                      <a href={tweet.url} className="font-weight-bold">{tweet.username}</a>&nbsp;
                      {tweet.verified && <img height="25" src={badge} alt="Verified Twitter User badge" />}                      
                      <a href={tweet.url}>@{tweet.name}</a>
                      <a href="#"  data-toggle="popover" title="Crated On" data-content="Hello"> . {tweet.created}</a>
                    </div>
                    <span>{tweet.text}</span>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      )
    }
  }
}
export default App;