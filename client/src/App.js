import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
// import $ from 'jquery';
// import 'bootstrap/dist/js/bootstrap.js';
import './App.css';
import Listing from './Listing';
import badge from './badge.png';
// import { BehaviorSubject } from 'rxjs';
// import { throttle } from 'rxjs/operators';
// import { interval } from 'rxjs';
// import { throttleTime } from 'rxjs/operators';



class App extends Component {
  constructor() {
    //initialize state here
    super();
    this.state = {
      tweets: [],
      isLoaded: false,
      childData: '',
      newTweetsCameUp: 0
    };
    // this.inputStream = new BehaviorSubject();
    this.debounce = this.debounceCall();
  }
  handleInput = () => {
    this.streamNewTweets();
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleOnScroll.bind(this));
    // this.inputStream
    //   .pipe(
    //     throttle(this.streamNewTweets,3000)
    //   )
    //   .subscribe(v => {
    //     console.log("---",v);
    //   })
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

  streamNewTweets = () => {
    if (this.state.childData.length > 0) {
      let prevState = Object.assign({},this.state);
      fetch(`/newtweets?name=${this.state.childData}`)
        .then(res => res.json())
        .then(data => {
          this.setState({
            newTweetsCameUp: prevState.newTweetsCameUp+data.length
          });
          if (data && data.length) console.log("New Tweets " + data.length);
        });
    }
  }

  receiveChildData = input => {
    this.callApi(input);
    console.log("Child Searched for..", input);
  }

  loadMoreTweets = () => {
    this.callApi();
  }

  debounceCall = () => {
    let inDebounce
    return function () {
      const context = this
      const args = arguments
      clearTimeout(inDebounce)
      // inDebounce = setTimeout(() => this.callApi.apply(context, args), 3000);
      inDebounce = setTimeout(() => this.streamNewTweets(), 1000);
    }
  }

  // handleOnScroll() {
  //   let scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  //   let scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
  //   let clientHeight = document.documentElement.clientHeight || window.innerHeight;
  //   let scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight
  //   if (scrolledToBottom) {
  //     console.log("User scrolled his mouse");
  //     // this.debounceCall();
  //   } else {
  //     console.log("Waiting for the user to scroll his mouse!")
  //   }
  // }

  handleOnScroll(e) {
    this.debounce();
  }

  //Life cycle Hook when component is destoryed
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleOnScroll);
  }

  // Conditionally rendering components based on the isLoaded flag in order to show loader
  render() {
    let { isLoaded, tweets } = this.state;
    if (!isLoaded && tweets.length > 0) {
      return <div className="loader">
        <div className="loading">
        </div>
      </div>
    } else {
      return (
        <div className="panel">
          <Listing newTweets={this.state.newTweetsCameUp} parentCallback={this.receiveChildData} />
          {!isLoaded && tweets.length > 0 && <div className="display-content-center">
            <span className="text-info text-center">Tweets Matched</span>
          </div>}
          {tweets.map((tweet, i) =>
            <div key={i}>
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
          {!isLoaded && tweets.length > 0 && <div>
            <button type="button"
              onClick={this.loadMoreTweets}
              className="btn btn-primary more-tweets">
              Load More Tweets
              </button>
          </div>}
        </div>
      )
    }
  }
}
export default App;