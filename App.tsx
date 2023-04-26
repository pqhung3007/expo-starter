import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { captureRef } from "react-native-view-shot";

import Button from "./components/Button";
import CircleButton from "./components/CircleButton";
import EmojiList from "./components/EmojiList";
import EmojiPicker from "./components/EmojiPicker";
import EmojiSticker from "./components/EmojiSticker";
import IconButton from "./components/IconButton";
import ImageViewer from "./components/ImageViewer";

const PlaceholderImage = require("./assets/images/background-image.png");

export default function App() {
  // request permission to access media library
  const [status, requestPermission] = MediaLibrary.usePermissions();
  if (status === null) {
    requestPermission();
  }

  const imageRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowOptions(true);
    } else {
      console.log("You did not select any image.");
    }
  };

  const handleReset = () => {
    setShowOptions(false);
  };

  const handleAddSticker = () => {
    setIsModalVisible(true);
  };

  const handleSaveImageAsync = async () => {
    try {
      const localUrl = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUrl);
      if (localUrl) {
        alert("Save image successfully!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer
            placeholderImageSource={PlaceholderImage}
            selectedImage={selectedImage}
          />
          {pickedEmoji ? (
            <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
          ) : null}
        </View>
      </View>

      {showOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={handleReset} />
            <CircleButton onPress={handleAddSticker} />
            <IconButton
              icon="save-alt"
              label="Save"
              onPress={handleSaveImageAsync}
            />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button
            theme="primary"
            label="Choose a photo"
            onPress={pickImageAsync}
          />
          <Button label="Use this photo" onPress={() => setShowOptions(true)} />
        </View>
      )}

      <EmojiPicker isVisible={isModalVisible} onClose={handleCloseModal}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={handleCloseModal} />
      </EmojiPicker>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
  },
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
