import React, { Component } from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet, Image, Linking } from 'react-native';
import CardView from 'react-native-cardview';
import BorderButton from '../../Components/Button/BorderButton'
import { BASE_URL, LOGO_URL } from '../../Utils/Const'
import Icon from 'react-native-vector-icons/FontAwesome5';
import Snackbar from 'react-native-snackbar';
import { rgba } from 'polished'

class UpdateModel extends Component {
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
        this.setState({ version: 'version : ' + this.props.appVersion, storeUrl: this.props.storeUrl });
        console.log('version ' + this.props.version);
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
                        this.props.onPress('close');
                    }}>
                    <TouchableOpacity
                        style={styles.mainContainer}
                        activeOpacity={1}
                        onPressOut={() => { this.props.onPress('close1') }}>
                        <View style={{ width: '80%', justifyContent: 'center', alignItems: 'center', }}>
                            <CardView
                                style={{ marginRight: 10, marginTop: 5, marginLeft: 10, marginBottom: 5, height: 200, width: '100%', backgroundColor: 'white' }}
                                cardElevation={6}
                                cornerRadius={10}>
                                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 20 }}>

                                    <View style={{ width: '100%' }}>
                                        <TouchableOpacity onPress={() => { this.props.onPress('close') }} style={{ padding:5, position: 'absolute',alignSelf:'flex-end' }} >
                                            <Icon
                                                name='times-circle'
                                                type='font-awesome'
                                                color='red'
                                                size={24}
                                            />
                                        </TouchableOpacity>
                                        <Image
                                            style={
                                                { width: 60, height: 60, alignSelf: 'center', marginBottom: 5 }
                                            }
                                            resizeMode='contain'
                                            source={{ uri: LOGO_URL }}
                                        />
                                        <View style={{width:'100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 5, alignSelf: 'baseline' }}>
                                            <Text style={[styles.textMessageHead, { marginBottom: 5, marginTop: 0 }]}>New Release</Text>
                                            <Text style={[styles.text, { marginBottom: 20, marginTop: 5 }]}>{this.state.version} available on store</Text>
                                        </View>
                                        <View style={styles.dividerThink}></View>
                                        <TouchableOpacity style={[{ marginTop: 0, marginBottom: 10, alignSelf: 'center' }]} onPress={() => this.props.onPress('update')} >
                                            <Text style={[styles.textBack, { marginTop: 10, alignSelf: 'center' }]}>UPDATE NOW</Text>
                                        </TouchableOpacity>
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
export default UpdateModel

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: rgba('black', 0.3),
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
    textMessageHead: {
        fontSize: 16,
        color: '#1F2352',
        fontFamily: "Montserrat-Regular",
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
})