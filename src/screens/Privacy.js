import React, { useState } from "react";
import { Text, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import ConstInput from "../components/ConstInputVisible";
import ConstButton from "../components/ConstButton";
import KeyboardWithoutWrapper from "../components/KeyboardWithoutWrapper";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../plugins/axios";
import { useNavigation } from "@react-navigation/native";
import Scanning from '../components/Scanning'

function Privacy(props) {
  const dispatch = useDispatch();
  const [display, setDisplay] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [scanning, setScanning] = useState(false);

  const Token = useSelector((state) => state.auth.token);
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState({
    new_password: "",
    re_new_password: "",
    current_password: "",
  });

  const handleChangePassword = () => {
    setScanning(true)
    axios
      .post("accounts/users/set_password/", newPassword, {
        headers: {
          Authorization: `token ${Token}`,
        },
      })
      .then((response) => {
        setScanning(false)
        setResponseText("Your password has been updated");
        alert("Changed Password Successfully");
        setNewPassword({
          new_password: "",
          re_new_password: "",
          current_password: "",
        });
      })
      .catch((error) => {
        setScanning(false)
        alert("Error Changed Password");
        setResponseText("Your password hasn't been updated");
      });
  };

  return (
    <View
      style={{
        display: "flex",
        height: 800,
        width: "100%",
        backgroundColor: "white",
      }}
    >
                     {scanning ? <Scanning text="Changing Password..."></Scanning> : null}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10%",
              backgroundColor: "white",
            }}
          >

            <View style={{ marginBottom: 40 }}>
              {display ? (
                <>
                  <Text>{responseText}</Text>
                </>
              ) : null}

            </View>

            <View style={{ width: 290 }}>
              <ConstInput
                text={"Current Password"}
                placeholder="Current Password"
                value={newPassword.current_password}
                onChangeText={(text) => {
                  setNewPassword({
                    ...newPassword,
                    current_password: text,
                  });
                }}
                
              ></ConstInput>
              <ConstInput
                text={"New Password"}
                placeholder="New Password"
                value={newPassword.new_password}
                onChangeText={(text) => {
                  setNewPassword({
                    ...newPassword,
                    new_password: text,
                  });
                }}
              ></ConstInput>
              <ConstInput
                text={"Confirm New Password"}
                placeholder="Confirm New Password"
                value={newPassword.re_new_password}
                onChangeText={(text) => {
                  setNewPassword({
                    ...newPassword,
                    re_new_password: text,
                  });
                }}
              ></ConstInput>
            </View>
            <View style={{ width: "60%", marginTop: 50}}>
              <ConstButton
                onPress={handleChangePassword}
                height={50}
                title={"Save Changes"}
              ></ConstButton>
              
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default Privacy;
