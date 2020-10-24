import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Card, Button } from 'react-native-paper';


export default class RowPending extends Component {
    render() {

        var btn = <View></View>;
        if (this.props.item.isLoad) {
            btn = (
                <View style={{ flex: 1, paddingRight: 10, alignSelf: 'flex-start', marginBottom: 10 }}>
                    <ActivityIndicator size='small' style={{ margin: 10, alignSelf: 'center' }} />
                </View>
            )
        } else {
            btn = (
                <View style={{ flex: 1, paddingRight: 10, alignSelf: 'flex-start', marginBottom: 10 }}>
                    <Button
                        mode="outlined"
                        color='#0A8BCC'
                        uppercase={false}
                        loading={this.props.item.isLoad}
                        disabled={this.props.item.isLoad}
                        style={{}}
                        contentStyle={{}}
                        onPress={() => { this.props.onPress('upload') }} >Upload Now</Button>
                </View>
            )
        }
        return (

            <View style={styles.itemContainer}>
                <Card style={{ backgroundColor: 'white', radius: 10 }} elevation={5}>
                    <TouchableOpacity onPress={() => this.props.onPress('rootView')} style={{ flexDirection: 'row', flex: 1, padding: 0 }}>
                        <View style={{ backgroundColor: 'white', padding: 5, margin: 5 }}>
                            <Image source={this.props.item.icon} style={styles.backImage} />
                        </View>
                        <View style={{ width: 0.5, height: '80%', backgroundColor: '#00000029', margin: 10, alignSelf: 'center' }}></View>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <View style={{ flexDirection: 'row', padding: 10, backgroundColor: 'white' }}>
                                <Text style={styles.textHeader} >{this.props.item.title}</Text>
                                <Text style={styles.textCount} >{this.props.item.count}</Text>
                            </View>
                            {btn}
                        </View>

                    </TouchableOpacity>

                </Card>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    itemContainer: {
        width: '95%',
        margin: 10
    },
    btnBox: {
        width: '100%',
        height: '100%',
        position: 'relative',
        padding: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#f0f0f0',
    },
    textHeader: {
        flex: 1,
        color: '#2D2D2D',
        fontFamily: 'Barlow-Medium',
        fontSize: 18,
        padding: 0,
        alignSelf: 'flex-start'

    },
    textCount: {
        color: 'black',
        fontFamily: 'Barlow-Bold',
        fontSize: 16,
        padding: 0,
        marginRight: 10

    },
    backImage: {
        width: 50,
        height: 50,
        resizeMode: "center",
    },
})