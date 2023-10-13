import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AmaniSDK,
  type AndroidPoseEstimationSettings,
  type IOSPoseEstimationSettings,
} from 'react-native-amani-sdk';
import { Preview } from '../components';

export const PoseEstimationScreen = () => {
  const navigation = useNavigation();
  const [imageData, setImageData] = useState<null | string>(null);

  const onUploadPressed = useCallback(() => {
    AmaniSDK.sharedInstance.poseEstimationSelfie
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
    AmaniSDK.sharedInstance.poseEstimationSelfie
      .start(iosSettings, androidSettings)
      .then((image) => setImageData(image));
  }, []);

  return !imageData ? (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={onStart}>
        <Text style={styles.button$text}>Start Pose Estimation</Text>
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

const androidSettings: AndroidPoseEstimationSettings = {
  poseCount: 3,
  animationDuration: 500,
  faceNotInside: 'Your face is not inside the area',
  faceNotStraight: 'Your face is not straight',
  faceIsTooFar: 'Your face is not inside the area',
  keepStraight: 'Please hold stable',
  alertTitle: 'Verification Failed',
  alertDescription: 'Failed 1',
  alertTryAgain: 'Try again',
};

const iosSettings: IOSPoseEstimationSettings = {
  faceIsOk: 'Please hold stable',
  notInArea: 'Please align your face to the area',
  faceTooSmall: 'Your face is in too far',
  faceTooBig: 'Your face is in too close',
  completed: 'Verification Completed',
  turnRight: '→',
  turnLeft: '←',
  turnUp: '↑',
  turnDown: '↓',
  lookStraight: 'Look straight',
  errorMessage:
    'Please complete the steps while your face is aligned to the area',
  tryAgain: 'Try again',
  errorTitle: 'Verification Failure',
  confirm: 'Confirm',
  next: 'Next',
  phonePitch: 'Please hold the phone straight',
  informationScreenDesc1:
    'To start verification, align your face with the area',
  informationScreenDesc2: '',
  informationScreenTitle: 'Selfie Verification Instructions',
  wrongPose: 'Your face must be straight',
  descriptionHeader:
    'Please make sure you are doing the correct pose and your face is aligned with the area',
  appBackgroundColor: '000000',
  appFontColor: 'ffffff',
  primaryButtonBackgroundColor: 'ffffff',
  primaryButtonTextColor: '000000',
  ovalBorderColor: 'ffffff',
  ovalBorderSuccessColor: '00ff00',
  poseCount: '3',
  showOnlyArrow: 'true',
  buttonRadious: '10',
  manualCropTimeout: 30,
};
