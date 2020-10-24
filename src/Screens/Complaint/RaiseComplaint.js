import React, { Component } from 'react'
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Image } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import RowImage from '../Row/RowImage'
import RowUserSelected from '../Row/RowUserSelected'
import { Button, TextInput, Text, Snackbar, FAB } from 'react-native-paper';
import { rgba } from 'polished'
import ImageDialog from '../../Components/DialogBox/ImageDialog'
import ComplaintModel from '../../Model/ComplaintModel';
import BackgroundService from '../../Service/BackgroundService'
import { dataChanged } from '../../Actions/DataChangedAction';
import { connect } from 'react-redux';
import Done from '../../Components/Done/Done'


const messageSuccess = 'This complaint saved offline, until network availability.';
const addUserMessage = 'To add or remove more users tap on any user';

class RaiseComplaint extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Raise Complaint',
            mToken: '',
            visibleModel: false,
            animating: false,
            isFetching: false,
            assetCodeDisable: true,
            isDraft: false,
            data: null,
            complaintId: 1,
            complaintImages: [],
            assignedUsers: [],
            selectedUser: [],
            index: 0,
            imageName: '',
            assetCode: '',
            subject: '',
            message: '',
            displayName: '',
            userRole: ''
        }
        this.checkDraft()
    }


    componentDidMount = () => {
        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {
            });
        });
        LocalStore.getUser().then(value => {
            if (value) {
                let displayName = value.firstName + ' ' + value.lastName;
                this.setState({ displayName: displayName, userRole: value.userRole });
            }
        });
    }

    checkDraft() {
        ComplaintModel.getDraftItem().then(result => {
            let mData = result.data
            this.addPhoto('')
            if (mData) {
                mData.complaintImages.forEach(element => {
                    this.addPhoto(element.imageName)
                });
                console.log(JSON.stringify(mData));
                this.setState({ assetCode: mData.assetCode, subject: mData.title, message: mData.message, complaintId: mData.complaintId, assetCodeDisable: true, isDraft: true, });
            }
        })
    }

    addPhoto = (imageUrl) => {
        let complaintImages = []
        let photo = {
            imageName: imageUrl,
            title: 'Add Photo'
        }
        complaintImages.push(photo)
        let listData = this.state.complaintImages;
        let data = complaintImages.concat(listData)
        this.setState({ complaintImages: data, animating: false });
    }


    addUser = (imageUrl) => {
        let complaintImages = []
        let user = {
            imageName: imageUrl,
            title: 'Add Photo'
        }
        complaintImages.push(photo)
        let listData = this.state.complaintImages;
        let data = complaintImages.concat(listData)
        this.setState({ complaintImages: data, animating: false });
    }

    deletePhoto = (mItem, callback) => {
        let complaintImages = this.state.complaintImages;
        var index = complaintImages.indexOf(mItem);
        if (index > -1) {
            complaintImages.splice(index, 1);
        }
        this.setState({ complaintImages: complaintImages, animating: false });
        callback()
    }

    componentWillUnmount() {
        this.setState({ isFetching: false });
    }



    onRefresh() {
        this.setState({ isFetching: false });
    }

    onClickHandler(id) {
        console.log(id);

        switch (id) {
            case 'raise': {
                //  Navigation.navigate('StatusList');
                if (this.state.assetCode == '') {
                    this.showMessage('Enter Asset Code')
                    return
                } else if (this.state.subject == '') {
                    this.showMessage('Enter Subject')
                    return
                } else if (this.state.message == '') {
                    this.showMessage('Enter Message')
                    return
                }

                if (this.state.selectedUser.length == 0) {
                    this.saveDraft(() => {
                        Navigation.navigate('MultiUser', { returnData: this.returnData.bind(this), assignedUsers: [] });
                    })
                } else {
                    this.raiseComplaint()
                }
                break;
            }
            case 'scan': {
                Navigation.navigate('GetCode', { returnData: this.returnData.bind(this) });
                break;
            }
            case 'search': {
                Navigation.navigate('SearchAsset', { returnData: this.returnData.bind(this) });
                break;
            }
            case 'myComplaint': {
                //  Navigation.navigate('MyComplaintList', {});
                this.props.navigation.state.params.returnData({ status: true, });
                this.props.navigation.goBack();
                break;
            }
        }
    }

    returnData = (data) => {
        console.log(JSON.stringify(data));
        if (data.assetCode) {
            this.setState({ assetCode: data.assetCode, assetCodeDisable: true });
        } else if (data.imageUrl) {
            this.addPhoto(data.imageUrl)
        } else if (data.assignedUsers) {
            this.setState({ assignedUsers: data.assignedUsers, selectedUser: data.selectedUser, complaintImages: [] }, () => {
                this.checkDraft()
            });
        }

    }


    saveDraft = (callback) => {
        this.deletePhoto(this.state.complaintImages[this.state.complaintImages.length - 1], () => {
            let complaint = {
                typeOfComplaintFK: 2,
                assetCode: this.state.assetCode,
                title: this.state.subject,
                message: this.state.message,
                raisedBy: this.state.displayName,
                assignedByUserRole: this.state.userRole,
                complaintImages: this.state.complaintImages,
                isDraft: true,
                complaintStatus: 'Draft'
            }
            if (this.state.isDraft) {
                complaint.complaintId = this.state.complaintId
                ComplaintModel.updateItem(complaint).then((result) => {
                    console.log(JSON.stringify(result));
                    this.setState({ complaintImages: [] }, () => {
                        callback()
                    })
                })
            } else {
                ComplaintModel.addItem(complaint).then((result) => {
                    console.log(JSON.stringify(result));
                    this.setState({ complaintImages: [] }, () => {
                        callback()
                    })
                })
            }
        })

    }

    raiseComplaint = () => {
        this.deletePhoto(this.state.complaintImages[this.state.complaintImages.length - 1], () => {
            let complaint = {
                typeOfComplaintFK: 2,
                assetCode: this.state.assetCode,
                title: this.state.subject,
                message: this.state.message,
                raisedBy: this.state.displayName,
                assignedByUserRole: this.state.userRole,
                assignedUsers: this.state.assignedUsers,
                complaintImages: this.state.complaintImages,
                isDraft: false,
                isMy: true,
                raisedOn: new Date().toISOString().slice(0, 10),
                complaintStatus: 'Pending'
            }

            if (this.state.isDraft) {
                complaint.complaintId = this.state.complaintId
                ComplaintModel.updateItem(complaint).then((result) => {
                    console.log(JSON.stringify(result));
                    BackgroundService.startComplaintUploading(this.state.mToken).then(() => {
                        // this.props.dataChanged({ isUpdated: true, type: 'complaint' });
                        // this.props.dataChanged({ isUpdated: false, type: 'complaint' });
                    })
                    this.setState({ isSubmited: true, });
                    // Navigation.navigate('HomeScreen');
                })
            } else {
                ComplaintModel.addItem(complaint).then((result) => {
                    console.log(JSON.stringify(result));
                    BackgroundService.startComplaintUploading(this.state.mToken).then(() => {
                        // this.props.dataChanged({ isUpdated: true, type: 'complaint' });
                        // this.props.dataChanged({ isUpdated: false, type: 'complaint' });
                    })
                    this.setState({ isSubmited: true, });
                    //  Navigation.navigate('HomeScreen');
                })
            }
        })

    }

    onItemClickHandler(id, index) {
        switch (id) {
            case 'rootView': {
                if (index == this.state.complaintImages.length - 1) {
                    Navigation.navigate('CameraScreen', { returnData: this.returnData.bind(this) });
                } else {
                    let imageName = this.state.complaintImages[index].imageName
                    console.log('view ' + index);
                    this.setState({ visibleModel: true, index, imageName });
                }
                break
            }
            case 'rootViewUser': {
                this.saveDraft(() => {
                    Navigation.navigate('MultiUser', { returnData: this.returnData.bind(this), assignedUsers: this.state.assignedUsers });
                })
                break
            }
        }
    }

    onModelItemClickHandler = (id, index) => {
        switch (id) {
            case 'delete': {
                this.setState({ visibleModel: false }, () => {
                    this.deletePhoto(this.state.complaintImages[index], () => {
                        this.showMessage('Deleted')
                    })
                });
                break;
            }
            case 'close': {
                this.setState({ visibleModel: false });
                break;
            }
        }
    }

    showMessage(message) {
        this.setState({
            messageText: message,
            snackVisible: true,
        })
    }

    render() {

        var submitedView = <View></View>;
        if (this.state.isSubmited) {
            submitedView = (
                <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center', padding: 20 }}>
                    <Done
                        title='Successfully Saved'
                        message={messageSuccess}
                        icon='check-circle'
                        onPress={() => { this.onClickHandler('myComplaint') }} />
                </View>
            )
        }

        var progressBar = <View></View>;
        if (this.state.animating) {
            progressBar = (
                <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center' }}>
                    {this.state.animating ? <Loader animating={this.state.animating} /> : null}
                </View>
            )
        }


        var imageModel = <View></View>;
        if (this.state.visibleModel) {
            imageModel = (
                <View>
                    <ImageDialog
                        modalVisible={true}
                        index={this.state.index}
                        imageName={this.state.imageName}
                        onPress={(action, index) => this.onModelItemClickHandler(action, index)}
                        showMessage={(message) => this.showMessage(message)}
                    />
                </View>
            )
        }


        var masterView = <View></View>;
        if (true) {
            masterView = (
                <ScrollView style={styles.container}>
                    <View>
                        <View style={{ backgroundColor: 'white', borderRadius: 10, borderColor: '#E9E6E5', borderWidth: 1, padding: 10, margin: 10 }}>
                            <View style={{}}>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity style={{ flex: 1 }} onPress={() => this.onClickHandler('search')}>
                                        <TextInput
                                            label='Asset Code'
                                            autoCapitalize='none'
                                            value={this.state.assetCode}
                                            keyboardType='default'
                                            underlineColor='#707070'
                                            disabled={this.state.assetCodeDisable}
                                            style={[styles.input, { marginBottom: 0, flex: 1 }]}
                                            onChangeText={text => this.setState({ assetCode: text })}
                                        />
                                    </TouchableOpacity>

                                    <FAB
                                        color='black'
                                        style={styles.fab}
                                        small={false}
                                        icon={require('../../Assets/QRCode/qr-code.png')}
                                        onPress={() => this.onClickHandler('scan')}
                                    />
                                </View>
                                <TextInput
                                    label='Subject'
                                    autoCapitalize='none'
                                    value={this.state.subject}
                                    keyboardType='default'
                                    underlineColor='#707070'
                                    style={[styles.input, { marginBottom: 0, }]}
                                    onChangeText={text => this.setState({ subject: text })}
                                />
                                <TextInput
                                    label='Message'
                                    autoCapitalize='none'
                                    value={this.state.message}
                                    multiline={true}
                                    keyboardType='default'
                                    underlineColor='#707070'
                                    style={[styles.input, { marginBottom: 0, }]}
                                    onChangeText={text => this.setState({ message: text })}
                                />

                                <Text style={[{ flex: 1, marginTop: 10, marginLeft: 10, color: '#C1C0C0', fontFamily: 'Barlow-Medium', fontSize: 14 }]}  >Photo</Text>
                                <FlatList
                                    keyboardShouldPersistTaps="always"
                                    style={{ paddingLeft: 5, paddingRight: 5 }}
                                    data={this.state.complaintImages}
                                    renderItem={({ item, index }) => {
                                        return <RowImage item={item} index={index} onPress={(action) => this.onItemClickHandler(action, index)} />;
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                    numColumns={3}
                                />
                                <View style={{ padding: 0, backgroundColor: 'white' }}>
                                    <FlatList
                                        keyboardShouldPersistTaps="always"
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        data={this.state.selectedUser}
                                        renderItem={({ item, index }) => {
                                            return <RowUserSelected item={item} index={index} onPress={(action) => this.onItemClickHandler(action, index)} />
                                        }}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                                {(this.state.selectedUser.length > 0) ? <Text style={[{ flex: 1, marginTop: 10, marginLeft: 10, color: '#C1C0C0', fontFamily: 'Barlow-Medium', fontSize: 14 }]}  >{addUserMessage}</Text> : null}
                            </View>
                        </View>
                        <View style={{ padding: 10 }}>
                            <Button
                                mode="contained"
                                color='#0A8BCC'
                                uppercase={false}
                                style={styles.btn}
                                disabled={this.state.animating}
                                loading={this.state.animating}
                                contentStyle={{ height: 50 }}
                                onPress={() => { this.onClickHandler('raise') }}  >{this.state.selectedUser.length == 0 ? 'Select User' : 'Raise Complaint'}</Button>
                        </View>
                    </View>
                </ ScrollView>
            )
        }

        return (

            <View style={styles.container}>
                <View>
                    <Header onPress={() => { this.props.navigation.goBack(null) }}>{this.state.title}</Header>
                </View>
                {progressBar}
                {masterView}
                {imageModel}
                {submitedView}

                <View style={{ position: 'relative' }}>
                    <Snackbar
                        duration={Snackbar.DURATION_SHORT}
                        visible={this.state.snackVisible}
                        onDismiss={() => this.setState({ snackVisible: false, messageText: '' })}
                    >{this.state.messageText} </Snackbar>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    let isUpdated = state.DataReducer.isUpdated;
    return { isUpdated: isUpdated };
};

export default connect(mapStateToProps, { dataChanged })(RaiseComplaint);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
    textBtn: {
        marginTop: 10,
        fontFamily: 'Barlow-Light',
        fontSize: 10,
    },
    btn: {
        marginTop: 10,
        fontFamily: 'Barlow-Medium',
        fontSize: 10,
    },
    textLabel: {
        color: '#C1C0C0',
        fontSize: 12,
        fontFamily: 'Barlow-Light',
    },
    textContent: {
        color: '#2D2D2D',
        fontFamily: 'Barlow-Regular',
        fontSize: 14
    },
    textTitle: {
        fontSize: 16,
        fontFamily: 'Barlow-Medium',
        color: '#646464'
    },
    input: {
        backgroundColor: rgba('#FFFFFF', 0),
        fontFamily: 'Barlow-Regular'
    },
    fab: {
        alignItems: 'center',
        margin: 16,
        right: 0,
        bottom: 0,
        alignSelf: 'center',
        backgroundColor: 'white',
    },
})