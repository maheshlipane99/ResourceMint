import React, { Component } from 'react';
import { View, StyleSheet, BackHandler, TouchableOpacity, Image } from 'react-native';
import { TextInput, Text, Snackbar, Button } from 'react-native-paper';
import { rgba } from 'polished'
import Navigation from '../../Service/Navigation'
import ImageDialog from '../../Components/DialogBox/ImageDialog'
import ChekImageModel from '../../Model/ChekImageModel';

class TakePhotoQuestion extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: props.value,
            isDanger: 0,
            referId: 0,
            data: props.navigation.state.params.data,
            checklistImage: '',
            imageId: '',
            imageDescription: ''

        }
    }

    componentDidMount = () => {
        console.log(JSON.stringify(this.state.data));

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



    returnAnswer = (returBack) => {
        let imageId = this.state.imageId
        if (!imageId) {
            this.showMessage('Please take photo')
            return true
        } else {
            this.props.navigation.state.params.returnData({ currentValue: imageId, isDanger: this.state.isDanger, referId: this.state.referId });
            if (returBack) {
                this.props.navigation.goBack();
            }

            return false
        }

    }


    onClickHandler(id) {
        switch (id) {
            case 'done': {
                this.storeImage();
                break;
            }

            case 'cancel': {
                if(this.state.data.isCompulsory==1){
                    this.showMessage('Please take photo')
                }else{
                    this.props.navigation.goBack();
                }
              
                break;
            }

            case 'takePhoto': {
                if (!this.state.checklistImage) {
                    Navigation.navigate('CameraScreen', { returnData: this.returnData.bind(this) });
                } else {
                    this.setState({ visibleModel: true });
                }

                break;
            }
        }
    }
    storeImage = () => {

        if (!this.state.checklistImage) {
            this.showMessage('Please take photo')
            return true
        }
        let mTime = new Date().getTime()
        var imageId = 'IMG' + mTime + this.state.data.questionId
        console.log('ImageId ' + imageId);

        this.setState({ imageId }, () => {
            let mImage = {
                imageId: this.state.imageId,
                checklistImage: this.state.checklistImage,
                imageDescription: this.state.imageDescription
            }
            ChekImageModel.addItem(mImage).then((result) => {
                console.log(JSON.stringify(result));
                this.returnAnswer(true)
            })
        });

    }

    onModelItemClickHandler = (id, index) => {
        switch (id) {
            case 'delete': {
                this.setState({ checklistImage: '', visibleModel: false }, () => {
                    this.showMessage('Deleted')
                });
                break;
            }
            case 'close': {
                this.setState({ visibleModel: false });
                break;
            }
        }
    }

    returnData = (data) => {
        console.log(data);
        if (data.imageUrl) {
            this.setState({ checklistImage: data.imageUrl });
        }
    }

    render() {

        var imageModel = <View></View>;
        if (this.state.visibleModel) {
            imageModel = (
                <View>
                    <ImageDialog
                        modalVisible={true}
                        index={0}
                        imageName={this.state.checklistImage}
                        onPress={(action, index) => this.onModelItemClickHandler(action, index)}
                        showMessage={(message) => this.showMessage(message)}
                    />
                </View>
            )
        }

        return (
            <View style={{ flex: 1, width: '100%' }}>
                <View style={styles.container}>
                    <View style={{ flex: 1, justifyContent: 'flex-start', alignContent: 'center',backgroundColor:'white' }}>
                        <Text style={styles.sHeader}>{this.state.data.title}</Text>
                        <View style={{ flex: 1 }} >
                            {this.state.checklistImage ?
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.onClickHandler('takePhoto') }}>
                                    <Image source={{ uri: this.state.checklistImage }} style={styles.photo} />
                                </TouchableOpacity> :
                                <TouchableOpacity
                                    onPress={() => { this.onClickHandler('takePhoto') }}
                                    style={styles.btnImg}>
                                    <Image source={require('../../Assets/Plus/plus.png')} style={styles.backImage} />
                                    <Text style={styles.btnText} numberOfLines={2}>Take Photo</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={{ marginTop: 10, backgroundColor: 'white' }}>
                            <TextInput
                                value={this.state.imageDescription}
                                autoCapitalize='sentences'
                                underlineColor='#707070'
                                placeholder='Description'
                                multiline={true}
                                disabled={false}
                                style={[styles.input, { marginBottom: 0, }]}
                                onChangeText={text => this.setState({ imageDescription: text })}
                            />
                        </View>
                    </View>
                    <View style={{ margin: 10, flexDirection: 'row', alignContent: 'center', justifyContent: 'center',backgroundColor:'white' }}>
                        <Button
                            mode="contained"
                            color='#0A8BCC'
                            uppercase={false}
                            loading={this.state.isLoading}
                            disabled={this.state.isLoading}
                            style={[styles.btn, { marginRight: 5 }]}
                            contentStyle={{ height: 50 }}
                            onPress={() => { this.onClickHandler('done') }}  >{this.state.isLoading ? ' Wait... ' : ' Done '}</Button>

                        <Button
                            mode='outlined'
                            color='#0A8BCC'
                            uppercase={false}
                            loading={this.state.isLoading}
                            disabled={this.state.isLoading}
                            style={[styles.btn, { marginLeft: 5 }]}
                            contentStyle={{ height: 50 }}
                            onPress={() => { this.onClickHandler('cancel') }}  >Cancel</Button>
                    </View>
                    {imageModel}
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

export default TakePhotoQuestion

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor:'white'
    },
    sHeader: {
        color: '#1F2352',
        fontSize: 20,
        fontFamily: 'Barlow-SemiBold',
        alignSelf: 'center',
        marginBottom: 20
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
    btnImg: {
        justifyContent: 'center',
        alignSelf:'center',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        width: 100,
        height: 100
    },
    input: {
        backgroundColor: rgba('#FFFFFF', 0),
        fontFamily: 'Barlow-Regular'
    },
    photo: {
        width: 200,
        height: 300,
        resizeMode: "cover",
        alignSelf: 'center',
    },
    backImage: {
        width: 30,
        height: 30,
        resizeMode: "center",
        alignSelf: 'center',
        tintColor:'black'
    },
    btnText: {
        color: '#0A8BCC',
        fontFamily: 'Barlow-Regular',
        fontSize: 12,
        padding: 10,
        textAlign: 'center',

    },

})