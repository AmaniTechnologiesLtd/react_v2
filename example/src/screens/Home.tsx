import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { AmaniSDK } from 'react-native-amani-sdk';
import { LoginCredentials } from './LoginCredentials';

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [isInitialized, setInitialized] = useState(false);
  useEffect(() => {
    AmaniSDK.sharedInstance
      .initAmani({
        server: LoginCredentials.serverURL,
        idCardNumber: LoginCredentials.idCardNumber,
        customerToken:
          LoginCredentials.token,
        lang: 'tr',
        useLocation: true,
        apiVersion: 'v2',
      })
      .then((initState) => setInitialized(initState))
      .catch(() => setInitialized(false));

    let unregisterHandle = AmaniSDK.sharedInstance.setDelegate({
      onError: (type, body) => {
        console.log({ type, body });
      },
      onProfileStatus: (body) => console.log(body),
      onStepModel: (body) => console.log(body),
    });
    return () => {
      unregisterHandle();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        Hello from Amani React Native SDK Example!
      </Text>
      {isInitialized ? (
        <View>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('AutoSelfieScreen')}
          >
            <Text style={styles.button$text}>Auto Selfie</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('DocumentCapture')}
          >
            <Text style={styles.button$text}>Document Capture</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('SelfieScreen')}
          >
            <Text style={styles.button$text}>Manual Selfie</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('IDCaptureScreen')}
          >
            <Text style={styles.button$text}>Id Capture</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('PoseEstimationScreen')}
          >
            <Text style={styles.button$text}>Pose Estimation Selfie</Text>
          </Pressable>
          {Platform.OS === 'android' ? (
            <Pressable
              style={styles.button}
              onPress={() => navigation.navigate('AndroidNFCScreen')}
            >
              <Text style={styles.button$text}>Android NFC Capture</Text>
            </Pressable>
          ) : (
            <></>
          )}
        </View>
      ) : (
        <Text style={styles.desc}>Failed to initialize the AmaniSDK</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    color: '#000',
    textAlign: 'center',
  },
  desc: {
    color: '#000',
    fontSize: 16,
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
