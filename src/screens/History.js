import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button, PaperProvider, DataTable } from "react-native-paper";
import GradientBackground from "../components/GradientBG";
import KeyboardWithoutWrapper from "../components/KeyboardWithoutWrapper";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/Octicons";
import PreviewComponent from "../components/PreviewComponent";
import ConstButton from "../components/ConstButton";
import axios from "../../plugins/axios";
import { useDispatch, useSelector } from "react-redux";
import { setTicketInfo } from "../components/camera/ticketSlice";
import { BluetoothEscposPrinter } from 'react-native-bluetooth-escpos-printer';
import { setEmptyFinalDriver, setEmptyRecognizedText } from "../components/camera/infoSlice";
import { setEmptyFinalVehicle } from "../components/camera/infoSliceCOR";


function History({ navigation }) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);
  const [preview, setPreview] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  // search
  const [searchTerm, setSearchTerm] = useState("");
  const user = useSelector((state) => state.auth.enforcer)

  const toggleSortIcon = () => {
    setSortAsc(!sortAsc); // Toggle the state between true and false
  };
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };
  const Token = useSelector((state) => state.auth.token);
  const isOnline = useSelector((state) => state.auth.Online);

  const handleDetails = () => {
    navigation.navigate("RecordDetails");
  };

  // get all ticket
  const [ticket, getTicket] = useState([]);

  useEffect(() => {
    // Function to fetch data
    const fetchData = () => {
      axios
        .get("ticket/register/", {
          headers: {
            Authorization: `token ${Token}`,
          },
        })
        .then((response) => {
          getTicket(response.data);
        })
        .catch((error) => {
          alert("Failed to Fetch Tickets");
          navigation.navigate("HomeScreen");
        });
    };
  
    // Initial data fetch
    fetchData();
  
    // Set up interval to fetch data every 30 seconds
    const intervalId = setInterval(fetchData, 30000);
  
    // Clean up the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Add an empty dependency array to run only once on mount
  
  

  const ticketRedux = useSelector((state) => state.ticket.ticketInfo)

  async function handlePrint() {
  
    try {
      // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      await BluetoothEscposPrinter.printText('Republic of the Philippines ' ,{ align: 'center' });
      await BluetoothEscposPrinter.printText('Municipality of Manolo Fortich ' ,{ align: 'center' });
      await BluetoothEscposPrinter.printText('ROADS AND TRAFFIC ADMINISTRATION ' ,{ align: 'center', widthtimes: 3});
      await BluetoothEscposPrinter.printText('GEMS - eTCMF ' ,{ align: 'center' });
      await BluetoothEscposPrinter.printText(' MFTRTA Ticket No: ' + ticketRedux.MFRTA_TCT_NO, { align: 'center' });
      // await BluetoothEscposPrinter.printPic(hsdLogo, options);

      // Personal Information
      await BluetoothEscposPrinter.printText('Personal Info', { align: 'center' });
      await BluetoothEscposPrinter.printText(' Name: ' + ticketRedux.driver_info.last_name + ', ' + ticketRedux.driver_info.first_name + ' ' + ticketRedux.driver_info.middle_initial , { align: 'left' });
      await BluetoothEscposPrinter.printText(' Date of Birth: ' + ticketRedux.driver_info.birthdate , { align: 'left' });
      await BluetoothEscposPrinter.printText(' Nationality: ' + ticketRedux.driver_info.nationality , { align: 'left' });
      // Check if the license_number is 'undefined'
      const licenseText = ticketRedux.driver_info.license_number !== 'undefined' ? '' + ticketRedux.driver_info.license_number : 'No License';
      await BluetoothEscposPrinter.printText(' License No: ' + licenseText , { align: 'left' });
      await BluetoothEscposPrinter.printText(' Classification: ' + ticketRedux.driver_info.classification , { align: 'left' });

      // Vehicle Information      
      await BluetoothEscposPrinter.printText("--------------------------------",{align: 'center'});
      await BluetoothEscposPrinter.printText('Vehicle Information', { align: 'center' });
      await BluetoothEscposPrinter.printText('\r\n', {});

      await BluetoothEscposPrinter.printText(' Owner: ' + ticketRedux.vehicle_info.name , { align: 'left' });
      await BluetoothEscposPrinter.printText(' Plate Number: ' + ticketRedux.vehicle_info.plate_number , { align: 'left' });
      await BluetoothEscposPrinter.printText(' Make: ' + ticketRedux.vehicle_info.make , { align: 'left' });
      await BluetoothEscposPrinter.printText(' Class: ' + ticketRedux.vehicle_info.vehicle_class , { align: 'left' });
      await BluetoothEscposPrinter.printText(' Model: ' + ticketRedux.vehicle_info.vehicle_model , { align: 'left' });
      await BluetoothEscposPrinter.printText(' Color: ' + ticketRedux.vehicle_info.color , { align: 'left' });
      await BluetoothEscposPrinter.printText(' Body Markings: ' + ticketRedux.vehicle_info.body_markings , { align: 'left' });
      await BluetoothEscposPrinter.printText(' Contact Number: ' + ticketRedux.vehicle_info.contact_number , { align: 'left' });

      // Violation Information
      await BluetoothEscposPrinter.printText("--------------------------------",{align: 'center'});
      await BluetoothEscposPrinter.printText('Violation Info', { align: 'left' });
      await BluetoothEscposPrinter.printText('\r\n', {});

      await BluetoothEscposPrinter.printText(' Officer: ' + ticketRedux.user_ID.last_name + ', ' + ticketRedux.user_ID.first_name + ' ' + ticketRedux.user_ID.middle_name , { align: 'left' });
      await BluetoothEscposPrinter.printColumn(
        [48],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        ['Signature:'+ '...................'],
        {},
      );      
      await BluetoothEscposPrinter.printText(' Status: ' + ticketRedux.ticket_status , { align: 'left' });
      await BluetoothEscposPrinter.printText(' Date & Time: ' + ticketRedux.date_issued , { align: 'left' });
      await BluetoothEscposPrinter.printText(' Place of Violations: ' + ticketRedux.place_violation , { align: 'left' });
      await BluetoothEscposPrinter.printText(' Penalty Amount: ' + ticketRedux.penalty_amount , { align: 'left' });

      // Violations
      await BluetoothEscposPrinter.printText("--------------------------------",{align: 'center'});
      await BluetoothEscposPrinter.printText('Violations', { align: 'center' });
      await BluetoothEscposPrinter.printText('\r\n', {});

      ticketRedux.violation_info.violations_info.forEach(async (violation, index) => {
        const violationText = (index + 1) + '. ' + violation;
        await BluetoothEscposPrinter.printText(violationText, { align: 'left' });
      });
      await  BluetoothEscposPrinter.printText("\n\r\n\r\n\r",{});


      await BluetoothEscposPrinter.printColumn(
        [48],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        ['Driver Signature:'+ '...............'],
        {},
      );
      await  BluetoothEscposPrinter.printText("\n\r\n\r\n\r",{});


      
      dispatch(setEmptyFinalDriver());
      dispatch(setEmptyFinalVehicle());
      dispatch(setEmptyRecognizedText());
    } catch (e) {
      alert(e.message || 'ERROR');

      dispatch(setEmptyFinalDriver());
      dispatch(setEmptyFinalVehicle());
      dispatch(setEmptyextractedInfo());
      navigation.navigate("HomeScreen");
    }
    }
    



  const handleTicketClick = (ticketItem) => {
    setSelectedTicket(ticketItem);
    dispatch(setTicketInfo(ticketItem));
    setPreview(true);
  };

  function obfuscateRandomCharacters(inputString, numCharactersToObfuscate) {
    const stringLength = inputString.length;

    if (numCharactersToObfuscate >= stringLength) {
      return "*".repeat(stringLength); // Obfuscate the entire string if numCharactersToObfuscate is equal to or greater than the string length.
    }

    const obfuscatedIndices = new Set();

    while (obfuscatedIndices.size < numCharactersToObfuscate) {
      const randomIndex = Math.floor(Math.random() * stringLength);
      obfuscatedIndices.add(randomIndex);
    }

    return inputString
      .split("")
      .map((char, index) => (obfuscatedIndices.has(index) ? "*" : char))
      .join("");
  }

  const renderTicketList = () => {
    const filteredTickets = ticket.filter((ticketItem) => {
      const ticketNumber = ticketItem.MFRTA_TCT_NO?.toString();

      return (
        ticketItem.MFRTA_TCT_NO &&
        ticketItem.MFRTA_TCT_NO.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        ticketItem.user_ID.id === user.id
      );
    });

    // Sort the filteredTickets based on the sortAsc state
    const sortedTickets = [...filteredTickets].sort((a, b) => {
      const ticketANumber = a.MFRTA_TCT_NO?.toString() || "";
      const ticketBNumber = b.MFRTA_TCT_NO?.toString() || "";

      if (sortAsc) {
        // Sort in ascending order
        return ticketANumber.localeCompare(ticketBNumber);
      } else {
        // Sort in descending order
        return ticketBNumber.localeCompare(ticketANumber);
      }
    });

    return sortedTickets.map((ticketItem) => (
      <TouchableOpacity
        style={{ marginTop: 10, marginBottom: 10 }}
        key={ticketItem.id}
        onPress={() => handleTicketClick(ticketItem)}
      >
        <View
          style={{
            width: "100%",
            height: "auto",
            paddingVertical: 10,
            borderColor: "#D9D9D9",
            borderWidth: 5,
            paddingHorizontal: 10,
            borderRadius: 10,
          }}
        >
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontWeight: "bold" }}>{ticketItem.date_issued}</Text>
          </View>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "green",
            }}
          >
            {ticketItem.MFRTA_TCT_NO}
          </Text>

          <Text
            style={{ fontSize: 15, marginTop: 5, textTransform: "capitalize" }}
          >
            {ticketItem.driver_info.first_name}{" "}
            {ticketItem.driver_info.middle_initial}{" "}
            {ticketItem.driver_info.last_name}
          </Text>
          <Text style={{ fontSize: 15, marginTop: 5 }}>{}</Text>
          <View
            style={{
              width: "80%",
              marginLeft: 20,
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Text>
              {ticketItem.violation_info.violations_info.map(
                (violation, index) => (
                  <Text key={index}>
                    <Icon name="right"></Icon>
                    {violation}
                    {index <
                      ticketItem.violation_info.violations_info.length - 1 &&
                      "\n"}
                  </Text>
                )
              )}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
  };

  function capitalizeWords(str) {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
  }

  const renderPreview = () => {
    if (!selectedTicket) {
      return null;
    }

    return (
      <View
        style={{
          backgroundColor: "#E4FAD9",
          height: "100%",
          padding: 40,
        }}
      >
        <View style={{ position: "absolute", right: 0 }}>
          <TouchableOpacity
            onPress={() => setPreview(!preview)}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Icon name="close" size={30} color={"red"}></Icon>
          </TouchableOpacity>
        </View>
        <View style={{}}>
          <View>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  color: "#038855",
                  fontWeight: "bold",
                }}
              >
                Personal Information
              </Text>
            </View>
            <View style={{ marginBottom: 20 }}>
              <PreviewComponent
                title={"MFRTA TICKET NO."}
                value={selectedTicket.MFRTA_TCT_NO}
              ></PreviewComponent>
              <PreviewComponent
                title={"DATE"}
                value={selectedTicket.date_issued}
              ></PreviewComponent>
              <PreviewComponent
                title="LAST NAME, FIRST NAME, MIDDLE NAME"
                value={capitalizeWords(
                  `${selectedTicket.driver_info.last_name}, ${selectedTicket.driver_info.first_name} ${selectedTicket.driver_info.middle_initial}`
                )}
              />
              <PreviewComponent
                title={"DATE OF BIRTH"}
                value={selectedTicket.driver_info.birthdate}
              ></PreviewComponent>
              <PreviewComponent
                title={"NATIONALITY"}
                value={selectedTicket.driver_info.nationality}
              ></PreviewComponent>
              <PreviewComponent
                title={"ADDRESS"}
                value={selectedTicket.driver_info.address}
              ></PreviewComponent>
              <PreviewComponent
                title={"LICENSE NO."}
                value={obfuscateRandomCharacters(
                  selectedTicket.driver_info.license_number,
                  3
                )}
              ></PreviewComponent>
            </View>
          </View>
          <View>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  color: "#038855",
                  fontWeight: "bold",
                }}
              >
                Vehicle Information
              </Text>
            </View>
            <View style={{ marginBottom: 20 }}>
              <PreviewComponent
                title={"REGISTERED OWNER"}
                value={selectedTicket.vehicle_info.name}
              ></PreviewComponent>
              <PreviewComponent
                title={"PLATE NO."}
                value={obfuscateRandomCharacters(
                  selectedTicket.vehicle_info.plate_number,
                  3
                )}
              ></PreviewComponent>
              <PreviewComponent
                title={"MAKE"}
                value={selectedTicket.vehicle_info.make}
              ></PreviewComponent>
              <PreviewComponent
                title={"CLASS"}
                value={selectedTicket.vehicle_info.vehicle_class}
              ></PreviewComponent>
              <PreviewComponent
                title={"MODEL"}
                value={selectedTicket.vehicle_info.vehicle_model}
              ></PreviewComponent>
              <PreviewComponent
                title={"CONTACT NO."}
                value={selectedTicket.vehicle_info.contact_number}
              ></PreviewComponent>
              <PreviewComponent
                title={"COLOR"}
                value={selectedTicket.vehicle_info.color}
              ></PreviewComponent>
              <PreviewComponent
                title={"BODY MARKS"}
                value={selectedTicket.vehicle_info.body_markings}
              ></PreviewComponent>
            </View>
          </View>
          <View>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  color: "#038855",
                  fontWeight: "bold",
                }}
              >
                Violation Information
              </Text>
            </View>
            <View style={{}}>
              <PreviewComponent
                title={"APPREHENDING OFFICER"}
                value={capitalizeWords(
                  `${selectedTicket.user_ID.first_name} ${selectedTicket.user_ID.middle_name} ${selectedTicket.user_ID.last_name}`
                )}
              ></PreviewComponent>
              <PreviewComponent
                title={"Date and Time"}
                value={selectedTicket.date_issued}
              ></PreviewComponent>
              <PreviewComponent
                title={"Ticket Status"}
                value={selectedTicket.ticket_status}
              ></PreviewComponent>
              <PreviewComponent
                title={"PLACE OF VIOLATION"}
                value={selectedTicket.place_violation}
              ></PreviewComponent>
              <Text style={{ color: "grey", marginTop: 20 }}>
                TRAFFIC RULES VIOLATION
              </Text>

              <View
                style={{
                  flexDirection: "column",
                  alignItems: "right",
                  marginLeft: 20,
                  marginTop: 10,
                }}
              >
                {selectedTicket.violation_info.violations_info.map(
                  (violation, index) => (
                    <View style={{ flexDirection: "row" }}>
                      <Icon
                        name="car"
                        style={{
                          marginTop: 3,
                          fontSize: 20,
                          marginRight: 10,
                        }}
                      ></Icon>
                      <Text style={{ fontSize: 15 }} key={index}>
                        {violation}
                        {index <
                          selectedTicket.violation_info.violations_info.length -
                            1 && "\n"}
                      </Text>
                    </View>
                  )
                )}
              </View>

              <View style={{ marginTop: 40 }}>
                <ConstButton
                  name={"printer"}
                  title={"RE-PRINT"}
                  height={50}
                  onPress={handlePrint}
                ></ConstButton>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <KeyboardWithoutWrapper>
      <View
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <View style={{ padding: 20 }}>
          <View
            style={{
              height: "100%",
              borderRadius: 40,
            }}
          >
            <View
              style={{
                padding: 10,
                marginTop: 20,
                flexDirection: "row",
              }}
            >
              <TextInput
                style={{
                  width: "90%",
                  borderRadius: 20,
                  height: 40,
                  paddingLeft: 20,
                  paddingRight: 20,
                  backgroundColor: "#E0E0E0",
                  textAlign: "left",
                }}
                placeholder="Search by MFRTA_TCT_NO"
                value={searchTerm}
                onChangeText={(text) => setSearchTerm(text)}
              />

              <TouchableOpacity
                onPress={toggleSortIcon}
                style={{ marginLeft: 15 }}
              >
                <Icon2
                  name={sortAsc ? "sort-asc" : "sort-desc"}
                  size={30}
                  color="black"
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginBottom: 10,
                marginTop: 40,
                height: "auto",
              }}
            >
              {preview ? renderPreview() : renderTicketList()}
            </View>
          </View>
        </View>
      </View>
    </KeyboardWithoutWrapper>
  );
}

export default History;
