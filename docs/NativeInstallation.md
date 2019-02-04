# Native installation

## Getting started

`$ npm install react-native-magic-move --save`

### Mostly automatic installation

`$ react-native link react-native-magic-move`

### Manual installation

#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-magic-move` and add `RNMagicMove.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNMagicMove.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`

- Add `import com.ijzerenhein.magicmove.ReactMagicMovePackage;` to the imports at the top of the file
- Add `new ReactMagicMovePackage()` to the list returned by the `getPackages()` method

2. Append the following lines to `android/settings.gradle`:
   ```
   include ':react-native-magic-move'
   project(':react-native-magic-move').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-magic-move/android')
   ```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
   ```
     compile project(':react-native-magic-move')
   ```
