import React, { useState, useEffect, Children } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import GradientBackground from "../../../components/GradientBG";
import { useFonts } from "expo-font";
import ConstInput from "../../../components/ConstInput";
import ConstInputVisible from "../../../components/ConstInputVisible";
import KeyboardWithoutWrapper from "../../../components/KeyboardWithoutWrapper";
import ConstButton from "../../../components/ConstButton";
import TextButton from "../../../components/TextButton";
import axios from "../../../../plugins/axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setEnforcerEmail,
  setEnforcerFirstName,
  setEnforcerID,
  setEnforcerLastName,
  setEnforcerMiddleName,
  setEnforcerPosition,
  setEnforcerProfilePicture,
  setEnforcerUsername,
  setLogin,
  setLogout,
  setOnline,
  setToken,
} from "../authSlice";
import NetInfo from "@react-native-community/netinfo";
import Scanning from "../../../components/Scanning";

function FirstScreen({ navigation }) {
  const dispatch = useDispatch();
  const [fontsLoaded] = useFonts({
    "Zen Dots Regular": require("./../../../../assets/fonts/ZenDots-Regular.ttf"),
  });
  const [showPassword, setShowPassword] = useState(true);
  const [textInputFocused, setTextInputFocused] = useState(false);
  const [animationValue] = useState(new Animated.Value(1));
  const [scanning, setScanning] = useState(false);

  const [credentials, setCredentials] = useState({
    username: "jayde",
    password: "2023@engracia",
  });
  // get the authSlice Online
  const internet = useSelector((state) => state.auth.Online)


  const unsubscribe = NetInfo.addEventListener((state) => {
    if (state.isConnected === false) {
      alert("Please Connect to the Internet")
    } else if (state.isConnected === true) {
      console.log("Connected");
      dispatch(setOnline());
      dispatch(setLogout());
    }
  }, [1]);

  useEffect(() => {
    unsubscribe();
  });


  const handleForgotPass = () => {
    navigation.navigate("ForgotPass");
  };


// mag himo og alert error

  const handleLogin =  () => {
    setScanning(true)

    axios.post('accounts/token/login/', credentials).then((response) => {
      const token = response.data.auth_token;

      dispatch(setToken(token));
  
      axios.get("accounts/users/me/", {
        headers: {
          Authorization: `token ${token}`,
        },
      }).then((response) => {

        const role = response.data.role;
        const last_name = response.data.last_name;
        const first_name = response.data.first_name;
        const middle_name = response.data.middle_name;
        const username = response.data.username;
        const id = response.data.id;
        const profile_picture = response.data.profile_picture;
        const email = response.data.email;
        const position = response.data.position;
  

        dispatch(setEnforcerEmail(email));
        dispatch(setEnforcerID(id));
        dispatch(setEnforcerUsername(username));
        dispatch(setEnforcerFirstName(first_name));
        dispatch(setEnforcerMiddleName(middle_name));
        dispatch(setEnforcerLastName(last_name));
        dispatch(setEnforcerProfilePicture(profile_picture));
        dispatch(setEnforcerPosition(position));

        if (role !== "ENFORCER") {
          setScanning(false)
          alert(`Sir/Maam ${last_name}, This app is for only ENFORCER; Your Role is ${role}`);
          setCredentials({
            username: "",
            password: "",
          });
        } else {
          dispatch(setLogin());
          setScanning(false)
        }
  

      }).catch((error) => {
        setScanning(false)
        alert("Error Feching User ")
      })
 
    }).catch((error) => {
      setScanning(false)
      console.error('Error during login:', error.message);
      if (error.response && error.response.status === 400) {
          alert('Invalid username or password. Please try again.');
      } else {
          // Handle other errors as needed
          alert('Server response status:', error.response ? error.response.status : 'N/A');
      }    
    })
    
  };
  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, []);



  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardWithoutWrapper>
      <View style={styles.container}>
      {scanning ? <Scanning text="Logging In...."></Scanning> : null}

        <View
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GradientBackground></GradientBackground>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              height: "100%",
              marginTop: "50%",
            }}
          >
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text
                  style={{
                    fontSize: 72,
                    fontWeight: "bold",
                    color: "#285712",
                  }}
                >
                  eTC
                </Text>
                <Text
                  style={{ fontSize: 72, fontWeight: "bold", color: "#61680C" }}
                >
                  MF
                </Text>
              </View>
              <Text style={{ marginTop: -15, color: "#353904" }}>
                e-Ticketing Citation Manolo Fortich
              </Text>
            </View>

            <View
              style={{
                width: "80%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ConstInput
                borderRadius={10}
                placeholder="username"
                value={credentials.username}
                onChangeText={(text) => {
                  setCredentials({
                    ...credentials,
                    username: text,
                  });
                }}
              ></ConstInput>
              <ConstInputVisible
                placeholder="password"
                value={credentials.password}
                onChangeText={(text) => {
                  setCredentials({
                    ...credentials,
                    password: text,
                  });
                }}
              ></ConstInputVisible>
              <TextButton onPress={handleForgotPass}></TextButton>
              <View style={{ width: "100%", marginTop: 20 }}>
                <ConstButton
                  height={60}
                  title="Login"
                  marginLeftText={-10}
                  onPress={handleLogin}
                  borderRadius={10}
                ></ConstButton>
              </View>
            </View>
          </View>
        </View>
      </View>
    </KeyboardWithoutWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    height: 900,
  },
});

export default FirstScreen;
