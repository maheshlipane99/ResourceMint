import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Navigation from '../../Service/Navigation';
import CheckButton from '../../Components/Button/CheckButton'
import RadioButton from '../../Components/Button/RadioButton'
import QuestionDialog from '../../Components/DialogBox/QuestionDialog'
import { RadioButton as RadioButton1, TextInput, Text, Button } from 'react-native-paper';
import { rgba } from 'polished'
import DatePicker from 'react-native-datepicker';
import ChekImageModel from '../../Model/ChekImageModel';
import ImageDialog from '../../Components/DialogBox/ImageDialog'

class RowQuestion extends Component {

    constructor(props) {
        super(props)
        this.state = {
            questionId: props.questionId,
            value: props.value,
            checked: false,
            visibleModel: false,
            visibleImageModel: false,
        }
    }
    state = {
        date: '',
        isDanger: 0,
        referId: 0,
        value: 'a'
    }

    onChangeText = (text, id) => {
        switch (id) {
            case 'text': {
                this.setState({ value: text, visibleModel: false }, () => {
                    this.props.onAnswerHandler(text, 0, 0)
                })

                break;
            }
            case 'date': {
                this.setState({ date: text, value: text }, () => {
                    this.props.onAnswerHandler(text, 0, 0)
                })
                break;
            }
        }
    }

    onCheckHandler = (value, isDanger, referId) => {
        let prevValue = this.state.value;
        let currentValue = '';
        if (prevValue) {
            if (prevValue.includes(value)) {
                if (prevValue.includes(value + ', ', '')) {
                    currentValue = prevValue.replace(value + ', ', '');
                } else {
                    currentValue = prevValue.replace(value, '');
                }

            } else {
                currentValue = prevValue + value + ', ';
            }
        }
        else {
            currentValue = value + ', ';
        }

        this.setState({ value: currentValue, isDanger, referId });
        this.props.onAnswerHandler(currentValue, isDanger, referId);
    }

    onRadioHandler = (value, isDanger, referId) => {

        console.log('onClick');

        let prevValue = this.state.value;
        if (prevValue) {
            if (prevValue.includes(value)) {
                this.setState({ value: '', isDanger: 0 })
                this.props.onAnswerHandler('', 0, this.state.referId);
            } else {
                this.setState({ value: value, isDanger })
                this.props.onAnswerHandler(value, isDanger, referId);
            }
        }
        else {
            this.setState({ value: value, isDanger }, () => {
                this.props.onAnswerHandler(value, isDanger, referId);
            })
        }

    }


    checkImage = (mImageId) => {
        ChekImageModel.getItemById(mImageId + "").then(result => {
            let mData = result.data
            if (mData) {
                console.log(mData);
                this.setState({ visibleImageModel: true, imageName: mData.checklistImage });
            } else {
                this.props.showMessage("No Image Found")
            }
        })
    }


    onClickHandler(id) {
        console.log(id);

        switch (id) {
            case 'edit': {
                this.setState({ visibleModel: true });
                break;
            }
            case 'photo': {
                if (this.state.value) {
                    this.checkImage(this.state.value)
                } else {
                    Navigation.navigate('TakePhotoQuestion', { data: this.props.data, returnData: this.returnData.bind(this) })
                }

                break;
            }
            case 'close': {
                this.setState({ visibleImageModel: false });
                break;
            }
        }
    }

    onModelItemClickHandler = (id, mData) => {
        switch (id) {
            case 'done': {
                this.onChangeText(mData, 'text')
                break;
            }
            case 'delete': {
                this.setState({ value: '', visibleImageModel: false }, () => {
                    this.props.showMessage('Deleted')
                    this.props.onAnswerHandler('', 0, this.state.referId);
                });
                break;
            }
            case 'close': {
                this.setState({ visibleImageModel: false });
                break;
            }
        }
    }

    returnData = (data) => {
        console.log(data);
        // this.onAnswerHandler(data.currentValue, data.isDanger, data.referId, this.state.mLastIndex,0)
        this.setState({ date: data.currentValue, value: data.currentValue }, () => {
            this.props.onAnswerHandler(data.currentValue, 0, this.state.referId)
        })

    }

    render() {

        var imageViewModel = <View></View>;
        if (this.state.visibleImageModel) {
            imageViewModel = (
                <View>
                    <ImageDialog
                        modalVisible={true}
                        index={0}
                        imageName={this.state.imageName}
                        onPress={(action, index) => this.onModelItemClickHandler(action, index)}
                        showMessage={(message) => this.props.showMessage(message)}
                    />
                </View>
            )
        }

        var textInputModel = <View></View>;
        if (this.state.visibleModel) {
            textInputModel = (
                <View>
                    <QuestionDialog
                        modalVisible={this.state.visibleModel}
                        question={this.props.data.title}
                        value={this.state.value}
                        onPress={(action, mData) => this.onModelItemClickHandler(action, mData)}
                    // showMessage={(message) => this.showMessage(message)} 
                    />
                </View>
            )
        }

        var answerView = <View></View>;
        if (this.state.value && this.props.data.questionType != 'Input') {
            answerView = (
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.textLabel}>Answer : <Text style={styles.textContent}>{this.state.value}</Text> </Text>
                </View>
            )
        }

