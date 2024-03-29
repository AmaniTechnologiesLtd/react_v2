import React, { useCallback, useEffect, useState } from 'react';
import { AmaniSDK } from 'react-native-amani-sdk';
import { useNavigation } from '@react-navigation/native';
import { Preview } from '../components';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const DocumentCapture = () => {
  const navigation = useNavigation();
  const [imageData, setImageData] = useState<null | string>(null);

  const onUploadPressed = useCallback(() => {
    // You can start the upload process as shown below

    AmaniSDK.sharedInstance.documentCapture
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
    setImageData(null);
    navigation.setOptions({ headerShown: true });
  }, [navigation]);

  const onStart = useCallback(() => {
    AmaniSDK.sharedInstance.documentCapture.start().then((image) => setImageData(image));
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    AmaniSDK.sharedInstance.documentCapture.setType("TUR_IB_0")
  },[])

  return !imageData ? (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={onStart}>
        <Text style={styles.button$text}>Start Document Capture</Text>
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
  },
  button$text: {
    color: '#000',
  },
});
