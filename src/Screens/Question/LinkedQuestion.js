import React, { Component } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import CheckButton from '../../Components/Button/CheckButton'
import RadioButton from '../../Components/Button/RadioButton'
import { RadioButton as RadioButton1, TextInput, Text, Snackbar, Button } from 'react-native-paper';
import { rgba } from 'polished'
import DatePicker from 'react-native-datepicker';

class LinkedQuestion extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: props.value,
            isDanger: 0,
            checked: false,
            visibleModel: false,
            referId: 0,
            data: props.navigation.state.params.data
        }
    }

    componentDidMount = () => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            return this.returnAnswer(false);
        });
    }

    showMessage(message) {
        this.setState({
            message: message,
            snackVisible: true,
        })
    }

    onChangeText = (text, id) => {
        switch (id) {
            case 'text': {
                this.setState({ value: text, visibleModel: false }, () => {

                })

                break;
            }
            case 'date': {
                this.setState({ date: text, value: text }, () => {

                })
                break;
            }
        }
    }

    returnAnswer = (returBack) => {
        let answer = this.state.value
        if (!answer) {
            this.showMessage('Give me answer please.')
            return true
        } else {
            this.props.navigation.state.params.returnData({ currentValue: answer, isDanger: this.state.isDanger, referId: this.state.referId });
            if(returBack){
                this.props.navigation.goBack();
            }
           
            return false
        }



    }
    onCheckHandler = (value, isDanger) => {
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

        this.setState({ value: currentValue, isDanger });
    }

    onRadioHandler = (value, isDanger) => {

        console.log('onClick');

        let prevValue = this.state.value;
        if (prevValue) {
            if (prevValue.includes(value)) {
                this.setState({ value: '', isDanger: 0 })
            } else {
                this.setState({ value: value, isDanger })
            }
        }
        else {
            this.setState({ value: value, isDanger }, () => {
            })
        }

    }


    onClickHandler(id) {
        console.log(id);

        switch (id) {
            case 'edit': {
                this.setState({ visibleModel: true });
                break;
            }

            case 'submit': {
                this.returnAnswer(true)
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
            case 'close': {
                this.setState({ visibleModel: false });
                break;
            }
        }
    }

    render() {


        var answerView = <View></View>;
        if (this.state.value && this.state.data.questionType != 'Input') {
            answerView = (
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.textLabel}>Answer : <Text style={styles.textContent}>{this.state.value}</Text> </Text>
                </View>
            )
        }

        var radioButton = <View></View>;
        if (this.state.data.questionType == 'SingleOption') {
            let options = this.state.data.options;
            if (options) {
                var optionsView = new Array();
                for (let index = 0; index < options.length; index++) {
                    const option = options[index];
                    optionsView[index] =
                        <RadioButton
                            key={index}
                            text={option.questionOption}
                            onPress={() => this.onRadioHandler(option.questionOption, option.isDanger)}
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
        if (this.state.data.questionType == 'MultiOption') {
            let options = this.state.data.options;
            if (options) {
                var optionsView1 = new Array();
                for (let index = 0; index < options.length; index++) {
                    let option = options[index];
                    option.checked = false;
                    optionsView1[index] =
                        <CheckButton
                            key={index}
                            text={option.questionOption}
                            onPress={() => this.onCheckHandler(option.questionOption, option.isDanger)}
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
        if (this.state.data.questionType == 'Input') {
            inputView = (
                <View style={{ marginTop: 10 }}>
                    <TextInput
                        value={this.state.value}
                        autoCapitalize='sentences'
                        underlineColor='#707070'
                        placeholder='Answer'
                        multiline={true}
                        disabled={false}
                        autoFocus={true}
                        style={[styles.input, { marginBottom: 0, }]}
                        onChangeText={text => this.onChangeText(text, 'text')}
                    />
                </View>
            )
        }


        var dateView = <View></View>;
        if (this.state.data.questionType == 'Date') {
            dateView = (
                <View>
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
                        <Text style={styles.sHeader}>{this.state.data.title}</Text>
                        {radioButton}
                        {checkButton}
                        {inputView}
                        {dateView}
                        {answerView}
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
                    <View style={{ position: 'relative' }}>
                        <Snackbar
                            duration={Snackbar.DURATION_SHORT}
                            visible={this.state.snackVisible}
                            onDismiss={() => this.setState({ snackVisible: false, message: '' })}
                        >{this.state.message} </Snackbar>
                    </View>
                </View>
            </View>
        );
    }
}

export default LinkedQuestion

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