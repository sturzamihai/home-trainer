import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, FlatList, TouchableOpacity } from 'react-native';

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
  };
  _convertToRelevantSize = (data) => {
    if(data>=Math.pow(1024,3)) return [data/Math.pow(1024,3),'GB'];
    else if(data>=Math.pow(1024,2)) return [data/Math.pow(1024,2),'MB'];
    else return [data/1024,'KB'];
  };
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
        <TouchableOpacity onPress={this._getAppData}><Text>Refresh</Text></TouchableOpacity>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    paddingTop:100
  }
});