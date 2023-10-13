import React from 'react';
import type { FC } from 'react';
import { Pressable, StyleSheet, View, Text, Image } from 'react-native';

interface PreviewComponentProps {
  imageData: string;
  onUploadPressed: () => void;
  onRetryPressed: () => void;
}

export const Preview: FC<PreviewComponentProps> = ({
  imageData,
  onUploadPressed,
  onRetryPressed,
}) => {
  console.log(imageData);
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageData }}
        resizeMode="cover"
        style={styles.image}
      />
      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={onUploadPressed}>
          <Text style={styles.button$text}>Upload</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onRetryPressed}>
          <Text style={styles.button$text}>Try Again</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 450,
    height: 200,
    borderWidth: 1,
    borderColor: 'black',
    resizeMode: 'contain',
    zIndex: 99,
  },
  buttons: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: -8,
  },
  button: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  button$text: {
    color: '#000',
  },
});
