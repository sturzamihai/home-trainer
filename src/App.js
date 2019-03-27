import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts'

export default class HomeTrainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modelData: [],
      sysData: []
    };
  }

  _getAppData = () => {
    fetch('http://localhost:3000/app/get').then(req => req.json()).then(data => {
      this.setState({
        modelData: data.model,
        sysData: [data.sys]
      },()=>console.log(data));
    });
  }

  _convertToRelevantSize = (data) => {
    if(data>=Math.pow(1024,3)) return [data/Math.pow(1024,3),'GB'];
    else if(data>=Math.pow(1024,2)) return [data/Math.pow(1024,2),'MB'];
    else return [data/1024,'KB'];
  }

  _getAccBatchesPlotting = () => {
    let acc_prog = [];
    this.state.modelData.forEach(elem => {
      elem.acc_prog.forEach(val=>acc_prog.push(val));
    });
    return acc_prog;
  }

  _getLossBatchesPlotting = () => {
    let loss_prog = [];
    this.state.modelData.forEach((elem) => {
      elem.loss_prog.forEach(val=>loss_prog.push(val))
    });
    return loss_prog;
  }

  _getAccEpochsPlotting = () => {
    let acc = [];
    this.state.modelData.forEach((elem) => acc.push(elem.acc));
    return acc;
  }

  _getLossEpochsPlotting = () => {
    let loss = [];
    this.state.modelData.forEach((elem) => loss.push(elem.loss));
    return loss;
  }
  
  componentDidMount() {
    this._getAppData();
  }
  render() {
    return (
      <View style={style.container}>
        <FlatList
          data={this.state.modelData}
          renderItem={({item})=> <Text>{item.epoch}-{item.loss}-{Math.round(item.acc*100)}%</Text>}
        />
        <FlatList
          data={this.state.sysData}
          renderItem={({item})=> <Text>{item.cpu.num}x{item.cpu.name}{'\n'}{Math.round(this._convertToRelevantSize(item.memory.free)[0])} {this._convertToRelevantSize(item.memory.free)[1]} free of {Math.round(this._convertToRelevantSize(item.memory.total)[0])} {this._convertToRelevantSize(item.memory.total)[1]} </Text>}
        />
        <LineChart
                style={{height:100}}
                data={ this._getAccBatchesPlotting() }
                svg={{ stroke: 'rgb(255, 0, 0)' }}
        >
        </LineChart>
        <LineChart
                style={{height:100}}
                data={ this._getLossBatchesPlotting() }
                svg={{ stroke: 'rgb(0, 255, 0)' }}
        >
        </LineChart>
        <LineChart
                style={{height:100}}
                data={ this._getAccEpochsPlotting() }
                svg={{ stroke: 'rgb(255, 0, 0)' }}
        >
        </LineChart>
        <LineChart
                style={{height:100}}
                data={ this._getLossEpochsPlotting() }
                svg={{ stroke: 'rgb(0, 255, 0)' }}
        >
        </LineChart>
        <TouchableOpacity style={style.button} onPress={this._getAppData}><Text>Refresh</Text></TouchableOpacity>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    paddingTop:100
  },
  button: {
    padding:15,
    backgroundColor: 'lightblue'
  }
});