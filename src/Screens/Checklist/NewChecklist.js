import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import RowChsecklist from '../Row/RowChecklist'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import BackgroundService from '../../Service/BackgroundService'
import ChecklistModel from '../../Model/ChecklistModel';
import NextAuditModel from '../../Model/NextAuditModel';
import { Dialog, ProgressDialog, ConfirmDialog } from 'react-native-simple-dialogs';
import { Button } from 'react-native-paper';

class NewChecklist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assetId: props.navigation.state.params.assetId,
            categoryIdFK: props.navigation.state.params.categoryIdFK,
            title: 'Loading...',
            mToken: '',
            status: false,
            animating: true,
            dialogVisible: false,
            progressVisible: false,
            cDialogVisible: false,
            data: [],
            title: '',
            lastAuditDone: '',
            nextAuditDate: '',
            checklistId: 0

        }
    }


    componentDidMount = () => {

        console.log('Asset ' + this.state.assetId + ' catId ' + this.state.categoryIdFK);

        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {
                this.getData()
                this.getNextAuditDataFromServer()
            });
        });


    }

    componentWillUnmount() {
        this.setState({ isFetching: false });
    }

    getData = () => {
        ChecklistModel.getItemByCatId(this.state.categoryIdFK).then(result => {
            console.log(JSON.stringify(result.data));
            if (result.data.length > 0) {
                this.setState({ data: result.data, message: '', animating: false, title: 'Select Checklist' });
            } else {
                this.setState({ message: 'No Checklist Available', animating: false, title: '' });
            }

        })
    }



    getNextAuditDataFromServer = () => {
        return BackgroundService.getNextAudit(this.state.mToken).then((result) => {
            if (result) {
                console.log('result ' + JSON.stringify(result));
                return true
            }
        })
    }

    checkNextAudit = (checklistId) => {
        NextAuditModel.getItemByAssetCatId(this.state.assetId, checklistId).then(result => {
            console.log(JSON.stringify(result));
            if (result.data) {
                let mData = result.data
                this.setState({ dialogVisible: true, progressVisible: false, lastAuditDone: mData.lastAuditDone, nextAuditDate: mData.nextAuditDate });
            } else {
            
                this.setState({ progressVisible: false, cDialogVisible: true });
                BackgroundService.getNextAudit(this.state.mToken).then((result) => {
                    console.log('result ' + JSON.stringify(result));
                })

            }


        })
    }

    showAlert = (title, message) => {
        Alert.alert(title, message)
    }


    getDate = (mStringDate) => {
        return new Date(mStringDate);
    }

    onRefresh() {
        this.getData();
        this.setState({ isFetching: false });
    }

    onItemClickHandler(id, index) {
        switch (id) {
            case 'rootView': {
                let mItem = this.state.data[index]
                this.setState({ progressVisible: true, checklistId: mItem.checklistId, title: mItem.title }, () => {
                    this.checkNextAudit(mItem.checklistId)
                });

                break;
            }
        }
    }


    onClickHandler(id) {
        switch (id) {
            case 'openDrawer': {
                Navigation.openDrawer();
                break;
            }
            case 'start': {
                this.setState({ progressVisible: false, dialogVisible: false }, () => {
                    if (this.getDate(this.state.nextAuditDate) >= new Date()) {
                        this.startAudit()
                    } else {
                        this.showAlert('Hey', 'Already Done')
                    }
                });
                break;
            }
        }
    }

    startAudit = () => {
        this.setState({ progressVisible: false, dialogVisible: false, cDialogVisible: false }, () => {
            Navigation.navigate('Question', { checklistId: this.state.checklistId, assetId: this.state.assetId });
        })
    }

    render() {
        var progressBar = <View></View>;
        if (this.state.animating) {
            progressBar = (
                <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center' }}>
                    {this.state.animating ? <Loader animating={this.state.animating} /> : null}
                </View>

            )
        }
        var emptyView = <View></View>;
        if (this.state.message && !this.state.animating) {
            emptyView = (
                <View style={{ height: '100%', alignContent: 'center', justifyContent: 'center' }}>
                    <Text style={[styles.text, { alignSelf: 'center' }]}>{this.state.message}</Text>
                </View>
            )
        }

        var masterView = <View></View>;
        if (!this.state.animating && this.state.message == '') {
            masterView = (
                <View style={{ flex: 1, flexDirection: 'column' }}>

                    <View style={{ flex: 1 }}>
                        <FlatList
                            keyboardShouldPersistTaps="always"
                            style={{ paddingLeft: 5, paddingRight: 5 }}
                            data={this.state.data}
                            renderItem={({ item, index }) => {
                                return <RowChsecklist item={item} index={index} onPress={(action) => this.onItemClickHandler(action, index)} />;
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </View>

            )
        }
        return (

            <View style={styles.container}>
                <View>
                    <Header onPress={() => { this.props.navigation.goBack(null) }}>{this.state.title}</Header>
                </View>
                {progressBar}
                {emptyView}
                {masterView}
                <Dialog
                    visible={this.state.dialogVisible}
                    title={this.state.title}
                    onTouchOutside={() => this.setState({ dialogVisible: false })} >
                    <View style={{}}>
                        <Text style={styles.textHeader} >Last Done On : {this.state.lastAuditDone}</Text>
                        <Text style={styles.textHeader} >Expected On : {this.state.nextAuditDate}</Text>
                        <View style={{ margin: 10 }}>
                            <Button
                                mode="contained"
                                color='#0A8BCC'
                                uppercase={false}
                                loading={this.state.isLoading}
                                disabled={this.state.isLoading}
                                style={styles.btn}
                                contentStyle={{ height: 50 }}
                                onPress={() => { this.onClickHandler('start') }}  > Start Now </Button>
                        </View>
                    </View>
                </Dialog>
                <ProgressDialog
                    visible={this.state.progressVisible}
                    title="Progress Dialog"
                    message="Please, wait..."
                />
                <ConfirmDialog
                    title="No past data available"
                    message="Are you sure to continue this?"
                    visible={this.state.cDialogVisible}
                    onTouchOutside={() => this.setState({ cDialogVisible: false })}
                    positiveButton={{
                        title: "YES",
                        onPress: () => this.startAudit()
                    }}
                    negativeButton={{
                        title: "NO",
                        onPress: () => this.setState({ cDialogVisible: false })
                    }}
                />
            </View>
        )
    }
}
export default NewChecklist

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
    fab: {
        alignItems: 'center',
        margin: 16,
        right: 0,
        bottom: 0,
        alignSelf: 'center',
        backgroundColor: 'white',
    },
    btn: {
        marginBottom: 10,
        marginTop: 20,
        fontFamily: 'Barlow-Medium'
    },
})