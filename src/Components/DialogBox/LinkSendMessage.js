import React, { Component } from 'react';
import { Modal, TouchableOpacity, View, StyleSheet, Image, ImageBackground } from 'react-native';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { rgba } from 'polished'
import { Button, Text, } from 'react-native-paper';

class LinkSendMessage extends Component {
    state = {
        mToken: '',
        modalVisible: false,
        version: 'version : 1.0.3',
        storeUrl: '',
    };

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }



    componentDidMount = () => {
        this.setModalVisible(this.props.modalVisible);
        this.setState({});
    }


    _onNetworkChangeHandler = (status) => {
        this.setState({ isConnected: status })
        if (status == true && this.state.animating) {

        }
    }

    showMessage(message) {
        Snackbar.show({
            title: message,
            duration: Snackbar.LENGTH_SHORT,
        });
    }
    onClickHandler(id) {
        switch (id) {
            case 'update': {

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
                        // this.props.onPress('close');
                    }}>
                    <TouchableOpacity
                        style={styles.mainContainer}
                        activeOpacity={1}
                        onPressOut={() => {
                            // this.props.onPress('close')
                        }}>
                        <View style={{ width: '80%', justifyContent: 'center', alignItems: 'center', }}>
                            <CardView
                                style={{ marginRight: 10, marginTop: 5, marginLeft: 10, marginBottom: 5, height: '70%', width: '100%', backgroundColor: 'white' }}
                                cardElevation={6}
                                cornerRadius={10}>
                                <ImageBackground source={require('../../Assets/Curve/curve.png')} style={styles.backImage}  ></ImageBackground>
                                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                                    <Icon
                                        name='check'
                                        type='font-awesome'
                                        color='#0A8BCC'
                                        size={80}
                                    />
                                    <Text style={styles.textMedium}>Password Changed Successfully</Text>
                                    <Text style={styles.textLight}>Go to Login Page and access your account using new password.</Text>
                                    <View style={{ width: '100%' }}>
                                        <Button
                                            mode="contained"
                                            color='#0A8BCC'
                                            uppercase={false}
                                            loading={false}
                                            disabled={false}
                                            style={[styles.btn, { marginBottom: 10, marginTop: 20 }]}
                                            contentStyle={{ height: 50 }}
                                            onPress={() => { this.props.onPress('close') }}  > {false ? ' Wait... ' : ' Go To Login '}</Button>

                                    </View>
                                </View>
                            </CardView>

                        </View>
                    </TouchableOpacity>

                </Modal >
            </View >
        );
    }
}
export default LinkSendMessage

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: rgba('#000000', 0.3),
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 14,
        padding: 5,
        color: '#707070',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontFamily: 'Montserrat-Medium',
    },
    activityIndicator: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30
    },
    textRegular: {
        fontSize: 16,
        fontFamily: 'Barlow-Regular'
    },
    textLight: {
        fontSize: 12,
        fontFamily: 'Barlow-Light',
        textAlign: 'center',
        color: '#707070',
        marginBottom: 10
    },
    textMedium: {
        fontSize: 20,
        fontFamily: 'Barlow-Medium',
        marginBottom: 20,
        textAlign: 'center',
        color: '#2D2D2D'
    },
    textBack: {
        fontSize: 16,
        color: '#1F2352',
        fontFamily: "Montserrat-SemiBold",
    },
    dividerThink: {
        width: '100%',
        borderBottomWidth: 0.5,
        borderColor: '#CCC'
    },
    backImage: {
        position: "absolute",
        width: '100%',
        height: 135,
        resizeMode: "cover",
    },
})