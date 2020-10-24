import React, { Component } from 'react';
import { Modal, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import CardView from 'react-native-cardview';
import { rgba } from 'polished'
import { Button, } from 'react-native-paper';

class ImageDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: props.modalVisible,
            isFeatching: false,
            index: props.index,
            imageName: props.imageName,
            isLoading: false
        };
    }

    componentDidMount = () => {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    _onNetworkChangeHandler = (status) => {
        this.setState({ isConnected: status })
        if (status == true && this.state.animating) {

        }
    }

    showMessage(message) {
        this.props.showMessage(message);
    }

    onClickHandler(id) {
        switch (id) {
            case 'delete': {
                this.setState({ isLoading: true }, () => {
                    this.props.onPress('delete', this.state.index);
                });
                break;
            }
        }
    }

    onItemClickHandler(id, index) {
        switch (id) {
            case 'rootView': {
                this.props.onPress('select', index);
                break;
            }
        }
    }



    render() {

        return (
            <View >
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.props.onPress('close', null);
                    }}>
                    <TouchableOpacity
                        style={styles.mainContainer}
                        activeOpacity={1}
                        onPressOut={() => {
                              this.props.onPress('close', null)
                        }}>
                        <View style={{ width: '90%', justifyContent: 'center', alignItems: 'center', }}>
                            <CardView
                                style={styles.card}
                                cardElevation={6}
                                cornerRadius={10}>
                                <View style={{ flex: 1 }}>
                                    <Image source={require('../../Assets/AssetOption/archive.png')} source={{ uri: this.state.imageName }} style={styles.photo} />
                                </View>
                                <View style={{ margin: 10, flexDirection: 'row' }}>
                                    <Button
                                        mode="contained"
                                        color='#0A8BCC'
                                        uppercase={false}
                                        loading={this.state.isLoading}
                                        disabled={this.state.isLoading}
                                        style={{marginRight:4,flex:1}}
                                        contentStyle={{  }}
                                        onPress={() => { this.onClickHandler('delete') }}  > {this.state.isLoading ? ' Wait... ' : ' Delete '}</Button>
                                    <Button
                                        mode="outlined"
                                        color='#707070'
                                        uppercase={false}
                                        style={{marginRight:4,flex:1}}
                                        contentStyle={{ }}
                                        onPress={() => { this.props.onPress('close') }} >Cancel</Button>
                                </View>
                            </CardView>

                        </View>
                    </TouchableOpacity>

                </Modal >
            </View >
        );
    }
}
export default ImageDialog

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: rgba('#000000', 0.3),
    },
    card: {
        marginRight: 5,
        marginTop: 5,
        marginLeft: 5,
        marginBottom: 5,
        height: '90%',
        width: '100%',
        backgroundColor: 'white'
    },
    photo: {
        width: '100%',
        height: '100%',
        resizeMode: "cover",
        alignSelf: 'center',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
})