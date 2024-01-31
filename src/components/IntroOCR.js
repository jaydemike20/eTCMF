import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import OCRImage from "./../../assets/OCR_Image.png";
import ConstButton from "./ConstButton";

function IntroOCR({ navigation }) {
  const handleOCRSreen = () => {
    navigation.navigate("CameraScanOCR");
  };

  const handleORScreen = () => {
    navigation.navigate("CameraScanOR")
  }

  return (
    <View
      style={{
        padding: 1,
        backgroundColor: "white",
        height: "100%",
        alignItems: "center",
      }}
    >
      <View>
        <Text style={styles.title}>eTCMF</Text>
        <Text style={styles.title}>Car Verification</Text>
      </View>
      <View>
        <Text style={styles.subtitle}>
          The Car Registration will be converted into text
        </Text>
        <Text style={styles.subtitle}>
          Please place the document in the frame as clear as possible
        </Text>
      </View>
      <View style={styles.id}>
        <Image
          style={{ marginTop: 100, width: 225, height: 280 }}
          source={OCRImage}
        ></Image>
      </View>
      <View
        style={{
          display: "flex",
          marginTop: "80%",
        }}
      >
      <Text style={[styles.subtitlebottom, { marginTop: 25 }]}> 
          Every Driver will get the same experience
        </Text>
        <Text style={styles.subtitlebottom}>
          The information will be encrypted and secured
        </Text>
      </View>
      <View style={{ flexDirection: 'row', width: '40%', position: 'absolute', bottom: 1, left: 30 }}>
        <ConstButton
          onPress={handleORScreen}
          title={'SCAN OR'}
          marginLeftText={10}
          height={60}
          flex={1} // Adjust the flex property as needed
        ></ConstButton>
    </View>
    <View style={{ flexDirection: 'row', width: '40%', position: 'absolute', bottom: 1, left: 190 }}>
        <ConstButton
          onPress={handleOCRSreen}
          title={'SCAN CR'}
          marginLeftText={10}
          height={60}
          flex={1} // Adjust the flex property as needed
        ></ConstButton>
    </View>
    </View>
  );
}

export default IntroOCR;

const styles = StyleSheet.create({
  title: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
    display: "flex",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "black",
    textAlign: "center",
  },
  subtitlebottom: {

    fontSize: 12,
    color: "black",
    textAlign: "center",
    bottom: 0,
  },
  id: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    zIndex: -1,
    width: "100%",
  },
});
