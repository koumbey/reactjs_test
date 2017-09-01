import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import ReactDataGrid from 'react-data-grid';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment()
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(date) {
        this.setState({
            startDate: date
        });
    }

    render() {
        return <DatePicker
            selected={this.state.startDate}
            onChange={this.handleChange}
            tabIndex ={50}
            popperPlacement="bottom-end"
            popperModifiers={{
                offset: {
                    enabled: true,
                    offset: '5px, 10px'
                },
                preventOverflow: {
                    enabled: true,
                    escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
                    boundariesElement: 'viewport'
                }
            }}
        />;
    }
}


const columns = [
    { key: 'First', name: 'First' },
    { key: 'second', name: 'Second' },
    { key: 'data', name: 'Date', editable: true, formatter: <Example/>}
];
const rows = [
{ First: "Toto", second: 'Toti', data: "2017-08-20" },
{ First: "Tonton", second: 'Garba', data: "2017-07-20" },
{ First: "Ali", second: 'Abdou', data: "2017-06-20" },
{ First: "Omar", second: 'Tankari', data: "2017-05-10" },
{ First: "Omar", second: 'Tounkou', data: "2017-05-20" },
{ First: "Nana", second: 'Gomma', data: "2017-08-11" },
{ First: "Tante", second: 'Didi', data: "2017-04-01" }
];

const rowGetter = rowNumber => rows[rowNumber];

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
          <div id ="tabs">
              <ReactDataGrid
                  columns={columns}
                  rowGetter={rowGetter}
                  rowsCount={rows.length}
                  minHeight={500} />);
          </div>
      </div>
    );
  }
}

export default App;