        var radioButton = <View></View>;
        if (this.props.data.questionType == 'SingleOption') {
            let options = this.props.data.options;
            if (options) {
                var optionsView = new Array();
                for (let index = 0; index < options.length; index++) {
                    const option = options[index];
                    optionsView[index] =
                        <RadioButton
                            key={index}
                            text={option.questionOption}
                            onPress={() => this.onRadioHandler(option.questionOption, option.isDanger, option.referQuestionId)}
                        />
                }
            }
            radioButton = (
                <View>
                    <RadioButton1.Group
                        onValueChange={value => this.setState({ value })}
                        value={this.state.value}
                    >
                        {optionsView}
                    </RadioButton1.Group>
                </View>
            )
        }

        var checkButton = <View></View>;
        if (this.props.data.questionType == 'MultiOption') {
            let options = this.props.data.options;
            if (options) {
                var optionsView1 = new Array();
                for (let index = 0; index < options.length; index++) {
                    let option = options[index];
                    option.checked = false;
                    optionsView1[index] =
                        <CheckButton
                            key={index}
                            text={option.questionOption}
                            onPress={() => this.onCheckHandler(option.questionOption, option.isDanger, option.referQuestionId)}
                        />

                }
            }
            checkButton = (
                <View>
                    {optionsView1}
                </View>
            )
        }


        var inputView = <View></View>;
        if (this.props.data.questionType == 'Input') {
            inputView = (
                <TouchableOpacity onPress={() => { this.onClickHandler('edit') }} style={{ borderBottomColor: '#707070', borderBottomWidth: 1, marginTop: 10 }}>
                    <TextInput
                        value={this.state.value}
                        autoCapitalize='sentences'
                        underlineColor='#707070'
                        placeholder='Answer'
                        multiline={true}
                        disabled={true}
                        style={[styles.input, { marginBottom: 0, }]}
                        onChangeText={text => this.onChangeText(text, 'text')}
                    />
                </TouchableOpacity>
            )
        }


        var imageView = <View></View>;
        if (this.props.data.questionType == 'TakePhoto') {
            imageView = (
                <View style={{ marginTop: 10 }}>
                    <Button
                        mode='outlined'
                        color='#0A8BCC'
                        uppercase={false}
                        style={[styles.btn]}
                        contentStyle={{ height: 50 }}
                        onPress={() => this.onClickHandler('photo')}>{this.state.value ? 'View Photo' : 'Take Photo'}</Button>
                </View>
            )
        }

        var dateView = <View></View>;
        if (this.props.data.questionType == 'Date') {
            dateView = (
                <View>
                    {/* <Button
                        mode="contained"
                        color='#0A8BCC'
                        uppercase={false}
                        style={styles.btn}
                        contentStyle={{ height: 50 }}
                        onPress={() => { this.props.onClickHandler('login') }}  >Select Date</Button> */}
                    <DatePicker
                        style={{ width: 200, alignSelf: 'center', marginTop: 20, }}
                        date={this.state.date}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                            // ... You can check the source to find the other keys.
                        }}
                        onDateChange={(date) => { this.onChangeText(date, 'date') }}
                    />
                </View>
            )
        }

        return (
            <View style={{ flex: 1, width: '100%' }}>
                <View style={styles.container}>
                    <View style={{ flex: 1, justifyContent: 'flex-start', alignContent: 'center' }}>
                        <Text style={styles.sHeader}>{this.props.data.title}</Text>
                        {radioButton}
                        {checkButton}
                        {inputView}
                        {imageView}
                        {dateView}
                        {answerView}
                        {textInputModel}
                        {imageViewModel}
                    </View>
                </View>
            </View>
        );
    }
}

export default RowQuestion

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignContent: 'center',
    },
    sHeader: {
        color: '#1F2352',
        fontSize: 20,
        fontFamily: 'Barlow-SemiBold',
        alignSelf: 'center'
    },
    textMessage: {
        textAlign: 'center',
        color: '#707070',
        fontSize: 14,
        fontFamily: "Barlow-Regular",
    },
    btnText: {
        color: '#333',
        fontFamily: 'Barlow-SemiBold',
        fontSize: 12,
        textAlign: 'center'
    },
    fab: {
        margin: 10,
    },
    textSkip: {
        fontSize: 16,
        color: '#CFCFCF',
        fontFamily: "Barlow-Medium",
    },
    btn: {
        marginBottom: 10,
        marginTop: 20,
        fontFamily: 'Barlow-Medium'
    },
    input: {
        backgroundColor: rgba('#FFFFFF', 0),
        fontFamily: 'Barlow-Regular'
    },
    textLabel: {
        color: '#707070',
        fontSize: 12,
        fontFamily: 'Barlow-Regular',
    },
    textContent: {
        color: '#646464',
        fontSize: 14,
        fontFamily: 'Barlow-Medium',
    }

})