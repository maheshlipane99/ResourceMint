import React, { Component } from 'react'
import { View, FlatList, StyleSheet, ActivityIndicator, Platform, ScrollView, Image } from 'react-native'
import Loader from '../../Components/ProgressBar/Loader'
import SweetImage from '../../Components/Image/SweetImage'
import AssetOptions from '../../Utils/AssetOptions'
import BaseResponce from '../../Model/BaseResponce'
import { BASE_URL } from '../../Utils/Const'
import Navigation from '../../Service/Navigation'
import LocalStore from '../../Store/LocalStore'
import Header from '../../Components/ToolBar/Header'
import { Card, } from 'react-native-paper';
import { Button, TextInput, Text, Snackbar, Divider } from 'react-native-paper';
import AssetModel from '../../Model/AssetModel';

class AssetFullDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Asset Details',
            mToken: '',
            status: false,
            animating: true,
            isFetching: false,
            isLoto: true,
            assetId: props.navigation.state.params.assetId,
            data: null,
            options: AssetOptions,
            image: 'http://13.232.85.218/assetmate/admin/uploads/asset_images/Trolley_mounted_ABC.jpg'
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


    getData() {
        AssetModel.getItemById(this.state.assetId + "").then(result => {
            let mData = result.data
            if (mData) {
                console.log(mData);
                this.setState({ animating: false, data: mData });
            } else {
                this.showMessage("Invalid Asset Code")
                console.log(result.message);

            }
        })
    }


    onRefresh() {
        this.getData();
        this.setState({ isFetching: false });
    }

    onItemClickHandler(id, index) {
        switch (id) {
            case '1': {
                console.log(this.state.locality_list[index]);
                LocalStore.setLocality(this.state.locality_list[index])

                break;
            }

            case 'option': {


                break;
            }
        }
    }


    onClickHandler(id) {
        console.log(id);

        switch (id) {
            case 'loto': {
                Navigation.navigate('WebScreen', { url: this.state.data.userGuide });
                break;
            }
            case 'audit': {
                Navigation.navigate('Question', { categoryId: this.state.data.categoryId, assetId: this.state.data.assetId, assetmentTypeId: 1 });
                break;
            }
            case 'maintenance': {
                Navigation.navigate('Question', { categoryId: this.state.data.categoryId, assetId: this.state.data.assetId, assetmentTypeId: 2 });
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


        var masterView = <View></View>;
        if (!this.state.animating && this.state.data != null) {
            masterView = (

                <ScrollView style={styles.container}>

                    <Card style={[styles.detailContainer, { radius: 10, margin: 10 }]} elevation={5}>
                        <SweetImage
                            resizeMode='contain'
                            source={{ uri: this.state.data.assetImage }}
                            showMessage
                            style={{ width: '100%', height: 200, marginTop: 0, marginBottom: 1 }} />
                    </Card>
                    <Card style={[styles.detailContainer, { radius: 10, margin: 10 }]} elevation={5}>
                        <View >
                            <Text style={[styles.textLabel, { marginBottom: 5 }]}>Asset Code</Text>
                            <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.assetCode}</Text>
                            <Divider />
                            <Text style={[styles.textLabel, { marginBottom: 5 }]}>Company Asset Number</Text>
                            <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.companyAssetNo}</Text>
                            <Divider />
                            <Text style={[styles.textLabel, { marginBottom: 5 }]}>Model Number</Text>
                            <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.modelNumber}</Text>
                            <Divider />
                            <Text style={[styles.textLabel, { marginBottom: 5, marginTop: 10 }]}>Description</Text>
                            <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.description}</Text>
                            <Divider />
                            <Text style={[styles.textLabel, { marginBottom: 5, marginTop: 10 }]}>Installation Date</Text>
                            <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.installationDate}</Text>
                            <Divider />
                            <Text style={[styles.textLabel, { marginBottom: 5, marginTop: 10 }]}>Installation Location</Text>
                            <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.installedLocation}</Text>
                            <Divider />
                            <Text style={[styles.textLabel, { marginBottom: 5, marginTop: 10 }]}>Checking Duration</Text>
                            <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.checkingDuration} {this.state.data.durationTitle}</Text>
                            <Divider />
                            <Text style={[styles.textLabel, { marginBottom: 5, marginTop: 10 }]}>Warrenty</Text>
                            <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.warrenty} {this.state.data.warrentyPeriod}</Text>
                            <Divider />
                            <Text style={[styles.textLabel, { marginBottom: 5, marginTop: 10 }]}>Supplier Name</Text>
                            <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.supplierName}</Text>
                            <Divider />
                            <Text style={[styles.textLabel, { marginBottom: 5, marginTop: 10 }]}>Department Name</Text>
                            <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.departmentTitle}</Text>
                            <Divider />
                            <Text style={[styles.textLabel, { marginBottom: 5, marginTop: 10 }]}>Manufacturer</Text>
                            <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.manufacturerName}</Text>
                            <Divider />
                            <Text style={[styles.textLabel, { marginBottom: 5, marginTop: 10 }]}>Organization</Text>
                            <Text style={[styles.textContent, { marginBottom: 10 }]}>{this.state.data.organizationName}</Text>
                        </View>
                    </Card>
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
            </View>
        )
    }
}
export default AssetFullDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
    detailContainer: {
        padding: 10,
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
        fontSize: 13,
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
})