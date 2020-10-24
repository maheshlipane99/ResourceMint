import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  NetInfo,
  Animated
} from "react-native";

class NetworkStatus extends Component {

  constructor(props) {
    super(props)
  }


  state = {
    timer: null,
    title: 'No Connection',
    isConnected: true,
    isShow: false,
    visiblity: true
  }


  componentWillMount = () => {
    // if (this.props.visiblity == false) {
    //   this.setState({ visiblity: false });
    // }

    // NetInfo.isConnected.addEventListener(
    //   'connectionChange',
    //   this._handleConnectivityChange
    // );

    // NetInfo.isConnected.fetch().done((isConnected) => {

    //   this.setState({ isConnected });
    //   this.props.onStatusChange(isConnected);

    //   if (isConnected) {
    //     this.setState({ isConnected, title: 'Online back' });
    //   } else {
    //     this._handleConnectivityChange(isConnected);
    //   }
    // });
  }

  componentDidMount = () => {
    if (this.props.visiblity == false) {
      this.setState({ visiblity: false });
    }

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );

    NetInfo.isConnected.fetch().done((isConnected) => {

      this.setState({ isConnected });
      this.props.onStatusChange(isConnected);

      if (isConnected) {
        this.setState({ isConnected, title: 'Online back' });
      } else {
        this._handleConnectivityChange(isConnected);
      }
    });
  }

  componentWillUnmount() {

    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isShow: nextProps.isShow })
  }

  _handleConnectivityChange = (isConnected) => {
    this.props.onStatusChange(isConnected);
    if (isConnected == true) {
      this.setState({ isConnected, title: 'Online back', isShow: true });
    } else {
      this.setState({ isConnected, title: 'No Connection', isShow: true });

    }


    Animated.timing(new Animated.Value(0), {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start(() => {
      console.log('done');
      this.setState({ isShow: false });
    })
  };

  render() {
    var content = <View></View>
    if ((this.state.isShow || (!this.state.isConnected)) && this.state.visiblity) {
      content = (
        <View style={this.state.isConnected ? styles.activeBack : styles.InActiveBack}>
          <Text style={this.state.isConnected ? styles.enableText : styles.disabledText}>
            {this.state.title}
          </Text>
        </View>
      );
    }


    return (
      <View >
        {content}
      </View>
    )
  };

}

const styles = StyleSheet.create({

  activeBack: {
    width: "100%",
    backgroundColor: "green",
    padding: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  InActiveBack: {
    width: "100%",
    backgroundColor: "#DC4E41",
    padding: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',

  },
  enableText: {
    color: "white",
    fontFamily: 'Barlow-Medium'
  },
  disabledText: {
    color: "white",
    fontFamily: 'Barlow-Medium'
  },


});

export default NetworkStatus;