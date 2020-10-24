import React, { Component } from 'react';
import { Modal, TouchableOpacity, View, StyleSheet, FlatList, ImageBackground } from 'react-native';
import CardView from 'react-native-cardview';
import { rgba } from 'polished'
import { Button, Text, TextInput } from 'react-native-paper';

class QuestionDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: props.modalVisible,
            isFeatching: false,
            question: props.question,
            value: props.value,
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
            case 'submit': {
                this.setState({ isLoading: true },()=>{
                    this.props.onPress('done', this.state.value);
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
                        this.props.onPress('done', this.state.value);
                    }}>
                    <TouchableOpacity
                        style={styles.mainContainer}
                        activeOpacity={1}
                        onPressOut={() => {
                            //  this.props.onPress('close', null)
                        }}>
                        <View style={{ width: '90%', justifyContent: 'center', alignItems: 'center', }}>
                            <CardView
                                style={{ marginRight: 5, marginTop: 5, marginLeft: 5, marginBottom: 5, height: '90%', width: '100%', backgroundColor: 'white' }}
                                cardElevation={6}
                                cornerRadius={10}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sHeader}>{this.state.question}</Text>
                                    <TextInput
                                        value={this.state.value}
                                        autoCapitalize='sentences'
                                        underlineColor='#707070'
                                        multiline={true}
                                        autoFocus={true}
                                        style={[styles.input, { marginBottom: 10, marginLeft: 10, marginRight: 10 }]}
                                        onChangeText={text => this.setState({ value: text })}
                                    />
                                </View>
                                <View style={{ margin: 10 }}>
                                    <Button
                                        mode="contained"
                                        color='#0A8BCC'
                                        uppercase={false}
                                        loading={this.state.isLoading}
                                        disabled={this.state.isLoading}
                                        style={styles.btn}
                                        contentStyle={{ height: 50 }}
                                        onPress={() => { this.onClickHandler('submit') }}  > {this.state.isLoading ? ' Wait... ' : ' Done '}</Button>
                                </View>
                            </CardView>

                        </View>
                    </TouchableOpacity>

                </Modal >
            </View >
        );
    }
}
export default QuestionDialog

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
    sHeader: {
        color: '#1F2352',
        fontSize: 20,
        fontFamily: 'Barlow-SemiBold',
        alignSelf: 'center',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        backgroundColor: rgba('#FFFFFF', 0),
        fontFamily: 'Barlow-Regular'
    },
    dividerThink: {
        width: '100%',
        borderBottomWidth: 0.5,
        borderColor: '#CCC'
    },
})