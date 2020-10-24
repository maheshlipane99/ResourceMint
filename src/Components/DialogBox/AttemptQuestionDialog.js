import React, { Component } from 'react';
import { Modal, TouchableOpacity, View, StyleSheet, FlatList, ImageBackground } from 'react-native';
import CardView from 'react-native-cardview';
import { rgba } from 'polished'
import { Button, Text, } from 'react-native-paper';
import RowQuestionMark from '../../Screens/Row/RowQuestionMark'

class AttemptQuestionDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mToken: '',
            modalVisible: false,
            timer: 60,
            isFeatching: false,
            questionCount: props.questionCount,
            attempt: props.attempt,
            skips: props.skips,
            data: [],
            isLoading: false
        };
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }



    componentDidMount = () => {
        this.setModalVisible(this.props.modalVisible);
        let data = [];
        let attempt = this.state.attempt;
        for (let index = 0; index < this.props.questionCount; index++) {
            let isAttempt = false
            if (attempt.includes(index)) {
                isAttempt = true
            }
            data.push({ item: (index + 1), isAttempt: isAttempt })
        }
        this.setState({ data });

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
                    let attempt = this.state.attempt;
                    let skips = this.state.skips;
                    for (let index = 0; index < this.props.questionCount; index++) {
                        if (!attempt.includes(index)&&!skips.includes(index)) {
                            this.props.showMessage('Attempt this question first');
                            this.props.onPress('select', index);
                            this.setState({ isLoading: false });
                            return
                        } else if (index == this.props.questionCount-1){
                            this.props.onPress('submit', null);
                        }
                    }
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
                            //  this.props.onPress('close', null)
                        }}>
                        <View style={{ width: '90%', justifyContent: 'center', alignItems: 'center', }}>
                            <CardView
                                style={{ marginRight: 5, marginTop: 5, marginLeft: 5, marginBottom: 5, height: '90%', width: '100%', backgroundColor: 'white' }}
                                cardElevation={6}
                                cornerRadius={10}>
                                <FlatList
                                    keyboardShouldPersistTaps="always"
                                    style={{ paddingLeft: 5, paddingRight: 5, alignSelf: 'center', marginTop: 15, marginBottom: 15 }}
                                    data={this.state.data}
                                    renderItem={({ item, index }) => {
                                        return <RowQuestionMark item={item} index={index} onPress={(mId) => this.onItemClickHandler(mId, index)} />;
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                    numColumns={5}
                                />
                                <View style={{ margin: 10 }}>
                                    <Button
                                        mode="contained"
                                        color='#0A8BCC'
                                        uppercase={false}
                                        loading={this.state.isLoading}
                                        disabled={this.state.isLoading}
                                        style={styles.btn}
                                        contentStyle={{ height: 50 }}
                                        onPress={() => { this.onClickHandler('submit') }}  > {this.state.isLoading ? ' Wait... ' : ' Submit Now '}</Button>
                                </View>
                            </CardView>

                        </View>
                    </TouchableOpacity>

                </Modal >
            </View >
        );
    }
}
export default AttemptQuestionDialog

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
    textInputContainer: {
        marginBottom: 20,
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
        fontSize: 14,
        fontFamily: 'Barlow-Light',
        color: '#707070',
        marginBottom: 10
    },
    textMedium: {
        fontSize: 20,
        fontFamily: 'Barlow-Medium',
        marginBottom: 20,
        marginTop: 20,
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