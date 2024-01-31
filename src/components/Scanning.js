import React from "react";
import { View, Image, Text } from "react-native";
import scan from "./../../assets/scan.gif";

function Scanning({text}) {
  return (
    <View
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        display: "flex",
        position: "absolute",
        zIndex: 999,
        height: "105%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image source={scan}></Image>
      <Text style={{ color: "white", fontWeight: 600, fontSize: 20 }}>
        {text}
      </Text>
    </View>
  );
}

export default Scanning;