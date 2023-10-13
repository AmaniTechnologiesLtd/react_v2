import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AmaniSDK,
  type AndroidAutoSelfieSettings,
  type IOSAutoSelfieSettings,
} from 'react-native-amani-sdk';
import { Preview } from '../components';

export const AutoSelfieScreen = () => {
  const navigation = useNavigation();
  const [imageData, setImageData] = useState<null | string>(null);

  const onUploadPressed = useCallback(() => {
    AmaniSDK.sharedInstance.autoSelfie
      .upload()
      .then((uploadState) => {
        console.log(uploadState);
        navigation.setOptions({ headerShown: true });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [navigation]);

  const onRestart = useCallback(() => {
    setImageData(null);
    navigation.setOptions({ headerShown: true });
  }, [navigation]);

  const onStart = useCallback(() => {
    AmaniSDK.sharedInstance.autoSelfie
      .start(iosSettings, androidSettings)
      .then((image) => setImageData(image));
  }, []);

  return !imageData ? (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={onStart}>
        <Text style={styles.button$text}>Start Auto Selfie</Text>
      </Pressable>
    </View>
  ) : (
    <Preview
      imageData={imageData}
      onUploadPressed={onUploadPressed}
      onRetryPressed={onRestart}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  button: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 14,
    fontWeight: '500',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 24,
  },
  button$text: {
    color: '#000',
  },
});

const androidSettings: AndroidAutoSelfieSettings = {
  textSize: 16,
  counterVisible: true,
  counterTextSize: 21,
  manualCaptureTimeout: 30,
  distanceText: 'Please align your face with the area',
  faceNotFoundText: 'No faces found',
  restartText: 'Process failed, restarting...',
  stableText: 'Please hold stable',
};

const iosSettings: IOSAutoSelfieSettings = {
  faceIsOk: 'Please hold stable',
  notInArea: 'Please align your face with the area',
  faceTooSmall: 'Your face is in too far',
  faceTooBig: 'Your face is in too close',
  completed: 'All OK!',
  appBackgroundColor: '000000',
  appFontColor: 'ffffff',
  primaryButtonBackgroundColor: 'ffffff',
  ovalBorderSuccessColor: '00ff00',
  ovalBorderColor: 'ffffff',
  countTimer: '3',
  manualCropTimeout: 30,
};
