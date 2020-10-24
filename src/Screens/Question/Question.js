import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

import Header from '../../Components/ToolBar/Header'
import LocalStore from '../../Store/LocalStore'
import Navigation from '../../Service/Navigation';
import Loader from '../../Components/ProgressBar/Loader'
import Done from '../../Components/Done/Done'
import RowQuestion from '../../Screens/Row/RowQuestion';
import RowQuestionSubmit from '../../Screens/Row/RowQuestionSubmit';
import BackgroundService from '../../Service/BackgroundService'
import {
    IndicatorViewPager,
} from 'rn-viewpager';
import { FAB, Snackbar, Card } from 'react-native-paper';
const messageSuccess = 'This checklist saved offline, until network availability.';

import ChecklistModel from '../../Model/ChecklistModel';
import DoneChecklistModel from '../../Model/DoneChecklistModel';
import AttemptQuestionDialog from '../../Components/DialogBox/AttemptQuestionDialog'

class Question extends Component {


    constructor(props) {
        super(props);
        this.state = {
            checklistId: props.navigation.state.params.checklistId,
            assetId: props.navigation.state.params.assetId,
            isConnected: false,
            title: 'Loading...',
            count: 'Loading...',
            currentPosition: 0,
            mLastIndex: 0,
            questions: [],
            linkedQuestions: [],
            answers: [],
            attempt: [],
            skips: [],
            message: '',
            isFeatching: true,
            showRightBtn: true,
            showLeftBtn: false,
            snackVisible: false,
            isLoading: false,
            isSubmited: false,
            visibleModel: false,
            doneBy: '',
            doneChecklistIdFK: 0
        }
    }

