import React, { PureComponent } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class CameraScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      flashMode: RNCamera.Constants.FlashMode.off,
      type: RNCamera.Constants.Type.back,
      isFront: false,
      isLight: false,
    };
  }

  onClickHandler(id) {
    switch (id) {
      case 'light': {
        if (this.state.isLight) {
          this.setState({ isLight: false, flashMode: RNCamera.Constants.FlashMode.off });
        } else {
          this.setState({ isLight: true, flashMode: RNCamera.Constants.FlashMode.on });
        }

        break;
      }

      case 'camera': {
        if (this.state.isFront) {
          this.setState({ isFront: false, type: RNCamera.Constants.Type.back });
        } else {
          this.setState({ isFront: true, type: RNCamera.Constants.Type.front });
        }

        break;
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={this.state.type}
          flashMode={this.state.flashMode}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => this.onClickHandler('camera')} style={styles.camera}>
            <Icon
              active
              name='camera-party-mode'
              style={{ color: 'white', fontSize: 24, }}
              type={'FontAwesome'}
            />
          </TouchableOpacity>
          <Button
            mode="contained"
            color='#0A8BCC'
            uppercase={false}
            loading={this.state.isLoading}
            disabled={this.state.isLoading}
            style={styles.capture}
            contentStyle={{}}
            onPress={this.takePicture.bind(this)} > {this.state.isLoading ? ' Wait... ' : ' SNAP '}</Button>
          <TouchableOpacity onPress={() => this.onClickHandler('light')} style={styles.light}>
            <Icon
              active
              name={this.state.isLight ? 'lightbulb-on' : 'lightbulb-off'}
              style={{ color: 'white', fontSize: 24, }}
              type='ionicon'
            />
          </TouchableOpacity>
        </View>


      </View>
    );
  }

  takePicture = async () => {
    this.setState({ isLoading: true });
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      let imageUrl = data.uri
      this.props.navigation.state.params.returnData({ imageUrl: imageUrl });
      this.props.navigation.goBack();
      this.setState({ isLoading: true });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    alignSelf: 'center',
    margin: 10,
  },
  light: {
    alignSelf: 'center',
    margin: 10,
  },
  camera: {
    alignSelf: 'center',
    margin: 10,
  },
});