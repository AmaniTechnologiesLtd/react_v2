import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { AmaniSDK } from 'react-native-amani-sdk';

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [isInitialized, setInitialized] = useState(false);
  useEffect(() => {
    AmaniSDK.sharedInstance
      .initAmani({
        server: 'https://dev.amani.ai',
        idCardNumber: '38203450858-r3',
        customerToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk4MDU3ODY3LCJpYXQiOjE2OTc0NTMwNjcsImp0aSI6IjY1ZjJjNGFkMTQ0ZjQxOTFiMDA5YWMwOWZlNmFjYWI1IiwidXNlcl9pZCI6IjA5YmZhOWM2LWZhYmMtNDYwNy1iMDM3LTc5NWQ1N2UzNGNjYyIsImNvbXBhbnlfaWQiOiJmMDNkNWYzNC1mOGJmLTRlMzUtYmE1OC1jNjIxYzI2YzYyZmQiLCJwcm9maWxlX2lkIjoiMDY5ZmIyYjUtMjRiOS00MzY0LTllMWEtYmFlOTY3NzJmMTQ4IiwiYXBpX3VzZXIiOmZhbHNlfQ._2wD2lZgkgVRordvUJrfVqGit-v70QUCH2Q38qc7Rw8',
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
