import React, { useCallback, useState } from 'react';
import { AmaniSDK } from 'react-native-amani-sdk';
import { Pressable, StyleSheet, Text, View, Platform } from 'react-native';

export const AndroidNFCScreen = () => {
  const [isCaptured, setIsCaptured] = useState<boolean>(false);

  const onStart = useCallback(() => {
    if (Platform.OS === 'android') {
      AmaniSDK.sharedInstance.androidNFCCapture
        .startNFC()
        .then((state) => {
          setIsCaptured(state);
          AmaniSDK.sharedInstance.androidNFCCapture.stopNFCListener();
        })
        .catch((err) => console.error(err));
    }
  }, []);

  return !isCaptured ? (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={onStart}>
        <Text style={styles.button$text}>Start NFC Capture</Text>
      </Pressable>
    </View>
  ) : (
    <Text>NFC Captured {}</Text>
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
