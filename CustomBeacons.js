import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    DeviceEventEmitter
} from 'react-native';
import Beacons  from 'react-native-beacons-manager';
import BluetoothState from 'react-native-bluetooth-state';

export class CustomBeacons extends Component {
    // will be set as a reference to "beaconsDidRange" event:
    beaconsDidRangeEvent = null;
    // will be set as a reference to "authorizationStatusDidChange" event:
    authStateDidRangeEvent = null;

    constructor(props) {
        super(props);

        this.state = {
            bluetoothState: '',
            // region information
            identifier: 'FeasyBeacon for iOS',
            uuid: 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825',
            rangingDataSource: []
        };

        // OPTIONAL: listen to authorization change
        this.authStateDidRangeEvent2 = Beacons.BeaconsEventEmitter.addListener(
            'authorizationStatusDidChange',
            (info) => console.log('authorizationStatusDidChange: ', info)
        );
        this.authStateDidRangeEvent = DeviceEventEmitter.addListener(
            'authorizationStatusDidChange',
            (info) => console.log('authorizationStatusDidChange: ', info)
        );

        // Request for authorization always
        Beacons.requestAlwaysAuthorization();
    }

    componentDidMount() {
        //
        // component state aware here - attach events
        //

        const { identifier, uuid } = this.state;
        //
        // ONLY non component state aware here in componentWillMount
        //

        // MANDATORY: Request for authorization while the app is open
        //           -> this is the authorization set by default by react-native init in the info.plist file
        // RANGING ONLY (this is not enough to make MONITORING working)
        //Beacons.requestWhenInUseAuthorization();
        // Define a region which can be identifier + uuid,
        // identifier + uuid + major or identifier + uuid + major + minor
        // (minor and major properties are numbers)
        const region = { identifier, uuid };
        // Range for beacons inside the region
        Beacons
            .startRangingBeaconsInRegion(region) // or like  < v1.0.7: .startRangingBeaconsInRegion(identifier, uuid)
            .then(() => console.log('Beacons ranging started successfully'))
            .catch(error => console.log(`Beacons ranging not started, error: ${error}`));

        // Ranging: Listen for beacon changes
       this.beaconsDidRangeEvent2 = Beacons.BeaconsEventEmitter.addListener(
            'beaconsDidRange',
            (data) => {
                console.log('beaconsDidRange data: ', data);
                this.setState({ rangingDataSource: data.beacons });
            }
        );
       this.beaconsDidRangeEvent = DeviceEventEmitter.addListener(
            'beaconsDidRange',
            (data) => {
                console.log('beaconsDidRange data: ', data);
                this.setState({ rangingDataSource: data.beacons });
            }
        );
    }

    componentWillUnmount() {
        const { identifier, uuid } = this.state;
        const region = { identifier, uuid };
        // stop ranging beacons:
        Beacons
            .stopRangingBeaconsInRegion(region)
            .then(() => console.log('Beacons ranging stopped successfully'))
            .catch(error => console.log(`Beacons ranging not stopped, error: ${error}`));
        // remove auth state event we registered at componentDidMount:
        this.authStateDidRangeEvent.remove();
        // remove ranging event we registered at componentDidMount:
        this.beaconsDidRangeEvent.remove();
    }

    renderRangingRow(rowData) {
        return (
            <View >
                <Text >
                    UUID: {rowData.uuid ? rowData.uuid  : 'NA'}
                </Text>
                <Text >
                    Major: {rowData.major ? rowData.major : 'NA'}
                </Text>
                <Text >
                    Minor: {rowData.minor ? rowData.minor : 'NA'}
                </Text>
                <Text>
                    RSSI: {rowData.rssi ? rowData.rssi : 'NA'}
                </Text>
                <Text>
                    Proximity: {rowData.proximity ? rowData.proximity : 'NA'}
                </Text>
                <Text>
                    Distance: {rowData.accuracy ? rowData.accuracy.toFixed(2) : 'NA'}m
                </Text>
            </View>
        );
    }

    render() {
        const { rangingDataSource } =  this.state;
        let rows = []
        for(let i = 0; i < rangingDataSource.length; i++){
            let rowData = rangingDataSource[i];
            rows.push(this.renderRangingRow(rowData));
        }

        return (
            <View >
                <Text>
                    All beacons in the area
                </Text>
                {rows}
            </View>
        );
    }
}

const styles = StyleSheet.create({
});
