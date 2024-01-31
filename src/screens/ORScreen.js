import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import CameraScanOR from "../components/CameraOR";

function ORScreens(props) {
  return (
    <CameraScanOR
      style={styles.cardoutlineORCR}
      title="Place the OR/CR Card Here"
    ></CameraScanOR>
  );
}

export default ORScreens;

const styles = StyleSheet.create({
  cardoutlineORCR: {
    width: 346,
    height: 700,
    borderWidth: 3,
    borderRadius: 19,
    borderColor: "white",
    position: "absolute",
    zIndex: 1,
    top: "20%",
    left: "50%",
    marginLeft: -173,
    marginTop: -123,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
