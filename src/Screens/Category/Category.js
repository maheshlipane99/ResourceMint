import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import { Button } from 'react-native-paper';
import RowStatus from '../Row/RowStatus'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import Background from '../../Components/Background/Background'
import CategoryModel from '../../Model/CategoryModel';
import BackgroundService from '../../Service/BackgroundService'

import { ProgressDialog } from 'react-native-simple-dialogs';

class Category extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categoryId: props.navigation.state.params.categoryId,
            header: 'Select Category',
            mToken: '',
            statusId: '',
            title: '',
            btnActive: true,
            animating: true,
            isLoading: false,
            progressVisible: false,
            data: []
        }
    }


    componentDidMount = () => {

        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {
                this.getData1()
                this.downloadStatus()
            });
        });
    }

    componentWillUnmount() {
        this.setState({ isFetching: false });
    }


    getData1 = () => {
        CategoryModel.getAllItemsByLimit(this.state.data.length).then(result => {
            console.log(JSON.stringify(result.data));
            if (result.data.length > 0) {
                let str = JSON.stringify(result.data)
                let mDataList = JSON.parse(str)
                for (let index = 0; index < mDataList.length; index++) {
                    const element = mDataList[index];
                    if (element.categoryId == this.state.categoryId) {
                        element.isChecked = true
                        mDataList[index] = element
                    }
                }
                let data = this.state.data.concat(mDataList)
                this.setState({ loading: false, data: data, mCount: result.mCount, message: '', animating: false })
            } else {
                if (this.state.data.length == 0) {
                    this.setState({ message: 'No Data', animating: false, loading: false, });
                } else {
                    this.setState({ animating: false, loading: false, showButton: true });
                }
            }

        })
    }

    downloadStatus = () => {
        BackgroundService.getCategory(this.state.mToken).then((result) => {
            console.log(JSON.stringify(result));
            if (result) {
                this.getData1()
            }
        })
    }

    showAlert = (title, message) => {
        Alert.alert(title, message)
    }


    onRefresh() {
        this.getData1()
        this.setState({ isFetching: false });
    }

    changeStatus = (index1) => {
        this.setState({ isLoading: true }, () => {
            let mData = this.state.data
            let newData = []
            let btnActive, categoryId,title
            for (let index = 0; index < mData.length; index++) {
                let mItem = this.state.data[index]
                    if (index == index1) {
                        mItem.isChecked = !mItem.isChecked
                        if (!mItem.isChecked) {
                            btnActive = true
                            categoryId = ''
                            title=''
                        } else {
                            btnActive = false
                            categoryId = mItem.categoryId
                            title=mItem.title
                        }
                    } else {
                        mItem.isChecked = false
                    }
                
                newData.push(mItem)
            }
            this.setState({ data: newData, message: '', animating: false, btnActive, categoryId, isLoading: false ,title});
        });

    }

    onItemClickHandler(id, index) {
        switch (id) {
            case 'rootView': {
                this.changeStatus(index)
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
            case 'change': {
                this.props.navigation.state.params.returnData({ categoryId: this.state.categoryId ,title: this.state.title});
                this.props.navigation.goBack();
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

                    <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 10, borderColor: '#E9E6E5', borderWidth: 1, padding: 10, margin: 10 }}>
                        <FlatList
                            keyboardShouldPersistTaps="always"
                            style={{ paddingLeft: 5, paddingRight: 5 }}
                            data={this.state.data}
                            renderItem={({ item, index }) => {
                                return <RowStatus item={item} index={index} onPress={(action) => this.onItemClickHandler(action, index)} />;
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <View style={{ padding: 10 }}>
                            <Button
                                mode="contained"
                                color='#0A8BCC'
                                uppercase={false}
                                style={styles.btn}
                                disabled={this.state.btnActive}
                                loading={this.state.isLoading}
                                contentStyle={{ height: 50 }}
                                onPress={() => { this.onClickHandler('change') }}  >OK</Button>
                        </View>
                    </View>
                </View>

            )
        }
        return (

            <View style={styles.container}>
                <Background>
                    <View>
                        <Header onPress={() => { this.props.navigation.goBack(null) }}>{this.state.header}</Header>
                    </View>
                    {progressBar}
                    {emptyView}
                    {masterView}
                    <ProgressDialog
                        visible={this.state.progressVisible}
                        title="Document Opening"
                        message="Please, wait..."
                    />
                </Background>
            </View>
        )
    }
}
export default Category

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
    btn: {
        marginBottom: 0,
        fontFamily: 'Barlow-Medium'
    },
})