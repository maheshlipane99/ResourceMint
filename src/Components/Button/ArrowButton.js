import React from "react";
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Text,
  View,
  StyleSheet,
  Platform
} from "react-native";

import Icon from 'react-native-vector-icons/FontAwesome5';

const buttonWithBackground = props => {
  const content = (
    <View style={{ width: "100%" }}>
      <View colors={['#FBB01A', '#F16723', '#D9224D', '#B81F55']} style={styles.linearGradient}>
        <Text style={props.disabled ? styles.disabledText : styles.buttonText}>
          {props.children}
        </Text>
        <View style={{ alignItems: 'flex-end' }}>
        <Icon
            name='arrow-right'
            color='white'
            size={20}
          />
        </View>

      </View>
    </View>
  );
  if (props.disabled) {
    return content;
  }
  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback onPress={props.onPress} >
        {content}
      </TouchableNativeFeedback>
    );
  }
  return <TouchableOpacity onPress={props.onPress}>{content}</TouchableOpacity>;
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
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 0,
    alignItems: 'center',
    flexDirection: 'row'
  },
  buttonText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'left',
    margin: 0,
    color: '#ffffff',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  }

});

export default buttonWithBackground;
