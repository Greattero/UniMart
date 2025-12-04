import React, { useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import MlkitOcr from 'react-native-mlkit-ocr';
// The import is correct, assuming you have it installed:
// import * as FileSystem from 'expo-file-system/legacy'; 


export default function FaceScanner(){

    // ... (rest of your state and useEffect hooks) ...
    const camera = useRef(null);
    const device = useCameraDevice('back')
    const { hasPermission, requestPermission } = useCameraPermission() // Added requestPermission

    const [studentNumber, setStudentNumber] = useState("");
    const [dob, setDob] = useState("");

    useEffect(()=>{
        // Use the requestPermission function from the hook
        (async () =>{
            const status = await requestPermission(); // Await the permission request
            if (!status){ // Check the boolean status
                console.log("Camera permission denied");
            }
        })();
    },[]);

const captureAndExtract = async () => {
  if (!camera.current) return;

  try {
    const photo = await camera.current.takePhoto({ qualityPrioritization: "quality" });
    
    // *** FIX IS HERE ***
    // Construct the correct file URI by adding 'file://' prefix for Android
    const imageUri = Platform.OS === 'android' ? `file://${photo.path}` : photo.path;

    // Pass the correctly formatted URI to ML Kit
    const ocrResult = await MlkitOcr.detectFromFile(imageUri);

    const textArray = ocrResult.map(item => item.text.toLowerCase());

    console.log(`llllll: ${textArray}`)

  const hasUniversity =
textArray.some(t =>
  t.includes("mines and technology (umat)") || t.includes("mines and technoiogy (umat)")
);

  const hasIdCard =
    textArray.some(t => t.includes("student identification card"));

  const hasRailway =
    textArray.some(t => t.includes("railway"));

    if(textArray){
      console.log(`uni ${hasUniversity}`);
      console.log(`card ${hasIdCard}`);
      console.log(`hall ${hasRailway}`);

    }
    const studentNum = textArray
      .find(t => t.includes("index no.:"))
      ?.split(/index no[:\s]/i)[1]
      ?.trim() || "Not found";

    setStudentNumber(studentNum);
    // ... (logic for DOB extraction can be added here) ...

  } catch (err) {
    console.log("Error:", err);
  }
};

    if (!device) return<Text>Loading camera.....</Text>
    // Assuming you define a PermissionsPage component somewhere or handle the UI differently
    if (!hasPermission) return <Text>Need camera permission.</Text> 


 return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={camera}
        style={{ flex: 1 }}
        device={device}
        isActive={true}
        photo={true}
      />
      <View style={styles.overlay}>
        <TouchableOpacity onPress={()=>captureAndExtract()} style={styles.button}>
          <Text style={styles.buttonText}>Scan Student ID</Text>
        </TouchableOpacity>
        <Text>Student No: {studentNumber}</Text>
        <Text>DOB: {dob}</Text>
      </View>
    </View>
  );
}

// ... (styles remain the same) ...

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#3562FF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});