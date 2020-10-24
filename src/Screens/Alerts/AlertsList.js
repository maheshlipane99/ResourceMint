import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import RowAlert from '../Row/RowAlert'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import BackgroundService from '../../Service/BackgroundService'
import AlertModel from '../../Model/AlertModel';
import { dataChanged } from '../../Actions/DataChangedAction';
import { connect } from 'react-redux';

class AlertsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Alerts',
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
            });
        });


    }

    componentWillUnmount() {
        this.setState({ isFetching: false });
    }

    getData = () => {
        AlertModel.getAllItems().then(result => {
            console.log(JSON.stringify(result.data));
            if (result.data.length > 0) {
                this.setState({ data: result.data, message: '', animating: false, });
            } else {
                this.setState({ message: 'No Alerts', animating: false, });
                BackgroundService.getAlerts(this.state.mToken,1).then((result) => {
                    if (result) {
                        this.getData()
                    }
                })
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
                let mAlert = this.state.data[index]
                AlertModel.makeReaded(mAlert).then(result => {
                    console.log(JSON.stringify(result.data));
                    if (result.data) {
                        this.getData()
                        if (mAlert.message) {
                            Navigation.navigate('AlertDetails', { alertId: mAlert.alertId });
                        } else {
                            BackgroundService.getAlertsDetails(this.state.mToken, mAlert.alertId).then((result) => {
                                console.log(JSON.stringify(result));
                                if (result && result.message != '') {
                                    Navigation.navigate('AlertDetails', { alertId: mAlert.alertId });
                                    this.props.dataChanged({ isUpdated: true, type: 'alert' });
                                    this.props.dataChanged({ isUpdated: false, type: 'alert' });
                                }

                            })
                        }

                    }

                })
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
                                return <RowAlert item={item} index={index} onPress={(action) => this.onItemClickHandler(action, index)} />;
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

const mapStateToProps = (state) => {
    let isUpdated = state.DataReducer.isUpdated;
    return { isUpdated: isUpdated };
};

export default connect(mapStateToProps, { dataChanged })(AlertsList);

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