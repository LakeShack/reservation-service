import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
import Calendar from './components/Calendar.jsx';
import Guests from './components/Guests.jsx';
import Reviews from './components/Reviews.jsx';
import TotalPrice from './components/TotalPrice.jsx';
import IndividualPrice from './components/IndividualPrice.jsx';
import GuestList from './components/GuestList.jsx'
import './components/styles/index.css';

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: { "booked_dates": [""], "_id": "", "listingId": "", "adult_price": 0, "child_price": 0, "cleaning_fee": 0, "review_rating": 0, "reviews": 0, "discount": false, "__v": 0 },
      guestList: false,
      guestsAdult: 1,
      guestsChildren: 0,
      nights: 0
    }

  }

  componentDidMount() {
    this.getListing(this.props.listing);
  }

  getListing(listingNumber) {
    let current = this;
    axios.get(`http://127.0.0.1:3009/reservation/${listingNumber}`)
    .then((response) => {
      this.setState({ data: response.data});
    })
    .catch(error => console.log('Error:', error));
  }

  renderGuests() {
    if (this.state.guestList) {
      this.setState({guestList: false});
    } else {
      this.setState({guestList: true});
    }
  }

  changeGuests(boolean, type) {
    if (type === 'child') {
      let currentValue = this.state.guestsChildren;
      if (boolean) {
        this.setState({guestsChildren: currentValue + 1});
      } else {
        this.setState({guestsChildren: currentValue - 1});
      }
    }
    if (type === 'adult') {
      let currentValue = this.state.guestsAdult;
      if (boolean) {
        this.setState({ guestsAdult: currentValue + 1 });
      } else {
        this.setState({ guestsAdult: currentValue - 1 });
      }
    }
  }

  dateRange(startDate, endDate) {
    if (startDate && endDate) {
      let totalNights = endDate.diff(startDate, 'days');
      this.setState({nights: totalNights});
    } else {
      this.setState({nights: 0});
    }
  }

  render() {
    let data = this.state.data;
    let adultGuests = this.state.guestsAdult;
    let childGuests = this.state.guestsChildren;
    return (
      <div className='Reservation'>
        <TotalPrice data={data} guestsAdult={adultGuests} guestsChildren={childGuests}/>
        <Reviews data={data}/>
        <hr></hr>
        <Calendar dateRange={this.dateRange.bind(this)}/>
        <Guests guestList={this.renderGuests.bind(this)} guestsAdult={adultGuests} guestsChildren={childGuests}/>
        <GuestList isClicked={this.state.guestList} guestList={this.renderGuests.bind(this)} changeGuests={this.changeGuests.bind(this)}/>
        <IndividualPrice data={data} guestsAdult={adultGuests} guestsChildren={childGuests} nights={this.state.nights}/>
        <button className='Book'>Book</button>
      </div>
    )
  }
}

ReactDOM.render(<App listing={window.location.href.split('?id=')[1] || 13} />, document.getElementById('reservation'));
