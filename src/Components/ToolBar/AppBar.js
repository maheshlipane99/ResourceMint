import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet
} from "react-native";

import Icon from 'react-native-vector-icons/FontAwesome5';

const AppBar = props => {
  const content = (
    <View style={{ width: "100%" }}>
      <View style={styles.linearGradient}>
        <TouchableOpacity onPress={props.onPress} >
        <Icon
            name='arrow-left'
            color='#1F2352'
            size={20}
          />
        </TouchableOpacity>

        <Text style={props.disabled ? styles.disabledText : styles.buttonText}>
          {props.children}
        </Text>

      </View>
    </View>
  );

  return (
    <View>
      {content}
    </View>
  )
};

const styles = StyleSheet.create({

  disabled: {
    backgroundColor: "#eee",
    borderColor: "#aaa"
  },
  enableText: {
    color: "white"
  },
  disabledText: {
    color: "#aaa"
  },
  linearGradient: {
    width: "100%",
    height: 50,
    paddingLeft: 20,
    paddingRight: 15,
    borderRadius: 0,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#EDEDF1'
  },
  buttonText: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    color: '#1F2352',
    alignItems: 'center',
    backgroundColor: 'transparent',
  }

});

export default AppBar;
