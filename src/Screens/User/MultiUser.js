import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl, Alert, BackHandler } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import { FAB, Snackbar } from 'react-native-paper';
import RowUser from '../Row/RowUser'
import RowUserSelected from '../Row/RowUserSelected'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import Background from '../../Components/Background/Background'
import SearchInput from '../../Components/Input/SearchInput'
import UserModel from '../../Model/UserModel';
import BackgroundService from '../../Service/BackgroundService'

import { ProgressDialog } from 'react-native-simple-dialogs';

class MultiUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Select Responsible Persons',
            mToken: '',
            statusId: '',
            btnActive: true,
            animating: true,
            progressVisible: false,
            data: [],
            selectedUser: [],
            assignedUsers: props.navigation.state.params.assignedUsers,
            searchText: '',
            selectedId: []

        }
    }


    componentDidMount = () => {

        LocalStore.getToken().then(value => {
            this.setState({ mToken: value }, () => {
                this.initSelectedUser(() => {
                    this.getData()
                })
                this.downloadUser()

            });
        });

        BackHandler.addEventListener('hardwareBackPress', () => {
            return this.returnUser(true);
        });
    }

    componentWillUnmount() {
        this.setState({ isFetching: false });
    }

    initSelectedUser = (callback) => {
        let selectedId = []
        for (let index = 0; index < this.state.assignedUsers.length; index++) {
            const element = this.state.assignedUsers[index];
            selectedId.push(element.userIdFK)
        }
        this.setState({ selectedId: selectedId }, () => {
            callback()
        });
    }

    getData = () => {
        UserModel.getAllItemsByLimit(this.state.data.length).then(result => {
            console.log(JSON.stringify(result.data));
            if (result.data.length > 0) {
                let mDataSelectedUser = []
                let listData = this.state.data;
                let data = listData.concat(result.data)
                data.forEach(element => {
                    if (this.state.selectedId.includes(element.userId)) {
                        element.isChecked = true
                        mDataSelectedUser.push(element)
                    }
                });
                this.setState({ loading: false, data: data, mCount: result.mCount, message: '', animating: false, selectedUser: mDataSelectedUser, isRefreshing: false })

            } else {
                if (this.state.data.length == 0) {
                    this.setState({ message: 'No User', animating: false, loading: false, isRefreshing: false });
                } else {
                    this.setState({ animating: false, loading: false, showButton: true, isRefreshing: false });
                }
            }

        })
    }

    downloadUser = () => {
        BackgroundService.getAllUser(this.state.mToken, 1).then((result) => {
            console.log(JSON.stringify(result));
            if (result) {
                this.setState({ data: [], selectedUser: [] }, () => {
                    this.getData()
                })
            }
        })
    }

    showAlert = (title, message) => {
        Alert.alert(title, message)
    }


    onRefresh() {
        this.downloadUser()
    }

    onItemClickHandler(id, index) {
        switch (id) {
            case 'rootView': {
                let mData = this.state.data
                let mDataSelected = []
                let mDataSelectedUser = []
                let mItem = mData[index]
                mItem.isChecked = !mItem.isChecked
                mData[index] = mItem
                mData.forEach(element => {
                    if (element.isChecked) {
                        mDataSelected.push(element)
                        let user = {
                            userIdFK: element.userId
                        }
                        mDataSelectedUser.push(user)
                    }
                });
                this.setState({ data: mData, selectedUser: mDataSelected, assignedUsers: mDataSelectedUser, message: '', animating: false, });
                break;
            }

            case 'remove': {

                break;
            }
        }
    }


    onClickHandler(id) {
        switch (id) {
            case 'done': {
                this.returnUser(false)
                break;
            }
            case 'search': {

                break;
            }
        }
    }

    returnUser = (isBack) => {
        if (isBack) {
            this.props.navigation.state.params.returnData({ assignedUsers: this.state.assignedUsers, selectedUser: this.state.selectedUser });
            return false
        } else {
            if (this.state.assignedUsers.length > 0) {
                this.props.navigation.state.params.returnData({ assignedUsers: this.state.assignedUsers, selectedUser: this.state.selectedUser });
                this.props.navigation.goBack();
            } else {
                this.showMessage('Atleast one user must be select')
            }
        }

    }

    onChangeText = (text) => {
        console.log(text);
    }

    showMessage(message) {
        this.setState({
            messageText: message,
            snackVisible: true,
        })
    }


    handleLoadMore = () => {
        console.log('fetch more');
        if (!this.state.loading) {
            this.setState({ loading: true }, () => {
                this.getData()
            })
        }
    };

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
                        {/* <SearchInput
                            onChangeText={(text) => { this.setState({ searchText: text }) }}
                            value={this.state.searchText}
                            onPress={() => this.onClickHandler('search')} /> */}
                        <FlatList
                            keyboardShouldPersistTaps="always"
                            style={{ paddingLeft: 5, paddingRight: 5 }}
                            data={this.state.data}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this.onRefresh.bind(this)}
                                />
                            }
                            renderItem={({ item, index }) => {
                                return <RowUser item={item} index={index} onPress={(action) => this.onItemClickHandler(action, index)} />
                            }}
                            keyExtractor={(item, index) => index.toString()}
                            ListFooterComponent={this.state.loading ? <Text style={{ color: '#000', alignSelf: 'center', textAlign: 'center', padding: 5 }}>Lodding...</Text> : null}
                            onEndReachedThreshold={0.4}
                            onEndReached={this.handleLoadMore.bind(this)}
                        />
                        <View style={{ padding: 0, backgroundColor: 'white' }}>
                            <FlatList
                                keyboardShouldPersistTaps="always"
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={this.state.selectedUser}
                                renderItem={({ item, index }) => {
                                    return <RowUserSelected item={item} index={index} onPress={(action) => this.onItemClickHandler('remove', index)} />
                                }}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View>
                </View>

            )
        }
        return (

            <View style={styles.container}>
                <Background>
                    <View>
                        <Header onPress={() => this.returnUser(false)}>{this.state.title}</Header>
                    </View>
                    {progressBar}
                    {emptyView}
                    {masterView}
                    <View style={{ position: 'relative' }}>
                        <Snackbar
                            duration={Snackbar.DURATION_SHORT}
                            visible={this.state.snackVisible}
                            onDismiss={() => this.setState({ snackVisible: false, message: '' })}
                        >{this.state.messageText} </Snackbar>
                    </View>
                    <FAB
                        style={styles.fab}
                        small={false}
                        icon={require('../../Assets/Done/done.png')}
                        onPress={() => this.onClickHandler('done')}
                    />
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
export default MultiUser

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
    fab: {
        position: 'absolute',
        marginRight: 16,
        marginBottom: 40,
        right: 0,
        bottom: 0,
        backgroundColor: '#0A8BCC',
    },
})