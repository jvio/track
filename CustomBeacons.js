import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    DeviceEventEmitter
} from 'react-native';
import Beacons from 'react-native-beacons-manager';
import PushNotification from 'react-native-push-notification';
import { Colors } from "react-native/Libraries/NewAppScreen";

export class CustomBeacons extends Component {
    // will be set as a reference to "beaconsDidRange" event:
    beaconsDidRangeEvent = null;
    regionDidEnterEvent = null;
    // will be set as a reference to "authorizationStatusDidChange" event:
    authStateDidRangeEvent = null;
    notification = 0;

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
    }

    componentDidMount() {

        const { identifier, uuid, major, minor } = this.state;

        PushNotification.checkPermissions(() => {
        });

        PushNotification.configure({
            onNotification: notification => {
                console.log('NOTIFICATION:', notification);
            },
        });

        // MANDATORY: Request for authorization while the app is open
        //           -> this is the authorization set by default by react-native init in the info.plist file
        // RANGING ONLY (this is not enough to make MONITORING working)
        //Beacons.requestWhenInUseAuthorization();

        // OPTIONAL: listen to authorization change
        this.authStateDidRangeEvent = Beacons.BeaconsEventEmitter.addListener(
            'authorizationStatusDidChange',
            (info) => console.log('authorizationStatusDidChange: ', info)
        );
        /*this.authStateDidRangeEvent = DeviceEventEmitter.addListener(
            'authorizationStatusDidChange',
            (info) => console.log('authorizationStatusDidChange: ', info)
        );*/

        // Request for authorization always
        Beacons.requestAlwaysAuthorization();

        // Define a region which can be identifier + uuid,
        // identifier + uuid + major or identifier + uuid + major + minor
        // (minor and major properties are numbers)
        const region = {identifier, uuid, major, minor};
        // Range for beacons inside the region
        console.log(region);

        // Ranging: Listen for beacon changes
        this.beaconsDidRangeEvent = Beacons.BeaconsEventEmitter.addListener(
            'beaconsDidRange',
            (data) => {
                //console.log('beaconsDidRange data: ', data);
                this.setState({ beacons: data.beacons && data.beacons.length ? data.beacons : this.state.beacons });
            }
        );

        // Range for beacons inside the region
        Beacons
            .startRangingBeaconsInRegion(region) // or like  < v1.0.7: .startRangingBeaconsInRegion(identifier, uuid)
            .then(() => console.log('Beacons ranging started successfully'))
            .catch(error => console.log(`Beacons ranging not started, error: ${error}`));

        this.regionDidEnterEvent = Beacons.BeaconsEventEmitter.addListener(
            'regionDidEnter',
            (data) => {
                console.log('regionDidEnter data: ', data);
                PushNotification.localNotification({
                    message: 'Entered Region',
                });
            }
        );

        Beacons
            .startMonitoringForRegion(region) // or like  < v1.0.7: .startRangingBeaconsInRegion(identifier, uuid)
            .then(() => console.log('Beacons monitoring started successfully'))
            .catch(error => console.log(`Beacons monitoring not started, error: ${error}`));

        // deprecated
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
         );*/

        // deprecated
        /*PushNotification.addEventListener('localNotification', notification => {
            console.log('You have received a new notification!', notification);
        });*/
    }

    componentWillUnmount() {
        const { identifier, uuid } = this.state;
        const region = { identifier, uuid };
        // stop ranging beacons:
        Beacons
            .stopRangingBeaconsInRegion(region)
            .then(() => console.log('Beacons ranging stopped successfully'))
            .catch(error => console.log(`Beacons ranging not stopped, error: ${error}`));
        // stop ranging beacons:
        Beacons
            .stopMonitoringForRegion(region)
            .then(() => console.log('Beacons monitoring stopped successfully'))
            .catch(error => console.log(`Beacons monitoring not stopped, error: ${error}`));
        // remove auth state event we registered at componentDidMount:
        this.authStateDidRangeEvent.remove();
        // remove ranging event we registered at componentDidMount:
        this.beaconsDidRangeEvent.remove();
        this.regionDidEnterEvent.remove();
    }

    renderRow(rowData, index) {
        return (
            <View style={styles.sectionCode} key={index}>
                <Text style={styles.sectionLineCode}>
                    UUID: {rowData.uuid ? rowData.uuid  : 'NA'}
                </Text>
                <Text style={styles.sectionLineCode}>
                    Major: {rowData.major ? rowData.major : 'NA'}
                </Text>
                <Text style={styles.sectionLineCode}>
                    Minor: {rowData.minor ? rowData.minor : 'NA'}
                </Text>
                <Text style={styles.sectionLineCode}>
                    RSSI: {rowData.rssi ? rowData.rssi : 'NA'}
                </Text>
                <Text style={styles.sectionLineCode}>
                    Proximity: {rowData.proximity ? rowData.proximity : 'NA'}
                </Text>
                <Text style={styles.sectionLineCode}>
                    Distance: {rowData.accuracy ? rowData.accuracy.toFixed(2) : 'NA'}m
                </Text>
            </View>
        );
    }

    render() {
        const { beacons } =  this.state;
        let rows = []
        for (let i = 0; i < beacons.length; i++) {
            rows.push(this.renderRow(beacons[i], i));
        }

        return (
            <View>
                <Text style={styles.sectionTitle}>Beacons in the Area</Text>
                <View style={styles.sectionDescription}>
                    {rows.length ? rows : <Text style={styles.sectionDescription}>No Beacons</Text>}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    sectionCode: {
        fontSize: 18,
        padding: 10,
        color: Colors.dark,
        backgroundColor: Colors.light
    },
    sectionLineCode: {
        fontSize: 12,
        marginTop: 7,
    },
});
