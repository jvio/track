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
    regionDidEnterEvent = null;
    // will be set as a reference to "authorizationStatusDidChange" event:
    authStateDidRangeEvent = null;

    constructor(props) {
        super(props);

        this.state = {
            bluetoothState: '',
            // region information
            identifier: 'FSC_BP103',
            //uuid: 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825',
            uuid: 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825',
            //major: 10065,
            //minor: 26049,
            //uuid: '90B1E953-D1FE-3DC0-1046-BA0198057B88',
            beacons: []
        };

        // OPTIONAL: listen to authorization change
        this.authStateDidRangeEvent = Beacons.BeaconsEventEmitter.addListener(
            'authorizationStatusDidChange',
            (info) => console.log('authorizationStatusDidChange: ', info)
        );
        /*this.authStateDidRangeEvent = DeviceEventEmitter.addListener(
            'authorizationStatusDidChange',
            (info) => console.log('authorizationStatusDidChange: ', info)
        );
        */

        // Request for authorization always
        Beacons.requestAlwaysAuthorization();
    }

    componentDidMount() {
        //
        // component state aware here - attach events
        //

        const { identifier, uuid, major, minor } = this.state;
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
        const region = { identifier, uuid, major, minor };
        // Range for beacons inside the region
        console.log(region);
        Beacons
            .startMonitoringForRegion(region) // or like  < v1.0.7: .startRangingBeaconsInRegion(identifier, uuid)
            .then(() => console.log('Beacons monitoring started successfully'))
            .catch(error => console.log(`Beacons monitoring not started, error: ${error}`));
        // Range for beacons inside the region
        Beacons
            .startRangingBeaconsInRegion(region) // or like  < v1.0.7: .startRangingBeaconsInRegion(identifier, uuid)
            .then(() => console.log('Beacons ranging started successfully'))
            .catch(error => console.log(`Beacons ranging not started, error: ${error}`));

        // Ranging: Listen for beacon changes
       this.beaconsDidRangeEvent = Beacons.BeaconsEventEmitter.addListener(
            'beaconsDidRange',
            (data) => {
                console.log('beaconsDidRange data: ', data);
                this.setState({ beacons: data.beacons && data.beacons.length ? data.beacons : this.state.beacons });
            }
        );
        this.regionDidEnterEvent = Beacons.BeaconsEventEmitter.addListener(
            'regionDidEnter',
            (data) => {
                console.log('regionDidEnter data: ', data);
            }
        );
        /*this.beaconsDidRangeEvent = DeviceEventEmitter.addListener(
             'beaconsDidRange',
             (data) => {
                 console.log('beaconsDidRange data: ', data);
                 this.setState({ beacons: data.beacons });
             }
         );
        this.regionDidEnterEvent = DeviceEventEmitter.addListener(
             'regionDidEnter',
             (data) => {
                 console.log('regionDidEnter data: ', data);
             }
         );
         */
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
        this.regionDidEnterEvent.remove();
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
        const { beacons } =  this.state;
        let rows = []
        for(let i = 0; i < beacons.length; i++){
            let rowData = beacons[i];
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
