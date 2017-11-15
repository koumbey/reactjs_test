import React, { Component } from 'react';
//import d3 from 'd3'
import crossfilter from 'crossfilter'
import './index.css';
import 'dc/dc.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import logo from './logo.svg';
import './App.css';
import {PieChart, ChartContainer} from 'dc-react'

//const { arrayOf, func, number, string } = React.PropTypes;

class CrossfilterContext {
    constructor(data) {
        this.data = data;
        this.crossfilter = crossfilter(data);
        this.groupAll = this.crossfilter.groupAll();
        this.sexDimension = this.crossfilter.dimension(d => d.sex);
        this.intentDimension  = this.crossfilter.dimension(d => d.intent);
        this.intentGroup  = this.intentDimension.group();
        this.sexGroup = this.sexDimension.group().reduceSum(d => 1);
    }
}

class DashBord extends  Component{
    constructor(){
        super();
        this.state ={
            data :[]
        };
        this._crossfilterContext = null;
    }

    crossfilterContext = (callback) => {
        let globalScope = this;
        if (!callback) {
            return this._crossfilterContext;
        }
        fetch('http://localhost:8080/api').then(res => res.json())
            .then(function(data) {
                    globalScope._crossfilterContext = new CrossfilterContext(data);
                    callback(globalScope._crossfilterContext);
                }
            , function (err) {
                console.log(err);
            });
    };

    render(){
        debugger;
        return (
            <div className={"row"}>
                <ChartContainer className="container" crossfilterContext={this.crossfilterContext}>
                    <PieChart
                        dimension={ctx => ctx.sexDimension}
                        group={ctx => ctx.sexGroup}
                        width={180} height={180}
                        radius={80} innerRadius={30}
                    />
                    <PieChart
                        dimension={ctx => ctx.intentDimension}
                        group={ctx => ctx.intentGroup}
                        width={180} height={180}
                        radius={80} innerRadius={30}
                    />

                </ChartContainer>
            </div>
        )
    }

}
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
          <DashBord/>
      </div>
    );
  }
}

export default App;
