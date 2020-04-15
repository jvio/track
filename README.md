# track

Example using iBeacon for Tracking.

## Quick start

Application is using react-native.

```
npm install
npm start
```

## Pre-requisites

### Xcode 

Xcode needs to be [installed](https://apps.apple.com/us/app/xcode/id497799835?mt=12).

### React Native

Knowledge of [react-native](https://reactnative.dev/docs/environment-setup).

### Cocoa pods

Knowledge of [cocoa-pods](https://guides.cocoapods.org/using/using-cocoapods.html).

### Development Profile

Need to have a development team using apple id. 

Troubleshooting [here](https://stackoverflow.com/questions/39524148/xcode-error-code-signing-is-required-for-product-type-application-in-sdk-ios).

## Beacon 

Implemented beacon proximity using iBeacon protocol. 

Uses [react-native-beacons-manager](https://github.com/MacKentoch/react-native-beacons-manager/)

Example [here](https://github.com/MacKentoch/react-native-beacons-manager/blob/master/examples/samples/ranging.ios.js#L41)

### Background mode

Background mode configured to have the application wake up on beacon proximity.

Example [here](https://github.com/MacKentoch/react-native-beacons-manager/blob/master/BACKGROUND_MODES.md).

## Push Notifications 

Implemented push notifications for testing out beacon proximity even when app is not running.

Uses [react-native-push-notifications](https://github.com/zo0r/react-native-push-notification/).

Example [here](https://github.com/zo0r/react-native-push-notification/blob/master/example/NotifService.js).
