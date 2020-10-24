import React, { Component } from 'react'
import { View, FlatList, StyleSheet, PermissionsAndroid, TouchableOpacity, ScrollView, Platform, ToastAndroid } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import RowImage from '../Row/RowImage'
import { Button, TextInput, Text, Snackbar, FAB } from 'react-native-paper';
import { rgba } from 'polished'
import ImageDialog from '../../Components/DialogBox/ImageDialog'
import NewAssetModel from '../../Model/NewAssetModel';
import AssetImageModel from '../../Model/AssetImageModel';
import BackgroundService from '../../Service/BackgroundService'
import { dataChanged } from '../../Actions/DataChangedAction';
import { connect } from 'react-redux';
import Done from '../../Components/Done/Done'
import DatePicker from 'react-native-datepicker';


const messageSuccess = 'This complaint saved offline, until network availability.';


class AddAsset extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Add Asset',
            mToken: '',
            visibleModel: false,
            animating: false,
            isFetching: false,
            assetCodeDisable: true,
            isDraft: false,
            data: null,
            photo: null,
            imageName: '',
            assetCode: '',

            description: '',
            locationType: '',
            locationTypeId: 0,
            durationType: '',
            durationTypeId: 0,
            durationType1: '',
            durationTypeId1: 0,
            supplier: '',
            supplierId: 0,
            manufacturer: '',
            manufacturerId: 0,
            department: '',
            departmentId: 0,
            category: '',
            categoryId: 0,
            durationTypeNum: 0
        }
    }


    componentDidMount = () => {
        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {
            });
        });

        this.addPhoto('')
    }

    checkDraft() {

    }


    addPhoto = (imageUrl) => {
        let photo = {
            imageName: imageUrl,
            title: 'Add Photo'
        }
        this.setState({ photo: photo, animating: false });
    }



    deletePhoto = (callback) => {
        this.addPhoto('')
        callback()
    }

    componentWillUnmount() {
        this.setState({ isFetching: false });
    }


    onClickHandler(id) {
        console.log(id);

        switch (id) {
            case 'add': {
                //  Navigation.navigate('StatusList');
                let valid = this.validator();
                if (valid) {
                    this.addAsset()
                }
                break;
            }
            case 'scan': {
                Navigation.navigate('GetCode', { returnData: this.returnData.bind(this) });
                break;
            }
            case 'locationType': {
                Navigation.navigate('LocationType', { returnData: this.returnData.bind(this), locationTypeId: this.state.locationTypeId });
                break;
            }
            case 'cDurationType': {
                this.setState({ durationTypeNum: 0 });
                Navigation.navigate('DurationType', { returnData: this.returnData.bind(this), durationTypeId: this.state.durationTypeId });
                break;
            }
            case 'wDurationType': {
                this.setState({ durationTypeNum: 1 });
                Navigation.navigate('DurationType', { returnData: this.returnData.bind(this), durationTypeId: this.state.durationTypeId1 });
                break;
            }
            case 'supplier': {
                Navigation.navigate('Supplier', { returnData: this.returnData.bind(this), supplierId: this.state.supplierId });
                break;
            }
            case 'manufacturer': {
                Navigation.navigate('Manufacturer', { returnData: this.returnData.bind(this), manufacturerId: this.state.manufacturerId });
                break;
            }
            case 'department': {
                Navigation.navigate('Department', { returnData: this.returnData.bind(this), departmentId: this.state.departmentId });
                break;
            }
            case 'category': {
                Navigation.navigate('Category', { returnData: this.returnData.bind(this), categoryId: this.state.categoryId });
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
        } else if (data.locationTypeId) {
            this.setState({ locationType: data.title, locationTypeId: data.locationTypeId });
        } else if (data.categoryId) {
            this.setState({ category: data.title, categoryId: data.categoryId });
        } else if (data.departmentId) {
            this.setState({ department: data.title, departmentId: data.departmentId });
        } else if (data.manufacturerId) {
            this.setState({ manufacturer: data.title, manufacturerId: data.manufacturerId });
        } else if (data.supplierId) {
            this.setState({ supplier: data.title, supplierId: data.supplierId });
        } else if (data.durationTypeId) {
            (this.state.durationTypeNum == 0) ? this.setState({ durationType: data.title, durationTypeId: data.durationTypeId }) : this.setState({ durationType1: data.title, durationTypeId1: data.durationTypeId });
        }

    }

    validator = () => {
        if (!this.state.assetName) {
            this.showMessage('Enter Asset Name')
            return false
        } else if (!this.state.modelNumber) {
            this.showMessage('Enter Model Number')
            return false
        } else if (!this.state.companyAssetNumber) {
            this.showMessage('Enter Company Asset Number')
            return false
        } else if (this.state.locationType == '') {
            this.showMessage('Select Location Type')
            return false
        } else if (this.state.installationLocation == '') {
            this.showMessage('Enter Installation Location')
            return false
        } else if (this.state.date == '') {
            this.showMessage('Select Installation Date')
            return false
        } else if (this.state.durationType == '') {
            this.showMessage('Select Duration Type')
            return false
        } else if (this.state.durationType1 == '') {
            this.showMessage('Select Warrenty Duration Type')
            return false
        } else if (this.state.category == '') {
            this.showMessage('Select Category')
            return false
        } else if (this.state.department == '') {
            this.showMessage('Select Department')
            return false
        } else if (this.state.manufacturer == '') {
            this.showMessage('Select Manufacturer')
            return false
        } else if (this.state.supplier == '') {
            this.showMessage('Select Supplier')
            return false
        } else if (this.state.photo.imageName == '') {
            this.showMessage('Capture Asset Image')
            return false
        } else {
            return true
        }
    }



    addAsset = () => {
        let asset = {
            assetId: new Date().getTime(),
            assetTitle: this.state.assetName,
            assetCode: this.state.assetCode,
            modelNumber: this.state.modelNumber,
            companyAssetNo: this.state.companyAssetNumber,
            description: this.state.description,
            image: '',
            installationDate: this.state.date,
            installationLocationTypeIdFK: this.state.locationTypeId,
            categoryIdFK: this.state.categoryId,
            installedLocation: this.state.installationLocation,
            checkingDuration: this.state.checkingDuration,
            durationTypeIdFK: this.state.durationTypeId,
            warrenty: this.state.warrenty,
            warrantyDurationTypeIdFK: this.state.durationTypeId1,
            supplierIdFK: this.state.supplierId,
            departmentIdFK: this.state.departmentId,
            manufacturerIdFK: this.state.manufacturerId
        }

        let photo = {
            assetId: asset.assetId,
            imageName: this.state.photo.imageName
        }

        NewAssetModel.addItem(asset).then((result) => {
            console.log(JSON.stringify(result));
            AssetImageModel.addItem(photo).then((result) => {
                console.log(JSON.stringify(result));
                BackgroundService.startAssetImageUploading(this.state.mToken);
                this.setState({ isSubmited: true, });
            })
        })

    }

    onItemClickHandler(id, index) {
        switch (id) {
            case 'rootView': {
                if (this.state.photo && this.state.photo.imageName == '') {
                    Navigation.navigate('CameraScreen', { returnData: this.returnData.bind(this) });
                } else {
                    let imageName = this.state.photo.imageName
                    this.setState({ visibleModel: true, imageName });
                }
                break
            }
        }
    }

    onModelItemClickHandler = (id, index) => {
        switch (id) {
            case 'delete': {
                this.setState({ visibleModel: false }, () => {
                    this.deletePhoto(() => {
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
                        onPress={() => { this.props.navigation.goBack(null) }} />
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
                                    <TextInput
                                        label='Existing QR Code'
                                        autoCapitalize='none'
                                        value={this.state.assetCode}
                                        keyboardType='default'
                                        underlineColor='#707070'
                                        disabled={this.state.assetCodeDisable}
                                        style={[styles.input, { marginBottom: 0, flex: 1 }]}
                                        onChangeText={text => this.setState({ assetCode: text })}
                                    />
                                    <FAB
                                        color='black'
                                        style={styles.fab}
                                        small={false}
                                        icon={require('../../Assets/QRCode/qr-code.png')}
                                        onPress={() => this.onClickHandler('scan')}
                                    />
                                </View>
                                <TextInput
                                    label='Asset Name'
                                    autoCapitalize='none'
                                    value={this.state.assetName}
                                    keyboardType='default'
                                    underlineColor='#707070'
                                    autoCapitalize='words'
                                    style={[styles.input, { marginBottom: 0, }]}
                                    onChangeText={text => this.setState({ assetName: text })}
                                />
                                <TextInput
                                    label='Model Number'
                                    autoCapitalize='none'
                                    value={this.state.modelNumber}
                                    keyboardType='default'
                                    underlineColor='#707070'
                                    style={[styles.input, { marginBottom: 0, }]}
                                    onChangeText={text => this.setState({ modelNumber: text })}
                                />
                                <TextInput
                                    label='Company Asset Number'
                                    autoCapitalize='none'
                                    value={this.state.companyAssetNumber}
                                    keyboardType='default'
                                    underlineColor='#707070'
                                    autoCapitalize='characters'
                                    style={[styles.input, { marginBottom: 0, }]}
                                    onChangeText={text => this.setState({ companyAssetNumber: text })}
                                />
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.onClickHandler('locationType')}>
                                    <TextInput
                                        label='Installation Location Type'
                                        autoCapitalize='none'
                                        value={this.state.locationType}
                                        keyboardType='default'
                                        underlineColor='#707070'
                                        disabled={true}
                                        style={[styles.input, { marginBottom: 0, }]}
                                    />
                                </TouchableOpacity>
                                <TextInput
                                    label='Installation Location'
                                    autoCapitalize='none'
                                    value={this.state.installationLocation}
                                    keyboardType='default'
                                    underlineColor='#707070'
                                    textContentType='location'
                                    style={[styles.input, { marginBottom: 0, }]}
                                    onChangeText={text => this.setState({ installationLocation: text })}
                                />
                                <View>
                                    <DatePicker
                                        style={{ width: 200, marginTop: 20, }}
                                        date={this.state.date}
                                        mode="date"
                                        placeholder="Installation Date"
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
                                        onDateChange={(date) => { this.setState({ date: date }) }}
                                    />
                                </View>
                                <Text style={[{ flex: 1, marginTop: 10, marginLeft: 10, color: '#C1C0C0', fontFamily: 'Barlow-Medium', fontSize: 14 }]}  >Checking Duration</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextInput
                                        label=''
                                        autoCapitalize='none'
                                        value={this.state.checkingDuration}
                                        keyboardType='numeric'
                                        underlineColor='#707070'
                                        style={[styles.input, { marginRight: 2, flex: 1, }]}
                                        onChangeText={text => this.setState({ checkingDuration: text })}
                                    />
                                    <TouchableOpacity style={{ flex: 3 }} onPress={() => this.onClickHandler('cDurationType')}>
                                        <TextInput
                                            label='Checking Duration Type'
                                            autoCapitalize='none'
                                            value={this.state.durationType}
                                            keyboardType='default'
                                            underlineColor='#707070'
                                            disabled={true}
                                            style={[styles.input, { marginLeft: 2, flex: 1 }]}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <Text style={[{ flex: 1, marginTop: 10, marginLeft: 10, color: '#C1C0C0', fontFamily: 'Barlow-Medium', fontSize: 14 }]}  >Warranty Duration</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextInput
                                        label=''
                                        autoCapitalize='none'
                                        value={this.state.warrenty}
                                        keyboardType='numeric'
                                        underlineColor='#707070'
                                        style={[styles.input, { marginRight: 2, flex: 1 }]}
                                        onChangeText={text => this.setState({ warrenty: text })}
                                    />
                                    <TouchableOpacity style={{ flex: 3 }} onPress={() => this.onClickHandler('wDurationType')}>
                                        <TextInput
                                            label='Warranty Duration Type'
                                            autoCapitalize='none'
                                            value={this.state.durationType1}
                                            keyboardType='default'
                                            underlineColor='#707070'
                                            disabled={true}
                                            style={[styles.input, { marginLeft: 2, flex: 1 }]}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.onClickHandler('category')}>
                                    <TextInput
                                        label='Category'
                                        autoCapitalize='none'
                                        value={this.state.category}
                                        multiline={true}
                                        keyboardType='default'
                                        underlineColor='#707070'
                                        disabled={true}
                                        style={[styles.input, { marginBottom: 0, }]}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.onClickHandler('department')}>
                                    <TextInput
                                        label='Department'
                                        autoCapitalize='none'
                                        value={this.state.department}
                                        multiline={true}
                                        keyboardType='default'
                                        underlineColor='#707070'
                                        disabled={true}
                                        style={[styles.input, { marginBottom: 0, }]}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.onClickHandler('manufacturer')}>
                                    <TextInput
                                        label='Manufacturer'
                                        autoCapitalize='none'
                                        value={this.state.manufacturer}
                                        multiline={true}
                                        keyboardType='default'
                                        underlineColor='#707070'
                                        disabled={true}
                                        style={[styles.input, { marginBottom: 0, }]}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.onClickHandler('supplier')}>
                                    <TextInput
                                        label='Supplier'
                                        autoCapitalize='none'
                                        value={this.state.supplier}
                                        multiline={true}
                                        keyboardType='default'
                                        underlineColor='#707070'
                                        disabled={true}
                                        style={[styles.input, { marginBottom: 0, }]}
                                    />
                                </TouchableOpacity>

                                <Text style={[{ flex: 1, marginTop: 10, marginLeft: 10, color: '#C1C0C0', fontFamily: 'Barlow-Medium', fontSize: 14 }]}  >Asset Photo</Text>
                                {this.state.photo ? <RowImage item={this.state.photo} index={0} onPress={(action) => this.onItemClickHandler(action, 0)} /> : null}
                                <TextInput
                                    label='Description'
                                    autoCapitalize='none'
                                    value={this.state.description}
                                    multiline={true}
                                    numberOfLines={3}
                                    keyboardType='default'
                                    underlineColor='#707070'
                                    style={[styles.input, { marginBottom: 0, }]}
                                    onChangeText={text => this.setState({ description: text })}
                                />
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
                                onPress={() => { this.onClickHandler('add') }}  >Add Asset</Button>
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

export default connect(mapStateToProps, { dataChanged })(AddAsset);

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