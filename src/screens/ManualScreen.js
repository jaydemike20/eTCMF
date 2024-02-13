import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  TextInput,
  ScrollView,
  Keyboard,
  Alert,
} from "react-native";
import KeyboardWithoutWrapper from "../components/KeyboardWithoutWrapper";
import ConstInput from "../components/ConstInput";
import ConstButton from "../components/ConstButton";
import moment from "moment";
import Confirm from "./ConfirmScreen";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Octicons";
import Search from "react-native-vector-icons/EvilIcons";
import Ant from "react-native-vector-icons/AntDesign";
import Light from "react-native-vector-icons/FontAwesome5";
import Circle from "react-native-vector-icons/Entypo";
import MapLocation from "../components/MapLocation";
import * as Location from "expo-location";
import * as Permissions from 'expo-permissions';
import ColorSelector from "../components/ColorSelector";
import ViolationCheck from "../components/ViolationCheck";
import violationData from "./../components/ViolationList.json";
import { useTheme } from "react-native-paper";
import PreviewComponent from "../components/PreviewComponent";
import axios from "../../plugins/axios";
import {
  setAddress,
  setBirthDate,
  setDriverClassification,
  setDriverID,
  setDriverRegisterd,
  setFirstName,
  setGetFinalDriver,
  setLastName,
  setLicenseNumber,
  setMiddleInitial,
  setNationality,
  setEmptyFinalDriver,
  setDefaultDriverRegisterd,
  setEmptyRecognizedText,
} from "../components/camera/infoSlice";
import {
  setBodyMarkings,
  setColor,
  setFinalVehicle,
  setGetFinalVehicle,
  setIsCarRegistered,
  setMake,
  setManualDriverID,
  setOwnerAddress,
  setOwnerContactNumber,
  setOwnerName,
  setPlateNumber,
  setVehicleClass,
  setVehicleID,
  setVehicleModel,
  setdriverID,
  setEmptyFinalVehicle,
  setEmptyextractedInfo,
  setDefaultCarRegistered,
} from "../components/camera/infoSliceCOR";
import { setTicketInfo } from "../components/camera/ticketSlice";
import ConstDrop from "../components/ConstDrop";
import DatePick from "../components/DatePick";
import Scanning from "../components/Scanning";


function ManualScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const Token = useSelector((state) => state.auth.token);
  const isOnline = useSelector((state) => state.auth.Online);
  const data = [
    { key: "SP", value: "Student-Permit" },
    { key: "P", value: "Professional" },
    { key: "NP", value: "Non-Professional" },
  ];
  const [scanning, setScanning] = useState(false);
  const [scanning1, setScanning1] = useState(false);
  const [scanning2, setScanning2] = useState(false);
  const [scanning3, setScanning3] = useState(false);
  const [scanning4, setScanning4] = useState(false);



  const [cat1, setCat1] = useState(true);
  const [cat2, setCat2] = useState(true);
  const [cat3, setCat3] = useState(true);
  const [cat4, setCat4] = useState(true);
  const [cat5, setCat5] = useState(true);
  const [location, setLocation] = useState("");
  const [selectedPin, setSelectedPin] = useState("");
  const [locationObtained, setLocationObtained] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [mfrtaTctNo, setMfrtaTctNo] = useState("");
  const [currentTime, setCurrentTime] = useState(moment().format("hh:mm A"));
  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));
  const [showMap, setShowMap] = useState(true);
  const [form, setForm] = useState(false);
  const [isAtLeastOneChecked, setIsAtLeastOneChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [violation, setViolation] = useState(false);
  const [checkedViolations, setCheckedViolations] = useState([]);
  const [preview, setPreview] = useState(false);
  const [selected, setSelected] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [driver_IDs, setdriver_IDs] = useState('')

  const handleDateChange = (date) => {
    setSelectedDate(date); // Set the selected date in the state
    const formattedDate = date.toISOString().split("T")[0].replace(/-/g, "/");
    dispatch(setBirthDate(formattedDate));
  };

  const driver = useSelector((state) => state.infoText);
  const vehicle = useSelector((state) => state.infoTextOCR);
  const user = useSelector((state) => state.auth.enforcer);

  const [violationIDs, setViolationIDs] = useState({
    violation_id: [],
  });

  // datas
  const ocrText = useSelector((state) => state.infoText.finalDriver);
  const ocrTextOCR = useSelector((state) => state.infoTextOCR.finalVehicle);

  const scrollViewRef = useRef(null);

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  // mao ning violations
  const [violationData1, setViolationData1] = useState([]);

  useEffect(() => {
    axios
      .get("ticket/violation/", {
        headers: {
          Authorization: `token ${Token}`,
        },
      })
      .then((response) => {
        // Filter out only the active penalties
        const activePenalties = response.data.filter(
          (item) => item.penalty_info.status === "Active"
        );

        setViolationData1(activePenalties);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [Token]);

  const filteredData = violationData1.filter((item) =>
    item.violation_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchTime = () => {
      const currentTimeFormatted = moment().format("hh:mm A");
      setCurrentTime(currentTimeFormatted);
    };

    const fetchDate = () => {
      const currentDateFormatted = moment().format("YYYY-MM-DD");
      setCurrentDate(currentDateFormatted);
    };

    fetchTime();
    fetchDate();
  }, []);

  const handleCheckboxChange = (text, isChecked, ids) => {
    if (isChecked) {
      setCheckedViolations((prev) => [...prev, text]);
      setViolationIDs((prevState) => ({
        violation_id: [...prevState.violation_id, ids],
      }));

      console.log(violationIDs);
    } else {
      setCheckedViolations((prev) =>
        prev.filter((violation) => violation !== text)
      );

      setViolationIDs((prevState) => ({
        violation_id: prevState.violation_id.filter((id) => id !== ids),
      }));
    }
  };

  const handleMapPress = async (e) => {
    try {
      const newPin = {
        coordinate: e.nativeEvent.coordinate,
        address: await getAddressFromCoordinates(e.nativeEvent.coordinate),
      };
      setSelectedPin(newPin);
      setLocationObtained(true);
      onUpdateLocation(e.nativeEvent.coordinate);
    } catch (error) {
      console.error("Error handling map press:", error);
    }
  };

  const getLocation = async () => {
    try {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      
      if (status !== "granted") {
        console.error("Location permission denied");
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });

      // Call your reverse geocoding function here
      reverseGeocode(coords.latitude, coords.longitude);
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };


  const reverseGeocode = async (latitude, longitude) => {
    try {
      let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
  
      if (addressResponse && addressResponse.length > 0) {
        const { name, street, region, city, postalCode, country } = addressResponse[0];
  
        // Build the formatted address
        const formattedAddress = `${name || ""} ${street || ""} ${city || ""}, ${region || ""}, ${country || ""}, ${postalCode || ""}`;

        const newPin = {
          coordinate: { latitude, longitude },
          address: formattedAddress,
        };
  
        // Set the new pin to the state variable
        setSelectedPin(newPin);
        console.log(formattedAddress);
  
        // Return the formatted address
        return formattedAddress;  
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  
    return "Address not found";
  };

  

  const getAddressFromCoordinates = async (coordinate) => {
    try {
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });

      if (addressResponse && addressResponse.length > 0) {
        const { name, street, region, city, postalCode, country } =
          addressResponse[0];
        return `${name || ""} ${street || ""}, ${region || ""}, ${
          city || ""
        }, ${postalCode || ""}, ${country || ""}`;
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
    return "Address not found";
  };

  useEffect(() => {
    getLocation();


    if (location) {
      getAddressFromCoordinates(location)
        .then((currentAddress) => {
          setCurrentAddress(currentAddress);
          setSelectedPin(currentAddress)
        })
        .catch((error) => {
          console.error('Error getting address from coordinates:', error);
        });
    }
  }, [location]);

  useEffect(() => {
    setIsAtLeastOneChecked(checkedViolations.length > 0);
  }, [checkedViolations]);


  const handleReset = () => {
    dispatch(setEmptyFinalDriver());
    dispatch(setEmptyextractedInfo());
    dispatch(setEmptyFinalVehicle());
    dispatch(setEmptyRecognizedText());
  }

  // final screen
  const handleTicket = () => {
    Alert.alert(
      "Confirmation",
      "Once you click 'Yes', you will be unable to make any further changes as you have already reviewed and confirmed that all fields are correct.",
      [
        {
          text: "No, Continue Editing",
          onPress: () => {
            // If the user clicks 'No', you can perform any additional actions or simply return
            return;
          },
          style: "cancel",
        },
        {
          text: "Yes, Proceed",
          onPress: () => {
            setScanning(true);
            const isDriverExist = driver.isDriverRegisterd;
            const isVehicleExist = vehicle.isCarRegistered;

            // if both not exist
            if (!isDriverExist && !isVehicleExist) {
              setScanning(false);
              setScanning1(true)
              const drivers = driver.finalDriver;
              const vehicles = vehicle.finalVehicle;

              axios.post(`drivers/register/`, drivers, {
                  headers: {
                    Authorization: `token ${Token}`,
                  },
                })
                .then((response) => {
                  const id = response.data.id;
                  const idString = id ? id.toString() : ""; // Convert to string, or use an empty string if undefined
                  console.log("Driver ID:", idString);

                  dispatch(setDriverID(idString));
                  // dispatch(setDriverRegisterd());
                  dispatch(setManualDriverID(idString));

                  const requestData = {
                    driverID: idString,
                    name: vehicles.name,
                    address: vehicles.address,
                    contact_number: vehicles.contact_number,
                    plate_number: vehicles.plate_number,
                    make: vehicles.make,
                    color: vehicles.color,
                    vehicle_class: vehicles.vehicle_class,
                    body_markings: vehicles.body_markings,
                    vehicle_model: vehicles.vehicle_model,
                  };

                  setScanning1(false)
                  setScanning2(true)

                  axios.post(`vehicles/register/`, requestData, {
                      headers: {
                        Authorization: `token ${Token}`,
                      },
                    })
                    .then((response) => {
                      const id = response.data.id;
                      dispatch(setVehicleID(id));
                      // dispatch(setIsCarRegistered());

                      // console.log(vehicles);
                      setScanning2(false)
                      setScanning3(true)

                      // traffic ticket 
                      const driverID = idString;
                      const vehicleID = id;

                    // first post the traffic violation
                    axios.post("ticket/trafficviolation/", violationIDs, {
                        headers: {
                          Authorization: `token ${Token}`,
                        },
                      })
                      .then((response) => {
                        // traffic violation id
                        const traffic_violationID = response.data.id;
                        setTrafficViolationID(trafficViolationID);
                        // console.log(response.data);
                        setScanning3(false)
                        setScanning4(true)

                        const formData = {
                          vehicle: vehicleID,
                          driver_ID: driverID,
                          violations: traffic_violationID,
                          place_violation: selectedPin.address,
                          ticket_status: "PENDING",
                        };

                        axios.post("ticket/register/", JSON.stringify(formData), {
                            headers: {
                              Authorization: `token ${Token}`,
                            },
                          })
                          .then((response) => {
                            setScanning4(false);
                            dispatch(setTicketInfo(response.data));
                            navigation.navigate("TicketScreen");
                          })
                          .catch((error) => {
                            setScanning4(false);
                            alert("Failed Citation")
                          });
                      })
                      .catch((error) => {
                        setScanning3(false);
                        alert("Failed Selecting Violation")
                      });

                    })
                    .catch((error) => {
                      setScanning2(false);
                      console.log("Error for Vehicle");
                      console.log(error);
                      console.log(requestData);
                      alert("Please do check the Vehicle Info!!");
                    });
                })
                .catch((error) => {
                  setScanning1(false);
                  console.log("Error for Drivers");
                  console.log(error);
                  console.log(drivers);
                  alert("Please do check the Driver License Info!!");
                });
            }

            // If driver exists but vehicle is not
            if (isDriverExist && !isVehicleExist) {
              const id = driver.finalDriver.id;
              const idString = id ? id.toString() : ""; // Convert to string, or use an empty string if undefined

              const driverData = {
                driverID: idString,
                license_number: ocrText.license_number,
                first_name: ocrText.first_name,
                middle_initial: ocrText.middle_initial,
                last_name: ocrText.last_name,
                address: ocrText.address,
                birthdate: ocrText.birthdate,
                nationality: ocrText.nationality,
                classification: ocrText.classification
              };
              setScanning(false)
              setScanning1(true)
              axios.patch(`drivers/register/${id}/`, driverData, {
                headers: {
                  Authorization: `token ${Token}`
                }
              }).then((response) => {

                const vehicles = vehicle.finalVehicle;

                const requestData = {
                  driverID: idString,
                  name: vehicles.name,
                  address: vehicles.address,
                  contact_number: vehicles.contact_number,
                  plate_number: vehicles.plate_number,
                  make: vehicles.make,
                  color: vehicles.color,
                  vehicle_class: vehicles.vehicle_class,
                  body_markings: vehicles.body_markings,
                  vehicle_model: vehicles.vehicle_model,
                };
                setScanning1(false)
                setScanning2(true)
                axios.post(`vehicles/register/`, requestData, {
                  headers: {
                    Authorization: `token ${Token}`,
                  },
                })
                .then((response) => {

                  const id = response.data.id;
                  dispatch(setVehicleID(id));
                  // dispatch(setIsCarRegistered());

                  // console.log(vehicles);
                  // alert("Successfully Register Vehicle");

                  // traffic violation

                  const driverID = driver.id;
                  const vehicleIDs = id;
                  setScanning2(false)
                  setScanning3(true)
                  // first post the traffic violation
                  axios
                    .post("ticket/trafficviolation/", violationIDs, {
                      headers: {
                        Authorization: `token ${Token}`,
                      },
                    })
                    .then((response) => {
                      // traffic violation id

                      const traffic_violationID = response.data.id;
                      setTrafficViolationID(trafficViolationID);
                      console.log(response.data);
              
                      const formData = {
                        vehicle: vehicleIDs,
                        driver_ID: driverID,
                        violations: traffic_violationID,
                        place_violation: selectedPin.address,
                        ticket_status: "PENDING",
                      };

                      axios
                        .post("ticket/register/", JSON.stringify(formData), {
                          headers: {
                            Authorization: `token ${Token}`,
                          },
                        })
                        .then((response) => {
                          alert("Successfully Cited");
                          dispatch(setTicketInfo(response.data));
                          navigation.navigate("TicketScreen");
                          setScanning4(false)
                        })
                        .catch((error) => {
                          alert("Error Registering Ticket")
                          console.log(formData);
                          setScanning4(false)
                        });
                        setScanning3(false)
                        setScanning4(true)
                    })
                    .catch((error) => {
                      console.log(error);
                      scanning3(false)
                    });
                })
                .catch((error) => {
                  console.log("Error for Vehicle");
                  console.log(error);
                  console.log(requestData);
                  alert("Please do check the ORCR Info!!");
                  scanning2(false)
                });
              }).catch((error) => {
                alert("Error Updating Data")
                scanning1(false)
              })
            }

            // if driver not exist but vehicle exists
            if (!isDriverExist && isVehicleExist) {
              setScanning(false)
              setScanning1(true)
              const drivers = driver.finalDriver;
              // console.log(drivers);

              const vehicles = vehicle.finalVehicle;
              // console.log(vehicles);

              axios.post(`drivers/register/`, drivers, {
                  headers: {
                    Authorization: `token ${Token}`,
                  },
                })
                .then((response) => {
                  setScanning1(false);
                  setScanning2(true)

                  const id = response.data.id;
                  const idString = id ? id.toString() : ""; // Convert to string, or use an empty string if undefined
                  console.log("Driver ID:", idString);

                  dispatch(setDriverID(idString));
                  
                  // dispatch(setDriverRegisterd());
                  dispatch(setManualDriverID(idString));

                  const requestData = {
                    driverID: idString,
                    name: vehicles.name,
                    address: vehicles.address,
                    contact_number: vehicles.contact_number,
                    plate_number: vehicles.plate_number,
                    make: vehicles.make,
                    color: vehicles.color,
                    vehicle_class: vehicles.vehicle_class,
                    body_markings: vehicles.body_markings,
                    vehicle_model: vehicles.vehicle_model,
                  };
                  // alert("Successfully Register Driver");

                  axios.post(`vehicles/register/`, requestData, {
                      headers: {
                        Authorization: `token ${Token}`,
                      },
                    })
                    .then((response) => {
                      setScanning2(false)
                      setScanning3(true)
                      const id = response.data.id;
                      dispatch(setVehicleID(id));
                      // dispatch(setIsCarRegistered());

                      // console.log(vehicles);

                      // traffic violation
                      const vehicleID = vehicle.id;
                  
                      // first post the traffic violation
                      axios.post("ticket/trafficviolation/", violationIDs, {
                          headers: {
                            Authorization: `token ${Token}`,
                          },
                        })
                        .then((response) => {
                          setScanning3(false)
                          setScanning4(true)
                          // traffic violation id
                          const traffic_violationID = response.data.id;
                          setTrafficViolationID(trafficViolationID);
                          console.log(response.data);
                  
                          const formData = {
                            vehicle: vehicleID,
                            driver_ID: idString,
                            violations: traffic_violationID,
                            place_violation: selectedPin.address,
                            ticket_status: "PENDING",
                          };
                  
                          axios.post("ticket/register/", JSON.stringify(formData), {
                              headers: {
                                Authorization: `token ${Token}`,
                              },
                            })
                            .then((response) => {
                              alert("Successfully Cited");
                              dispatch(setTicketInfo(response.data));
                              navigation.navigate("TicketScreen");
                              setScanning4(false);
                            })
                            .catch((error) => {
                              console.log(error);
                              console.log(formData);
                              setScanning4(false);

                            });
                        })
                        .catch((error) => {
                          console.log(error);
                          setScanning3(false);

                        });              

                    })
                    .catch((error) => {
                      console.log("Error for Vehicle");
                      console.log(error);
                      console.log(requestData);
                      alert("Please do check the ORCR Info!!");
                      setScanning2(false);
                    });
                })
                .catch((error) => {
                  console.log("Error for Drivers");
                  console.log(error);
                  console.log(drivers);
                  alert("Please do check the Driver License Info!!");
                  setScanning1(false);
                });
            }

            if (isVehicleExist && isDriverExist) {
              setScanning(false)
              setScanning1(true)
              const drivers_ID = driver.id;
          
              const driverData = {
                driverID: drivers_ID,
                license_number: ocrText.license_number,
                first_name: ocrText.first_name,
                middle_initial: ocrText.middle_initial,
                last_name: ocrText.last_name,
                address: ocrText.address,
                birthdate: ocrText.birthdate,
                nationality: ocrText.nationality,
                classification: ocrText.classification
              };

              axios.patch(`drivers/register/${drivers_ID}/`, driverData, {
                headers: {
                  Authorization: `token ${Token}`
                }
              }).then((response) => {
                const driverIDD = response.data.id
                const vehicleID = vehicle.id;

                const requestData = {
                  id: vehicleID,
                  driverID: driverIDD,
                  name: vehicles.name,
                  address: vehicles.address,
                  contact_number: vehicles.contact_number,
                  plate_number: vehicles.plate_number,
                  make: vehicles.make,
                  color: vehicles.color,
                  vehicle_class: vehicles.vehicle_class,
                  body_markings: vehicles.body_markings,
                  vehicle_model: vehicles.vehicle_model,
                };
                setScanning1(false)
                setScanning2(true)

                axios.patch(`vehicles/register/${vehicleID}/`, requestData, {
                  headers: {
                    Authorization: `token ${Token}`
                  }
                }).then((response) => {
                  
                  setScanning2(false)
                  setScanning3(true)
                  axios.post("ticket/trafficviolation/", violationIDs, {
                    headers: {
                      Authorization: `token ${Token}`,
                    },
                  })
                  .then((response) => {
                    // traffic violation id
                    const traffic_violationID = response.data.id;
                    setTrafficViolationID(trafficViolationID);
                    console.log(response.data);
            
                    const formData = {
                      vehicle: vehicleID,
                      driver_ID: drivers_ID,
                      violations: traffic_violationID,
                      place_violation: selectedPin.address,
                      ticket_status: "PENDING",
                    };
 
                    setScanning3(false)
                    setScanning4(true)
                    axios
                      .post("ticket/register/", JSON.stringify(formData), {
                        headers: {
                          Authorization: `token ${Token}`,
                        },
                      })
                      .then((response) => {
                        alert("Successfully Cited");
                        dispatch(setTicketInfo(response.data));
                        dispatch(setEmptyFinalDriver());
                        dispatch(setEmptyFinalVehicle());
                        dispatch(setEmptyextractedInfo()); 
                        navigation.navigate("TicketScreen");
                        setScanning4(false)

                      })
                      .catch((error) => {
                        console.log(error);
                        console.log(formData);
                        alert("Error Citing Ticket")
                        setScanning4(false)
                      });
                  })
                  .catch((error) => {
                    alert("Error Selecting Violation")
                    setScanning3(false)
                  });
                }).catch((error) => {
                  alert("Error Updating Vehicles")
                  setScanning2(false)
                })



              }).catch((error) => {
                alert("Error Updating Drivers Info")
                setScanning1(false)
              })

            }
          },
        },
      ]
    );
  };

  const handleNextButton = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
    scrollToTop(); // Scroll to the top
    setViolation(!violation);
  };

  // for ticket
  const [trafficViolationID, setTrafficViolationID] = useState("");

  const handlePreviewTicket = () => {
    setPreview(!preview);
    setViolation(!violation);
    Keyboard.dismiss();
    scrollToTop();
  };

  // FOR MANUAL  ENTRY
  // registered driver
  const [drivers, getDrivers] = useState([]);

  useEffect(() => {
    axios
      .get("drivers/register/", {
        headers: {
          Authorization: `token ${Token}`,
        },
      })
      .then((response) => {
        getDrivers(response.data);
      })
      .catch((error) => {
        console.log(`Error Fetch Driver's Data: ${error}`);
      });
  }, []);

  const [vehicles, getVehicles] = useState([]);
  // registered vehicle

  useEffect(() => {
    axios
      .get("vehicles/register/", {
        headers: {
          Authorization: `token ${Token}`,
        },
      })
      .then((response) => {
        getVehicles(response.data);
      })
      .catch((error) => {
        console.log("error dong");
      });
  }, []);

  const handleWithoutDriverLicense = () => {
    navigation.navigate('Without Driver License')
  }

  return (
    <View style={styles.container}>
          {scanning ? <Scanning text="Setting up..."></Scanning> : null}
          {scanning1 ? <Scanning text="Processing Driver..."></Scanning> : null}
          {scanning2 ? <Scanning text="Processing Vehicle..."></Scanning> : null}
          {scanning3 ? <Scanning text="Processing Violations..."></Scanning> : null}
          {scanning4 ? <Scanning text="Processing Ticket..."></Scanning> : null}
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}
      >
        <KeyboardWithoutWrapper>
          <View
            style={{
              width: "100%",
              height: '100%',
              marginTop: 7,
              height: "auto",
            }}
          >
            


            {violation ? (
              <>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 15,
                  }}
                  onPress={() => setViolation(!violation)}
                >
                  <Ant size={30} name="leftcircleo"></Ant>
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginLeft: 20,
                      fontSize: 20,
                      color: "green",
                    }}
                  >
                    BACK
                  </Text>
                </TouchableOpacity>
                <View style={{}}>
                  <View style={{ padding: 20 }}>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: 600,
                      }}
                    >
                      You are hereby cited for committing traffic violation/s as
                      indicated hereunder
                    </Text>
                  </View>
                </View>
                <View // SEARCH BAR AND SORTS
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "5%",
                  }}
                >
                  <Search
                    style={{
                      fontSize: 30,
                      position: "absolute",
                      left: 45,
                      top: 5,
                    }}
                    name="search"
                  ></Search>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderRadius: 20,
                      fontSize: 15,
                      padding: 5,
                      paddingLeft: 40,
                      width: "80%",
                    }}
                    onChangeText={(text) => setSearchQuery(text)}
                    placeholder="search violation"
                  />
                  {/* <View style={{ width: 40, height: 40, marginLeft: 10 }}>
                    <TouchableOpacity onPress={toggleSortIcon}>
                      <Icon
                        name={sortAsc ? "sort-asc" : "sort-desc"}
                        size={30}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View> */}
                  
                </View>
                <View style={{ padding: 20 }}>
                  <Text style={styles.subtitle}>
                    Please fill out the relevant information in each section
                  </Text>
                  <Text style={styles.subtitle}>
                    Fields marked with * are mandatory
                  </Text>
                </View>

                <View //========================================================CATEGORY 1
                >
                  {cat1 ? (
                    <View>
                      <View //BOX VIOLATION CONTAINER
                        style={{
                          width: "100%",
                          alignItems: "center",
                          marginBottom: 20,
                        }}
                      >
                        <View style={styles.box}>
                          {checkedViolations.length > 0 ? (
                            checkedViolations.map((checkedViolation, index) => (
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  marginLeft: 20,
                                  marginTop: 10,
                                }}
                                key={index}
                              >
                                <Circle
                                  name="controller-record"
                                  style={{ marginRight: 10, fontSize: 6 }}
                                ></Circle>
                                <Text key={index}>{checkedViolation}</Text>
                              </View>
                            ))
                          ) : (
                            <View
                              style={{
                                alignItems: "center",
                                paddingVertical: 20,
                                justifyContent: "center",
                              }}
                            >
                              <Text>No selected violation...</Text>
                            </View>
                          )}
                        </View>
                      </View>

                      <View style={styles.category}>
                        <TouchableOpacity
                          style={styles.drop}
                          onPress={() => setCat1(!cat1)}
                        >
                          <Ant
                            name="filetext1"
                            style={[styles.icon, { color: "green" }]}
                          ></Ant>
                          <Text style={styles.textSelect}>
                            Licensing and Documentation
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <View style={styles.category}>
                        <TouchableOpacity
                          style={styles.drop}
                          onPress={() => setCat1(!cat1)}
                        >
                          <Ant
                            name="filetext1"
                            style={[styles.icon, { color: "black" }]}
                          ></Ant>
                          <Text style={{ color: "black" }}>
                            Licensing and Documentation
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
                <View //========================================================CATEGORY 2
                >
                  {cat2 ? (
                    <View>
                      <View style={styles.category}>
                        <TouchableOpacity
                          style={styles.drop}
                          onPress={() => setCat2(!cat2)}
                        >
                          <Light
                            name="traffic-light"
                            style={[styles.icon, { color: "green" }]}
                          ></Light>
                          <Text style={styles.textSelect}>
                            Traffic Rule Violations
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ marginLeft: 25, marginTop: 20 }}>
                        {/* violation area */}

                        {filteredData.map((item) => (
                          <ViolationCheck
                            key={item.id}
                            id={item.id}
                            text={item.violation_type}
                            isChecked={checkedViolations.includes(
                              item.violation_type
                            )}
                            handleCheckboxChange={(isChecked) =>
                              handleCheckboxChange(
                                item.violation_type,
                                isChecked,
                                item.id
                              )
                            }
                          />
                        ))}
                      </View>
                    </View>
                  ) : (
                    <View>
                      <View style={styles.category}>
                        <TouchableOpacity
                          style={styles.drop}
                          onPress={() => setCat2(!cat2)}
                        >
                          <Light
                            name="traffic-light"
                            style={styles.icon}
                          ></Light>
                          <Text>Traffic Rule Violations</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    marginTop: 40,
                    marginBottom: 40,
                  }}
                >
            
                  <View style={{ width: "70%", height: "100%" }}>
                    <ConstButton
                      title="Submit"
                      onPress={handleTicket}
                      height={50}
                    ></ConstButton>
                  </View>
                </View>
              </>
            ) : null}


            

            <View //========================================================CATEGORY 3
            >
              <View style={{ width: "100%" }}>
              <View style={{ paddingHorizontal: 10, }}>
                <ConstButton
                  title="Without Driver License"
                  onPress={handleWithoutDriverLicense}
                  height={50}
                ></ConstButton>               
              </View>

              </View>
              {cat3 ? (
                <View>
                  <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        marginRight: 80,
                        color: "grey",
                      }}
                    >
                      Please fill out the relevant information in each section
                    </Text>
                    <Text style={{ marginTop: 30, color: "grey" }}>
                      Fields marked with * are mandatory
                    </Text>
                  </View>
                  <View style={styles.category}>
                    <TouchableOpacity
                      style={styles.drop}
                      onPress={() => setCat3(!cat3)}
                    >
                      <Icon
                        name="check"
                        style={[styles.icon, { color: "green" }]}
                      ></Icon>
                      <Text style={styles.textSelect}>
                        Personal Information
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <View
                      style={{
                        width: "100%",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                    >
                      <View style={{ width: "90%" }}>
                        {/* <ConstInput
                          borderRadius={10}
                          height={40}
                          text={"MFRTA TCT No*"}
                          editable={false}
                          required
                          value={mfrtaTctNo}
                        ></ConstInput> */}
                        <ConstInput
                          borderRadius={10}
                          height={40}
                          text={"Driver's License Number*"}
                          value={ocrText.license_number}
                          onChangeText={(text) => {
                            dispatch(setLicenseNumber(text));

                            // CHECK IF THE DRIVER IS EXIST
                            const driverExists = drivers.find(
                              (driver) => driver.license_number === text
                            );

                            if (driverExists) {
                              if (
                                driverExists.license_number === text &&
                                driverExists.license_number != ""
                              ) {
                                alert(`Existing Driver: ${text}`);
                                const driverIDString =
                                  driverExists.id.toString();

                                dispatch(setDriverRegisterd());
                                setdriver_IDs(driverIDString)
                                dispatch(setDriverID(driverIDString));
                                dispatch(setdriverID(driverIDString));
                                dispatch(
                                  setGetFinalDriver({
                                    ...driverExists,
                                    license_number: driverExists.license_number,
                                    first_name: driverExists.first_name,
                                    middle_initial: driverExists.middle_initial,
                                    last_name: driverExists.last_name,
                                    address: driverExists.address,
                                    birthdate: driverExists.birthdate,
                                    nationality: driverExists.nationality,
                                    classification: driverExists.classification,
                                  })
                                );
                              } else if (driverExists.license_number === "") {
                                dispatch(setDefaultDriverRegisterd())
                                alert("No driver license");
                              } else {
                                dispatch(setDefaultDriverRegisterd())
                                alert(`New Driver: ${text}`);
                              }
                            }
                          }}
                          marginTop={25}
                          marginBottom={25}
                          required
                        ></ConstInput>
                        <ConstInput
                          autoCapitalize={"characters"}
                          borderRadius={10}
                          height={40}
                          value={ocrText.first_name}
                          onChangeText={(text) => {
                            dispatch(setFirstName(text));
                          }}
                          text="First Name"
                          required
                        ></ConstInput>
                        {/* make validation */}
                        <ConstInput
                          autoCapitalize={"characters"}
                          borderRadius={10}
                          height={40}
                          value={ocrText.middle_initial}
                          onChangeText={(text) => {
                            dispatch(setMiddleInitial(text));
                          }}
                          text="Middle Name"
                          required
                        ></ConstInput>
                        <ConstInput
                          autoCapitalize={"characters"}
                          borderRadius={10}
                          height={40}
                          value={ocrText.last_name}
                          text="Last Name"
                          onChangeText={(text) => {
                            dispatch(setLastName(text));
                          }}
                          required
                        ></ConstInput>
                        <ConstInput
                          autoCapitalize={"characters"}
                          borderRadius={10}
                          height={40}
                          text={"Address*"}
                          value={ocrText.address}
                          onChangeText={(text) => {
                            dispatch(setAddress(text));
                          }}
                          marginTop={25}
                          required
                          multiline={true}
                        ></ConstInput>
                        <ConstInput
                        borderRadius={10}
                        placeholder="YYYY/MM/DD/"
                        height={40}
                        value={
                            ocrText.birthdate ||
                            selectedDate.toISOString().split("T")[0].replace(/-/g, "/")
                        }
                        text={"Date of Birth*"}
                        type={"birthdate-day"}
                        onChangeText={(text) => {
                            dispatch(setBirthDate(text));
                        }}
                        marginTop={25}
                        required
                        editable={false}
                        />
                        <DatePick
                        onDateChange={handleDateChange}
                        value={selectedDate}
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            paddingHorizontal: 15,
                            marginTop: -37,
                        }}
                        />
                        <ConstInput
                          autoCapitalize={"characters"}
                          borderRadius={10}
                          height={40}
                          text={"Nationality*"}
                          value={ocrText.nationality}
                          onChangeText={(text) => {
                            dispatch(setNationality(text));
                          }}
                          marginTop={25}
                          required
                        ></ConstInput>

                        {/* if possible, selection ra sya */}
                        <ConstDrop
                          autoCapitalize={"characters"}
                          text={"Classification"}
                          setSelected={(val) => {
                            setSelected(val);
                            dispatch(setDriverClassification(val));
                            console.log(val);
                          }}
                          data={data}
                          save="key"
                          marginTop={25}
                          marginBottom={25}
                        ></ConstDrop>
                        {/*
                        <ConstInput
                          borderRadius={10}
                          height={40}
                          type={Number}
                          text={"Classification"}
                          value={ocrText.classification}
                          onChangeText={(text) => {
                            dispatch(setDriverClassification(text));
                          }}
                          marginTop={25}
                          marginBottom={25}
                          required
                        ></ConstInput>*/}
                        {/* if existing user there is button for edit of his/her info */}
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <View>
                  <View style={styles.category}>
                    <TouchableOpacity
                      style={styles.drop}
                      onPress={() => setCat3(!cat3)}
                    >
                      <Icon name="check" style={styles.icon}></Icon>
                      <Text>Personal Information</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            <View //========================================================CATEGORY 4
            >
              {cat4 ? (
                <View>
                  <View style={styles.category}>
                    <TouchableOpacity
                      style={styles.drop}
                      onPress={() => setCat4(!cat4)}
                    >
                      <Icon
                        name="check"
                        style={[styles.icon, { color: "green" }]}
                      ></Icon>
                      <Text style={styles.textSelect}>Vehicle Information</Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      alignItems: "center",
                      marginTop: 30,
                    }}
                  >
                    <View style={{ width: "90%" }}>
                      <ConstInput
                        autoCapitalize={"characters"}
                        borderRadius={10}
                        height={40}
                        text={"Plate Number*"}
                        value={ocrTextOCR.plate_number}
                        onChangeText={(text) => {
                          dispatch(setPlateNumber(text));

                          // Check if the driver exists
                          const vehicleExists = vehicles.find(
                            (vehicles) => vehicles.plate_number === text
                          );

                          if (vehicleExists) {
                            if (vehicleExists.plate_number === text && vehicleExists.driverID == driver.id) {
                              alert(`Existing Vehicle and  Registered Driver: ${text}`);
                              console.log(driver_IDs)
                              console.log(vehicleExists.driverID)

                              const vehicleID = vehicleExists.id;
                              const driverIDString =
                                vehicleExists.driverID.toString();
                              dispatch(setIsCarRegistered());
                              dispatch(setVehicleID(vehicleID));
                              dispatch(
                                setGetFinalVehicle({
                                  ...vehicleExists,
                                  name: vehicleExists.name,
                                  address: vehicleExists.address,
                                  contact_number: vehicleExists.contact_number,
                                  plate_number: vehicleExists.plate_number,
                                  make: vehicleExists.make,
                                  color: vehicleExists.color,
                                  vehicle_class: vehicleExists.vehicle_class,
                                  body_markings: vehicleExists.body_markings,
                                  vehicle_model: vehicleExists.vehicle_model,
                                  driverID: driverIDString,
                                })
                              );
                            } else if (vehicleExists.plate_number === text && vehicleExists.driverID != driver.id) {
                              alert(`Existing Vehicle But Different Driver: ${text}`);
                              dispatch(setDefaultCarRegistered())

                              const vehicleID = vehicleExists.id;
                              const driverIDString =
                                vehicleExists.driverID.toString();
                              dispatch(setVehicleID(vehicleID));
                              dispatch(
                                setGetFinalVehicle({
                                  ...vehicleExists,
                                  name: vehicleExists.name,
                                  address: vehicleExists.address,
                                  contact_number: vehicleExists.contact_number,
                                  plate_number: vehicleExists.plate_number,
                                  make: vehicleExists.make,
                                  color: vehicleExists.color,
                                  vehicle_class: vehicleExists.vehicle_class,
                                  body_markings: vehicleExists.body_markings,
                                  vehicle_model: vehicleExists.vehicle_model,
                                  driverID: driverIDString,
                                })
                              );
                            } else if (vehicleExists.plate_number === "") {
                              dispatch(setDefaultCarRegistered())
                              alert("No plate number")
                            }                          
                            else {
                              dispatch(setDefaultCarRegistered())
                              alert(`New Vehicle: ${text}`);
                              dispatch(setFinalVehicle());
                            }
                          } else {
                            dispatch(setDefaultCarRegistered())
                            dispatch(setPlateNumber(text));
                          }
                        }}
                        required
                      ></ConstInput>
                      <ConstInput
                        autoCapitalize={"characters"}
                        borderRadius={10}
                        height={40}
                        marginTop={25}
                        text={"Registered Owner*"}
                        value={ocrTextOCR.name}
                        onChangeText={(text) => {
                          dispatch(setOwnerName(text));
                        }}
                        required
                      ></ConstInput>
                      <ConstInput
                        autoCapitalize={"characters"}
                        borderRadius={10}
                        height={40}
                        text={"Owner Address"}
                        value={ocrTextOCR.address}
                        onChangeText={(text) => {
                          dispatch(setOwnerAddress(text));
                        }}
                        required
                      ></ConstInput>
                      <ConstInput
                        borderRadius={10}
                        height={40}
                        text={"Contact No.*"}
                        keyboardType={"number-pad"}
                        value={ocrTextOCR.contact_number}
                        onChangeText={(text) => {
                          dispatch(setOwnerContactNumber(text));
                        }}
                        required
                      ></ConstInput>
                      <ConstInput
                        autoCapitalize={"characters"}
                        borderRadius={10}
                        height={40}
                        text={"Make*"}
                        value={ocrTextOCR.make}
                        onChangeText={(text) => {
                          dispatch(setMake(text));
                        }}
                        required
                      ></ConstInput>
                      <ConstInput
                        autoCapitalize={"characters"}
                        borderRadius={10}
                        height={40}
                        value={ocrTextOCR.vehicle_class}
                        text={"Class*"}
                        onChangeText={(text) => {
                          dispatch(setVehicleClass(text));
                        }}
                        required
                      ></ConstInput>
                      <ConstInput
                        autoCapitalize={"characters"}
                        borderRadius={10}
                        height={40}
                        value={ocrTextOCR.vehicle_model}
                        text={"Model*"}
                        onChangeText={(text) => {
                          dispatch(setVehicleModel(text));
                        }}
                        required
                      ></ConstInput>
                      <ConstInput
                        autoCapitalize={"characters"}
                        borderRadius={10}
                        height={40}
                        value={ocrTextOCR.body_markings}
                        text={"Body Markings*"}
                        onChangeText={(text) => {
                          dispatch(setBodyMarkings(text));
                        }}
                        required
                      ></ConstInput>

                      <ConstInput
                        autoCapitalize={"characters"}
                        borderRadius={10}
                        height={40}
                        value={ocrTextOCR.color}
                        text={"Colors*"}
                        onChangeText={(text) => {
                          dispatch(setColor(text));
                        }}
                        required
                        marginBottom={25}
                      ></ConstInput>
                      <View>
                        {/* <Text
                          style={{
                            fontSize: 15,
                            color: "grey",
                            fontFamily: "Roboto-Light",
                            marginLeft: 7,
                            marginTop: 20,
                            marginBottom: -30,
                            fontWeight: "bold",
                          }}
                        >
                          Vehicle Color*
                        </Text> */}
                        {/* <ColorSelector value={ocrTextOCR.color}
                          onChangeText={(text) => {
                            dispatch(setColor(text));
                          }}                        
                        ></ColorSelector> */}
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <View>
                  <View style={styles.category}>
                    <TouchableOpacity
                      style={styles.drop}
                      onPress={() => setCat4(!cat4)}
                    >
                      <Icon name="check" style={styles.icon}></Icon>
                      <Text>Vehicle Information</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            <View //========================================================CATEGORY 5
            >
              {cat5 ? (
                <View>
                  <View style={styles.category}>
                    <TouchableOpacity
                      style={styles.drop}
                      onPress={() => setCat5(!cat5)}
                    >
                      <Icon
                        name="check"
                        style={[styles.icon, { color: "green" }]}
                      ></Icon>
                      <Text style={styles.textSelect}>
                        Violation Information
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      alignItems: "center",
                      marginTop: 30,
                    }}
                  >
                    <View style={{ width: "90%" }}>
                      {/* dili na need e butang */}
                      <ConstInput
                        autoCapitalize={"characters"}
                        borderRadius={10}
                        height={40}
                        text={"Ticket Status"}
                        value="PENDING"
                        editable={false}
                      ></ConstInput>
                      <ConstInput
                        borderRadius={10}
                        height={40}
                        text={"Time of Violation*"}
                        value={currentTime}
                        editable={false}
                        marginTop={25}
                        required
                      ></ConstInput>
                        <ConstInput
                          editable={locationObtained}
                          borderRadius={10}
                          height={40}
                          autoCapitalize={"characters"}
                          text={"Place of Violation*"}
                          marginTop={25}
                          marginBottom={25}
                          required
                          value={selectedPin ? selectedPin.address : ""}
                          onChangeText={(text) => {
                            setSelectedPin({
                              ...selectedPin,
                              address: text,
                            });
                          }}
                          multiline={true}
                        ></ConstInput>
                    </View>
                  </View>
                </View>
              ) : (
                <View>
                  <View style={styles.category}>
                    <TouchableOpacity
                      style={styles.drop}
                      onPress={() => setCat5(!cat5)}
                    >
                      <Icon name="check" style={styles.icon}></Icon>
                      <Text>Violation Information</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

            </View>


            <View
              style={{
                width: "100%",
                alignItems: "center",
                marginTop: 0,
                marginBottom: 40,
              }}
            >
              <View style={{ width: "70%", height: "100%" }}>
                <ConstButton
                  title="Next"
                  onPress={handleNextButton}
                  height={50}
                ></ConstButton>
                <ConstButton
                  title="Reset"
                  onPress={handleReset}
                  height={50}
                ></ConstButton>                
              </View>
            </View>



          </View>
        </KeyboardWithoutWrapper>
      </ScrollView>
    </View>
  );
}

export default ManualScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "grey",
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    paddingTop: 0,
  },
  category: {
    height: 50,
    width: "100%",
    backgroundColor: "#D0FFCC",
    borderWidth: 1,
    borderColor: "white",
    marginBottom: 1,
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 10,
  },
  drop: {
    flexDirection: "row",
  },
  box: {
    width: "90%",
    height: "auto",
    backgroundColor: "#D0FFCC",
    display: "flex",
    borderRadius: 10,
    paddingVertical: 10,
    paddingBottom: 20,
  },
  icon: {
    fontSize: 20,
    marginLeft: 20,
    marginRight: 50,
    color: "#787878",
  },
  textSelect: {
    color: "green",
    fontWeight: "bold",
  },
  subtitle: {
    color: "#7F7F7F",
  },
});
