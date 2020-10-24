import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import RowChsecklist from '../Row/RowHistory'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import BackgroundService from '../../Service/BackgroundService'
import DoneChecklistModel from '../../Model/DoneChecklistModel';

class Outbox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Outbox',
            mToken: '',
            status: false,
            animating: true,
            data: []
        }
    }


    componentDidMount = () => {
        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {
                this.getData()
                //  this.getSubmittedData()
            });
        });
    }

    componentWillUnmount() {
        this.setState({ isFetching: false });
    }

    getData = () => {
        DoneChecklistModel.getAllPendingItems().then(result => {
            console.log(JSON.stringify(result.data));
            if (result.data.length > 0) {
                this.setState({ data: result.data, message: '', animating: false });
                result.data.forEach(element => {
                    console.log(JSON.stringify(element));
                });
                BackgroundService.startUploading(this.state.mToken).then(result => {
                    console.log(result);
                    // this.setState({ data: [] }, () => {
                    //     this.getData()
                    // });
                })

            } else {
                this.setState({ message: 'Outbox empty', animating: false, });
            }

        })
    }

    showAlert = (title, message) => {
        Alert.alert(title, message)
    }


    onRefresh() {
        this.getData();
        this.setState({ isFetching: false });
    }

    onItemClickHandler(id, index) {
        switch (id) {
            case 'rootView': {
                let doneChecklistId = this.state.data[index].doneChecklistId;
                
                Navigation.navigate('DoneChecklist', { doneChecklistId: doneChecklistId });
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
            case 'scan': {
                Navigation.navigate('ScanScreen');
                // Navigation.navigate('AssetDetail');
                break;
            }
        }
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
            </View>
        )
    }
}
export default Outbox

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
})