    componentDidMount = () => {

        LocalStore.getUser().then(value => {
            let mName = value.firstName + ' ' + value.lastName
            this.setState({ doneBy: mName });
        });

        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {
                this.checkDraft()
            });
        });


    }

    showMessage(message) {
        this.setState({
            message: message,
            snackVisible: true,
        })
    }

    checkDraft = () => {
        DoneChecklistModel.getDraftItemByAssetId(this.state.assetId, this.state.checklistId).then((result) => {
            console.log(JSON.stringify(result));
            if (result.data == null) {
                this.createChecklist()
            } else {
                console.log('available ID ' + result.data.doneChecklistId);
                let answers = []
                result.data.answers.forEach(element => {
                    answers.push(element)
                });
                this.setState({ doneChecklistIdFK: result.data.doneChecklistId, answers: answers }, () => {
                    this.loadChecklist(this.state.checklistId)
                });

            }

        })
    }

    createChecklist = () => {

        ChecklistModel.getItemById(this.state.checklistId).then((result) => {
            let data = result.data
            if (data) {
                let checkItem = {
                    checklistIdFK: this.state.checklistId,
                    categoryIdFK: data.categoryIdFK,
                    assetIdFK: this.state.assetId,
                    doneBy: this.state.doneBy,
                    doneOn: new Date().toISOString().slice(0, 10),
                    title: data.title
                }

                DoneChecklistModel.addItem(checkItem).then((result) => {
                    console.log(JSON.stringify(result));
                    if (result.data) {
                        this.checkDraft()
                    }

                })
            }

        })
    }

    loadChecklist = (mId) => {
        ChecklistModel.getItemById(mId).then((result) => {
            console.log(JSON.stringify(result.data));
            let data = result.data
            if (data) {
                let skips = []
                let questions = []
                let linkedQuestions = []
                if (data.questions && data.questions.length > 0) {
                    for (let index = 0; index < data.questions.length; index++) {
                        const element = data.questions[index];
                        if (element.isCompulsory == 0) {
                            skips.push(index)
                        }
                        if (element.isRefer == 0) {
                            questions.push(element)
                        } else {
                            linkedQuestions.push(element)
                        }

                    }
                }

                let count = '1 / ' + questions.length;
                this.setState({ questions: questions, linkedQuestions: linkedQuestions, count, isFeatching: false, title: 'Question', skips });
            }

        })
    }



    onItemClickHandler(id, index) {
        switch (id) {
            case 'next': {
                console.log(this.state.currentPosition + ' ' + this.state.questions.length);

                if (this.state.currentPosition == this.state.questions.length - 1) {
                    this.setState({ visibleModel: true });
                } else {
                    var currentPosition = this.state.currentPosition;
                    currentPosition = currentPosition + 1;

                    this.viewPager && this.viewPager.setPage(currentPosition);
                    this.setState({ currentPosition });
                    console.log(this.state.currentPosition + ' position')
                }

                break;
            }
            case 'prev': {
                var currentPosition = this.state.currentPosition;
                currentPosition = currentPosition - 1;
                this.viewPager && this.viewPager.setPage(currentPosition);
                this.setState({ currentPosition });
                console.log(this.state.currentPosition + ' position')

                break;
            }

            case 'skip': {
                LocalStore.setFirst('true');
                Navigation.navigate('LoginScreen', {})
                break;
            }
        }
    }

    submitData = () => {
        this.setState({ isLoading: true, visibleModel: false }, () => {
            let mCount = 0;
            let answers = this.state.answers
            answers.forEach(element => {
                DoneChecklistModel.addAnswer(this.state.doneChecklistIdFK, element).then((result) => {
                    console.log(JSON.stringify(result));
                    if (result.data == null) {
                        mCount = mCount + 1
                        if (mCount == this.state.answers.length) {
                            console.log('All Added' + this.state.doneChecklistIdFK);
                            DoneChecklistModel.doneChecklist(this.state.doneChecklistIdFK).then((result) => {
                                console.log(JSON.stringify(result));
                                if (result.data == null) {
                                    this.setState({ isSubmited: true });
                                    BackgroundService.startUploading(this.state.mToken)
                                }
                            })
                        }
                    }

                })
            });
        });
    }

    onClickHandler(id) {
        switch (id) {
            case 'submit': {
                this.submitData()
                break;
            }

            case 'cancel': {
                this.viewPager && this.viewPager.setPage(0);
                break;
            }

            case 'attemptQuestion': {
                this.setState({ visibleModel: true });
                break;
            }
        }

    }

    onPageSelected = (e) => {
        let count = (e.position + 1) + ' / ' + this.state.questions.length;
        this.setState({ currentPosition: e.position, tabPosition: e.position, count });

        if ((e.position) == 0) {
            this.setState({ showLeftBtn: false });
        } else {
            this.setState({ showLeftBtn: true });
        }
        if ((e.position) == this.state.questions.length) {
            //    this.setState({ showRightBtn: false, showLeftBtn: false, count: ' ', visibleModel: true });
        } else {
            this.setState({ showRightBtn: true, count });
        }

    }

    onPageScroll = (e) => {

    }

    onAnswerHandler = (value, isDanger, referId, index, mFlag) => {

        let question = []
        if (mFlag == 0) {
            question = this.state.linkedQuestions[index];
        } else {
            question = this.state.questions[index];
            this.addAttempt(index)
        }

        let answer = {
            doneChecklistIdFK: this.state.doneChecklistIdFK,
            questionIdFK: question.questionId,
            questionTitle: question.title,
            answer: value,
            isDanger: isDanger,
        }
        this.addAnswer(answer, referId)
    }

    onModelItemClickHandler = (id, mData) => {
        switch (id) {
            case 'submit': {
                this.submitData()
                break;
            }
            case 'close': {
                this.setState({ visibleModel: false });
                break;
            }
            case 'select': {
                let count = (mData + 1) + ' / ' + this.state.questions.length;
                this.viewPager && this.viewPager.setPage(mData);
                this.setState({ visibleModel: false, currentPosition: mData, count });
                break;
            }
        }
    }

    addAnswer = (mAnswer, referId) => {

        let answers = this.state.answers;
        this.isInArray(mAnswer, answers, (isPresent, index) => {
            console.log('isPresent ' + isPresent);
            if (isPresent) {
                if (mAnswer.answer != '') {
                    answers[index] = mAnswer
                } else {
                    answers.splice(index, 1);
                    this.removeAttempt(index)
                }
            } else {
                answers.push(mAnswer)
            }
            this.setState({ answers: answers }, () => {
                // Move to next page from here
                if (referId == 0) {
                    this.onItemClickHandler('next', 1)
                } else {
                    let linkedQuestions = this.state.linkedQuestions
                    for (let index = 0; index < linkedQuestions.length; index++) {
                        const element = linkedQuestions[index];
                        if (element.questionId == referId) {
                            this.setState({ mLastIndex: index })
                            if (element.questionType == 'TakePhoto') {
                                Navigation.navigate('TakePhotoQuestion', { data: element, returnData: this.returnData.bind(this) })
                            } else {
                                Navigation.navigate('LinkedQuestion', { data: element, returnData: this.returnData.bind(this) })
                            }

                            return
                        }
                    }
                }

            });
        })

        this.state.answers.forEach(element => {
            console.log(JSON.stringify(element));
        });

    }

    isInArray = (value, array, callback) => {

        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (element.questionIdFK === value.questionIdFK) {
                return callback(true, index);
            }
        }
        return callback(false, null);
    }

    addAttempt = (index) => {
        let attempt = this.state.attempt;
        if (!attempt.includes(index)) {
            attempt.push(index)
        }
        this.setState({ attempt: attempt })
    }


    removeAttempt = (item) => {
        console.log(item);
        let attempt = this.state.attempt;
        for (let index = 0; index < attempt.length; index++) {
            if (item == index) {
                attempt.splice((index + 1), 1);
            }
        }
        this.setState({ attempt: attempt }, () => {
        });
    }

    returnData = (data) => {
        console.log(data);
        this.onAnswerHandler(data.currentValue, data.isDanger, data.referId, this.state.mLastIndex, 0)

    }

    render() {

        var attemptQuestionMark = <View></View>;
        if (this.state.visibleModel) {
            attemptQuestionMark = (
                <View>
                    <AttemptQuestionDialog
                        modalVisible={this.state.visibleModel}
                        questionCount={this.state.questions.length}
                        attempt={this.state.attempt}
                        skips={this.state.skips}
                        onPress={(action, mData) => this.onModelItemClickHandler(action, mData)}
                        showMessage={(message) => this.showMessage(message)} />
                </View>
            )
        }

        var submitedView = <View></View>;
        if (this.state.isSubmited) {
            submitedView = (
                <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center', padding: 20 }}>
                    <Done
                        title='Successfully Saved'
                        message={messageSuccess}
                        icon='check-circle'
                        onPress={() => { this.props.navigation.goBack(null) }} />
                </View>
            )
        }


        var emptyView = <View></View>;
        if (this.state.message && !this.state.isSubmited) {
            emptyView = (
                <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center' }}>
                    <Text style={[styles.text, { alignSelf: 'center' }]}>{this.state.message}</Text>
                </View>
            )
        }

        var rightBtn = <View></View>;
        if (this.state.showRightBtn) {
            rightBtn = (
                <TouchableOpacity onPress={() => this.onItemClickHandler('next', 1)} style={{ paddingLeft: 20, height: '100%', alignContent: 'center', justifyContent: 'center' }} >
                    <Image
                        resizeMode='contain'
                        source={require('../../Assets/AssetOption/right-arrow.png')}
                        style={[styles.fab, { width: 20, height: 20, tintColor: 'white' }]} />
                </TouchableOpacity>
            )
        }

        var leftBtn = <View style={{ width: 40 }}></View>;
        if (this.state.showLeftBtn) {
            leftBtn = (
                <TouchableOpacity onPress={() => this.onItemClickHandler('prev', 1)} style={{ paddingRight: 20, height: '100%', alignContent: 'center', justifyContent: 'center' }} >
                    <Image
                        resizeMode='contain'
                        source={require('../../Assets/AssetOption/left-arrow.png')}
                        style={[styles.fab, { width: 20, height: 20, tintColor: 'white' }]} />
                </TouchableOpacity>
            )
        }

        var btns = <View></View>;
        if (this.state.showRightBtn) {
            btns = (
                <View style={styles.fabContainer}>
                    {leftBtn}
                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.onClickHandler('attemptQuestion')}>
                        <Text style={styles.textCount}>{this.state.count}</Text>
                    </TouchableOpacity>
                    {rightBtn}
                </View>
            )
        }

        var progressBar = <View></View>;
        if (this.state.isFeatching) {
            progressBar = (
                <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center' }}>
                    {this.state.isFeatching ? <Loader animating={this.state.isFeatching} /> : null}
                </View>

            )
        }

        var questions = new Array();
        for (let index = 0; index < this.state.questions.length; index++) {
            const element = this.state.questions[index];
            questions[index] =
                <View style={styles.pageStyle} key={index}>
                    <RowQuestion
                        data={element}
                        onPress={(action) => this.onItemClickHandler(action, 1)}
                        showMessage={(message) => this.showMessage(message)}
                        onAnswerHandler={(value, isDanger, referId) => { this.onAnswerHandler(value, isDanger, referId, index, 1) }} />
                </View>
        }

        // questions.push(
        //     <View style={styles.pageStyle} key={(this.state.questions.length + 2)}>
        //         <RowQuestionSubmit
        //             title={'Well done...!'}
        //             isLoading={this.state.isLoading}
        //             onClickHandler={(action) => this.onClickHandler(action)} />
        //     </View>
        // );

        if (!this.state.isFeatching && !this.state.isSubmited) {
            return (
                <View style={styles.container}>
                    <Header onPress={() => { this.props.navigation.goBack(null) }}>{this.state.title}</Header>
                    {attemptQuestionMark}
                    <Card style={{ flex: 1, backgroundColor: 'white', radius: 10, margin: 10 }} elevation={5}>
                        <View style={{ flex: 1, padding: 5 }}>
                            <IndicatorViewPager
                                style={styles.viewPager}
                                onPageScroll={this.onPageScroll}
                                onPageSelected={this.onPageSelected}
                                ref={viewPager => { this.viewPager = viewPager; }}
                                initialPage={this.state.currentPosition}>
                                {questions}
                            </IndicatorViewPager>

                            {btns}

                        </View>
                    </Card>
                    <View style={{ position: 'relative' }}>
                        <Snackbar
                            duration={Snackbar.DURATION_SHORT}
                            visible={this.state.snackVisible}
                            onDismiss={() => this.setState({ snackVisible: false, message: '' })}
                        >{this.state.message} </Snackbar>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <Header onPress={() => { this.props.navigation.goBack(null) }}>{this.state.title}</Header>
                    {attemptQuestionMark}
                    {progressBar}
                    {emptyView}
                    {submitedView}
                </View>
            )
        }



    }
}

export default Question;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flex: 1,
    },
    fabContainer: {
        width: '103%',
        backgroundColor: '#0A8BCC',
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        marginBottom: 0,
        position: 'absolute', bottom: 0,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    viewPager: {
        flex: 1
    },
    pageStyle: {
        alignItems: 'center',
        padding: 5,
    },
    fab: {
        alignItems: 'center',
        alignSelf: 'center',
    },
    textCount: {
        fontSize: 14,
        fontFamily: 'Barlow-Regular',
        textAlign: 'center',
        color: 'white',
        alignItems: 'center',
        backgroundColor: 'transparent',
    }
})