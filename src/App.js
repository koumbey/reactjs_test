import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import update from 'react-addons-update'
import ReactDataGrid from 'react-data-grid';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
const { Menu: { ContextMenu, MenuItem, SubMenu } } = require('react-data-grid-addons');
const addons = require('react-data-grid-addons');


class CustomTextInput extends Component {
    constructor(props) {
        super(props);
        this.focus = this.focus.bind(this);
    }

    focus() {
        this.textInput.focus();
    }

    render() {
        return (
                <input
                    type="date"
                    onClick={this.props.onClick}
                    value={this.props.value}
                    ref={(input) => { this.textInput = input; }} />
        );
    }
}

CustomTextInput.propTypes = {
    onClick: React.PropTypes.func,
    value: React.PropTypes.string
};

class ExampleEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment(props.value, 'YYYY-MM-DD')
        };
        this.handleChange = this.handleChange.bind(this);
        this.getInputNode = this.getInputNode.bind(this);
        this.getValue = this.getValue.bind(this);
    }

    componentDidMount(){
        console.log(this.getValue());
    }
    getInputNode(){
        return this.customInput;
    }

    getValue(){
        return this.state.startDate["_i"];
    }

    handleChange(date) {
        this.setState({
            startDate: date
        });
    }

    render() {
        return <DatePicker
            customInput ={<CustomTextInput/>}
            dateFormat = "YYYY-MM-DD"
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

const MyContextMenu = React.createClass({
    propTypes: {
        onRowDelete: React.PropTypes.func.isRequired,
        onRowInsertAbove: React.PropTypes.func.isRequired,
        onRowInsertBelow: React.PropTypes.func.isRequired,
        rowIdx: React.PropTypes.string.isRequired,
        idx: React.PropTypes.string.isRequired,
        selectedRow : React.PropTypes.object.isRequired
    },

    getInitialState(){
        return {conditions: [false, false, false]}
    },
    onRowDelete(e, data) {
        if (typeof(this.props.onRowDelete) === 'function') {
            this.props.onRowDelete(e, data);
        }
    },

    onRowInsertAbove(e, data) {
        if (typeof(this.props.onRowInsertAbove) === 'function') {
            this.props.onRowInsertAbove(e, data);
        }
    },

    onRowInsertBelow(e, data) {
        if (typeof(this.props.onRowInsertBelow) === 'function') {
            this.props.onRowInsertBelow(e, data);
        }
    },

    componentWillReceiveProps(newParam){
        if(newParam.selectedRow.rowId !== -1){
            console.log("hello :"+ newParam.selectedRow.rowId);
           if (newParam.selectedRow.rowId !== this.props.selectedRow.rowId ){
               let obj = newParam.selectedRow.row;
               let cond = [];
               cond.push(obj["id"] %2 ===0);
               cond.push(obj["title"].length <8);
               cond.push(obj["count"] <5000);
               this.setState({conditions: cond})
           }
        } else {
            this.setState({conditions: [false, false, false]})
        }
    },
    render() {
        return (
            <ContextMenu>
                {this.state.conditions[0] && <MenuItem data={{rowIdx: this.props.selectedRow, idx: this.props.idx}} onClick={this.onRowDelete}>Delete Row</MenuItem>}
                {this.state.conditions[1] && <MenuItem data={{rowIdx: this.props.rowIdx, idx: this.props.idx}} onClick={this.onRowInsertAbove}>Above</MenuItem>}
                {this.state.conditions[3] && <MenuItem data={{rowIdx: this.props.rowIdx, idx: this.props.idx}} onClick={this.onRowInsertBelow}>Below</MenuItem>}
            </ContextMenu>
        );
    }
});

const Example = React.createClass({
    getInitialState() {
        this._columns = [
            { key: 'id', name: 'ID' },
            { key: 'title', name: 'Title' },
            { key: 'count', name: 'Count' }
        ];

        let rows = [];
        for (let i = 1; i < 1000; i++) {
            rows.push({
                id: i,
                title: 'Title ' + i,
                count: i * 1000
            });
        }

        return { rows : rows , selectedIndexes: [], selectedRow:{row:{}, rowId:-1}};
    },
    getData(){
        let rows = [];
        for (let i = 1; i < 1000; i++) {
            rows.push({
                id: i,
                title: 'Title ' + i,
                count: i * 1000
            });
        }

        return rows;
    },

    rowGetter(rowIdx) {
        return this.state.rows[rowIdx];
    },

    deleteRow(e, { rowIdx }) {
        this.state.rows.splice(rowIdx, 1);
        this.setState({rows: this.state.rows});
    },

    insertRowAbove(e, { rowIdx }) {
        this.insertRow(rowIdx);
    },

    insertRowBelow(e, { rowIdx }) {
        this.insertRow(rowIdx + 1);
    },

    insertRow(rowIdx) {
        const newRow = {
            id: 0,
            title: 'New at ' + (rowIdx + 1),
            count: 0
        };

        let rows = [...this.state.rows];
        rows.splice(rowIdx, 0, newRow);

        this.setState({ rows });
    },

    onRowsSelected(rows) {
        if (this.state.selectedIndexes.length === 0) {
            this.setState({selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx)),
            selectedRow : {row :rows[0].row, rowIdx: rows[0].rowIdx}});

        } else {
            this.setState({selectedIndexes: this.state.selectedIndexes.concat(rows.map(r => r.rowIdx)),
            selectedRow: {row:{}, rowId:-1}});
        }

    },

    onRowsDeselected(rows) {
        let rowIndexes = rows.map(r => r.rowIdx);
        let leftIndex = this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1 );
        if (leftIndex.length === 1){
            this.setState({selectedIndexes: leftIndex, selectedRow: {row :this.state.rows[leftIndex[0]], rowId:leftIndex[0]}});
        } else{
            this.setState({selectedIndexes: leftIndex, selectedRow: {row:{}, rowId:-1}});
        }


    },

    render() {
        return (
            <ReactDataGrid
                contextMenu={<MyContextMenu selectedRow={this.state.selectedRow}
                                            onRowDelete={this.deleteRow}
                                            onRowInsertAbove={this.insertRowAbove}
                                            onRowInsertBelow={this.insertRowBelow}
                           />}
                columns={this._columns}
                rowGetter={this.rowGetter}
                rowsCount={this.state.rows.length}
                minHeight={500} rowSelection={{
                showCheckbox: true,
                enableShiftSelect: true,
                onRowsSelected: this.onRowsSelected,
                onRowsDeselected: this.onRowsDeselected,
                selectBy: {
                    indexes: this.state.selectedIndexes
                }}}/>
        );
    }
});





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
              <Example/>
          </div>
      </div>
    );
  }
}

export default App;
