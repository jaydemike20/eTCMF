import { createSlice } from "@reduxjs/toolkit";


function extractNameInfo(fullName) {
  const nameArray = fullName.split(", ");

  // Check if there is a comma and space in the full name
  if (nameArray.length === 1) {
    // If no comma and space, assume the full name contains only first and last name
    const [firstName, lastName] = fullName.split(" ");
    return {
      firstName,
      lastName,
      middleName: "", // Assuming no middle name is provided
    };
  }

  // Extract last name
  const lastName = nameArray[0];

  // Extract first and middle name
  const firstMiddleName = nameArray[1];
  const firstMiddleNameArray = firstMiddleName.split(" ");

  // Extract first name and middle name
  const firstName = firstMiddleNameArray.slice(0, -1).join(" ");
  const middleName = firstMiddleNameArray.slice(-1)[0];

  return {
    lastName,
    firstName,
    middleName,
  };
}

export const infoSlice = createSlice({
  name: "infoText",
  initialState: {
    isDriverRegisterd: false,
    id: '',
    text: "",
    extractedInfo: {
      type: "",
      name: "",
      licenseNumber: "",
      dateOfBirth: "",
      bloodType: "",
      nationality: "",
      sex: "",
      address: "",
      weight: "",
      height: "",
      agency_code: "",
      dl_codes: "",
      expirationDate: "",
      conditions: "",
      restrictions: "",
    },
    finalDriver: {
      license_number: '',
      first_name: '',
      middle_initial: '',
      last_name: '',
      address: '',
      birthdate: '',
      nationality: '',
      classification: '',
    }
  },
  reducers: {
    setRecognizedText: (state, action) => {
      state.extractedInfo = action.payload;
      const recogText = state.extractedInfo;

      console.log(recogText);
    },
    setFinalDriver: (state) => {
      state.finalDriver.license_number = state.extractedInfo.licenseNumber;
    
      const fullname = state.extractedInfo.name;
    
      // Use the extractNameInfo function to get name information
      const nameInfo = extractNameInfo(fullname);
    
      // Assign the extracted name information to the finalDriver state
      state.finalDriver.last_name = nameInfo.lastName;
      state.finalDriver.first_name = nameInfo.firstName;
      state.finalDriver.middle_initial = nameInfo.middleName;
    
      state.finalDriver.address = state.extractedInfo.address;
      state.finalDriver.birthdate = state.extractedInfo.dateOfBirth;
      state.finalDriver.nationality = state.extractedInfo.nationality;
      state.finalDriver.classification = state.extractedInfo.classification;
    },
    
    setEmptyRecognizedText: (state) => {
      state.extractedInfo = {
        type: "",
        name: "",
        licenseNumber: "",
        dateOfBirth: "",
        bloodType: "",
        nationality: "",
        sex: "",
        address: "",
        weight: "",
        height: "",
        agency_code: "",
        dl_codes: "",
        expirationDate: "",
        conditions: "",
        restrictions: "",
      };
    },
    setEmptyFinalDriver: (state) => {
      state.finalDriver = {
        license_number: '',
        first_name: '',
        middle_initial: '',
        last_name: '',
        address: '',
        birthdate: '',
        nationality: '',
        classification: '',
      }
      state.extractedInfo = {
        type: "",
        name: "",
        licenseNumber: "",
        dateOfBirth: "",
        bloodType: "",
        nationality: "",
        sex: "",
        address: "",
        weight: "",
        height: "",
        agency_code: "",
        dl_codes: "",
        expirationDate: "",
        conditions: "",
        restrictions: "",
      };

      state.isDriverRegisterd = false
      state.id = ''
      state.text = ''
    },
    setDriverRegisterd: (state) => {
      state.isDriverRegisterd = true
    },
    setDefaultDriverRegisterd: (state) => {
      state.isDriverRegisterd = false
    },
    setDriverID: (state, action) => {
      state.id = action.payload
    },
    // SET MANUALLY INFO
    setDriverClassification: (state, action) => {
      state.finalDriver.classification = action.payload
    },
    setLicenseNumber: (state, action) => {
      state.finalDriver.license_number = action.payload
    },
    setFirstName: (state, action) => {
      state.finalDriver.first_name = action.payload
    },
    setMiddleInitial: (state, action) => {
      state.finalDriver.middle_initial = action.payload
    },
    setLastName: (state, action) => {
      state.finalDriver.last_name = action.payload
    },
    setAddress: (state, action) => {
      state.finalDriver.address = action.payload
    },
    setBirthDate: (state, action) => {
      state.finalDriver.birthdate = action.payload
    },
    setNationality: (state, action) => {
      state.finalDriver.nationality = action.payload
    },
  
    setGetFinalDriver: (state, action) => {
      state.finalDriver = action.payload
    }
  },
});

export const { 
  setRecognizedText, 
  setFinalDriver, 
  setEmptyRecognizedText, 
  setEmptyFinalDriver, 
  setDriverRegisterd, 
  setDriverID,
  setDriverClassification,
  setLicenseNumber,
  setFirstName,
  setMiddleInitial,
  setLastName,
  setAddress,
  setBirthDate,
  setNationality,
  setGetFinalDriver,
  setDefaultDriverRegisterd
} = infoSlice.actions;

export default infoSlice.reducer;
