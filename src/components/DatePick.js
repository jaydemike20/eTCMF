import React, { useState } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Octicons";
import { subYears, differenceInYears } from 'date-fns';

function DatePick({ onDateChange, value, style }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || new Date());

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);

    if (date) {
      const currentDate = new Date();
      const ageDifference = differenceInYears(currentDate, date);

      if (ageDifference >= 13) {
        setSelectedDate(date);
        onDateChange(date);
      } else {
        // Display an error message if the selected date is not valid
        Alert.alert("Invalid Date", "Selected date must be at least 13 years ago");
      }
    }
  };

  const maxDate = subYears(new Date(), 13);

  return (
    <View style={style}>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Icon size={25} name="calendar"></Icon>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={maxDate}
        />
      )}
    </View>
  );
}

export default DatePick;
