import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
// import $ from 'jquery';
// import 'bootstrap/dist/js/bootstrap.js';
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

  callApi = searchParam => {
    // this.setState({ isLoaded: false });
    let oldState = Object.assign([], this.state),
      oldTweets;
    fetch(`/tweets?searchTerm=${searchParam ? searchParam : this.state.childData}`)
      .then(res => res.json())
      .then(data => {
        oldTweets = (oldState.tweets.length > 0 && oldState.childData === searchParam) ? [...oldState.tweets, ...data] : data || [];
        this.setState({
          tweets: oldTweets,
          isLoaded: true,
          childData: searchParam
        });
        // console.log("Dataa", data);
      }).catch(e => console.log("Error while retrieving tweets! ", e));
  }

  receiveChildData = input => {
    this.callApi(input);
    console.log("Child Searched for..", input);
  }

  loadMoreTweets = () => {
    this.callApi();
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
        <div className="panel">
          <Listing parentCallback={this.receiveChildData} />
          <div className="display-content-center">
            <span className="text-info text-center">Tweets Matched</span>
            &nbsp;&nbsp;
            <button type="button" onClick={this.loadMoreTweets} className="btn btn-primary more-tweets">Load More Tweets</button>
          </div>
          {tweets.map((tweet, i) =>
            <div key={i} className="col-md-6">
              <ul className="list-group">
                <li className="list-group-item display-flex">
                  <img alt="User Profile Pic" height="48" src={tweet.profilePic} />
                  <div className="tweets-list-group">
                    <div className="display-flex">
                      <a target="_blank" rel="noopener noreferrer" href={tweet.url} className="font-weight-bold">{tweet.username}</a>&nbsp;
                      {tweet.verified && <img height="25" src={badge} alt="Verified Twitter User badge" />}
                      <a target="_blank" rel="noopener noreferrer" href={tweet.url}>@{tweet.name}</a>
                      <a href="#" rel="no-follow"> . {tweet.created}</a>
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