import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import ImageLoader from '../../Components/ProgressBar/ImageLoader'

class SweetImage extends Component {
    constructor(props) {
        super(props)
        this.state = { checked: false, }
    }

    onLoading = (e) => {
        this.setState({ imgLoading: true })
    }

    onFailled = (e) => {
        this.setState({ imgLoading: false })
    }

    onSuccess = (e) => {
        this.setState({ imgLoading: false })
    }


    render() {
        return (
            <View style={[{ flexDirection: 'row', height: this.props.style.height, width: this.props.style.width }]}>
                <Image
                    resizeMode={this.props.resizeMode ? this.props.resizeMode : 'contain'}
                    source={this.props.source}
                    onLoadStart={(e) => this.onLoading(e)}
                    onLoadEnd={(e) => this.onFailled(e)}
                    onLoad={(e) => this.onSuccess(e)}
                    // source={{ uri: this.state.image }}
                    style={this.props.style} />
                {this.state.imgLoading ? <View style={{ height: '100%', width: '100%', alignContent: 'center', justifyContent: 'center', position: 'absolute' }}>
                    <ImageLoader
                        animating={this.state.imgLoading}
                        message={this.props.showMessage ? (this.props.message ? this.props.message : 'Image Loading...') : ''}
                        size={this.props.progressbarSize ? this.props.progressbarSize : 'small'}
                        color={this.props.progressbarColor ? this.props.progressbarColor : '#bc2b78'}
                    />
                </View> : null}

            </View>
        );
    }
}

export default SweetImage