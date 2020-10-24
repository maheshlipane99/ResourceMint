import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { INVOICE_BASE_URL } from '../../Utils/Const'
import Header from '../../Components/ToolBar/Header'
import NetworkStatus from '../../Components/ToolBar/NetworkStatus'
import { WebView } from 'react-native-webview';
import Loader from '../../Components/ProgressBar/Loader'

class WebScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Document',
            url: this.props.navigation.state.params.url
        };
    }

    componentDidMount = () => {

    }

    _onNetworkChangeHandler = (status) => {
        this.setState({ isConnected: status })
        if (status == true && this.state.animating) {

        }
    }

    progressbarVisible = (visible) => {
        this.setState({
            animating: visible,
            isFetching: visible,
        })
        console.log('progressBar ' + visible);

    }

    render() {

        var progressBar = <View></View>;
        if (this.state.animating) {
            progressBar = (
                <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center', position: 'relative' }}>
                    {this.state.animating ? <Loader animating={this.state.animating} /> : null}
                </View>

            )
        }

        var masterView = <View></View>;
        if (true) {
            masterView = (
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <WebView
                            source={{ uri: Platform.OS === 'ios' ? this.state.url : "https://drive.google.com/viewerng/viewer?embedded=true&url="+ this.state.url }}
                            onLoadStart={() => { this.progressbarVisible(true) }}
                            onLoadEnd={() => { this.progressbarVisible(false) }}
                        />
                    </View>
                </View>

            )
        }

        return (
            <View style={styles.container}>
                <View>
                    <Header onPress={() => { this.props.navigation.goBack(null) }}>{this.state.title}</Header>
                </View>
                <NetworkStatus onStatusChange={(status) => { this._onNetworkChangeHandler(status) }} />
                {progressBar}
                {masterView}
            </View>
        )
    }
}

export default WebScreen

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
})