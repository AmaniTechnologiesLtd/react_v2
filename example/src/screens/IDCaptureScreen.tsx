import React, { useCallback, useEffect, useState } from 'react';
import { AmaniSDK, IDSide } from 'react-native-amani-sdk';
import { useNavigation } from '@react-navigation/native';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export const IDCaptureScreen = () => {
  const navigation = useNavigation();
  const [frontImage, setFrontImage] = useState<null | string>(null);
  const [backImage, setBackImage] = useState<null | string>(null);
  const [captureProcessCompleted, setCaptureProcessCompleted] = useState(false);
  const onUploadPressed = useCallback(() => {
    AmaniSDK.sharedInstance.idCapture
      .upload()
      .then((uploadState) => {
        console.log(uploadState);
        navigation.setOptions({ headerShown: true });
      })
      .catch((e) => {
        console.error(e);
      });
  }, [navigation]);

  const onRestart = useCallback(() => {
    setFrontImage(null);
    setBackImage(null);
    setCaptureProcessCompleted(false);
    navigation.setOptions({ headerShown: true });
  }, [navigation]);

  const onFrontStart = useCallback(() => {
    AmaniSDK.sharedInstance.idCapture
      .start(IDSide.front)
      .then((frontImageData) => {
        setFrontImage(frontImageData);
      });
  }, []);

  const onBackStart = useCallback(() => {
    AmaniSDK.sharedInstance.idCapture
      .start(IDSide.back)
      .then((backImageData) => {
        setBackImage(backImageData);
        setCaptureProcessCompleted(true);
        if (Platform.OS === 'android') {
          AmaniSDK.sharedInstance.idCapture.setNFCCaptureFlagOnAndroid({
            withNFC: true,
          });
        }
      });
  }, []);

  useEffect(() => {
    AmaniSDK.sharedInstance.idCapture.setType('TUR_ID_1').then(() => {
      console.log('TYPE SET!');
    });
  }, []);

  return !captureProcessCompleted ? (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={onFrontStart}>
        <Text style={styles.button$text}>Start Front Capture</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={onBackStart}>
        <Text style={styles.button$text}>Start Back Capture</Text>
      </Pressable>
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.images}>
        <Image
          resizeMode="contain"
          style={styles.idImage}
          source={{ uri: frontImage! }}
        />
        <Image
          resizeMode="contain"
          style={styles.idImage}
          source={{ uri: backImage! }}
        />
      </View>
      <View style={styles.buttons}>
        <Pressable onPress={onUploadPressed} style={styles.button}>
          <Text style={styles.button$text}>Upload</Text>
        </Pressable>
        <Pressable onPress={onRestart} style={styles.button}>
          <Text style={styles.button$text}>Retry</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: -8,
  },
  button: {
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 14,
    fontWeight: '500',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 16,
    alignContent: 'center',
    marginTop: 12,
  },
  button$text: {
    color: '#000',
  },
  idImage: {
    width: 300,
    height: 200,
    marginHorizontal: 24,
    marginVertical: 12,
  },
  images: {
    flex: 1,
    justifyContent: 'center',
  },
});
