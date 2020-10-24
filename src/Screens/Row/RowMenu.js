import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Platform,
} from "react-native";

import Icon from 'react-native-vector-icons/FontAwesome5';

export default class RowMenu extends Component {

  render() {
    return (
      <TouchableOpacity
        style={this.props.style}
        button
        noBorder
        onPress={() => this.props.onPress()}
      >
        <View style={{ flexDirection: 'row', alignItem: 'center', padding: 10, alignContent: 'center' }}>
          <View style={{ width: 30, marginLeft: 5, alignSelf: 'center', alignItems: 'center', alignContent: 'center' }}>
            <Icon
              active
              name={this.props.item.icon}
              style={{ color: this.props.style ? 'white' : "#0A8BCC", fontSize: 24, }}
              type={this.props.item.type || 'FontAwesome'}
            />
          </View>

          <Text style={[styles.text,{color: this.props.style ? 'white' : "#707070"}]}>
            {this.props.item.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({

  text: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 16,
    marginLeft: 20,
    fontFamily: 'Barlow-Medium',
    alignSelf: 'center'
  },

});
