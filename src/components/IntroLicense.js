import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import IDImahe from "./../../assets/id_pic.png/";
import ConstButton from "./ConstButton";

function IntroLicense({ navigation }) {
  const handleOCRSreen = () => {
    navigation.navigate("OCRScan");
  };

  return (
    <View
      style={{
        padding: 10,
        backgroundColor: "white",
        height: "100%",
        alignItems: "center",
      }}
    >
      <View>
        <Text style={styles.title}>eTCMF</Text>
        <Text style={styles.title}>Identity Verification</Text>
      </View>
      <View>
        <Text style={styles.subtitle}>
          The Driver’s License will be converted into text
        </Text>
        <Text style={styles.subtitle}>
          Please place the document in the frame as clear as possible
        </Text>
      </View>
      <View style={styles.id}>
        <Image
          style={{ marginTop: 170, width: 310, height: 210 }}
          source={IDImahe}
        ></Image>
      </View>
      <View
        style={{
          display: "flex",
          marginTop: "75%",
        }}
      >
        <Text style={styles.subtitlebottom}>
          Every Driver will get the same experience
        </Text>
        <Text style={styles.subtitlebottom}>
          The information will be encrypted and secured
        </Text>
      </View>
      <View style={{ width: "90%", marginTop: 10 }}>
        <ConstButton
          onPress={handleOCRSreen}
          title={"Start Identification"}
          marginLeftText={10}
          height={60}
        ></ConstButton>
      </View>
    </View>
  );
}

export default IntroLicense;

const styles = StyleSheet.create({
  title: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
    display: "flex",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "black",
    textAlign: "center",
  },
  subtitlebottom: {
    fontSize: 13,
    color: "black",
    textAlign: "center",
    bottom: 0,
  },
  id: {
    display: "flex",
    alignItems: "center",
    marginTop: -30,
    position: "absolute",
    zIndex: -1,
    width: "100%",
  },
});
