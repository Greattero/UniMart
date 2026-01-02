import { getDatabase, ref, update } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MlkitOcr from 'react-native-mlkit-ocr';
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import { app } from "./firebaseConfig.js"; // your firebaseConfig file


export default function FaceScanner({getProfile,setMount, setLogger}){

    // ... (rest of your state and useEffect hooks) ...
    const camera = useRef(null);
    const device = useCameraDevice('back')
    const { hasPermission, requestPermission } = useCameraPermission() // Added requestPermission
    const [loading, setLoading] = useState(false);

    const [studentNumber, setStudentNumber] = useState("");
    const [refNum, setRefNum] = useState("");
    const [email, setEmail] = useState("");

    const db = getDatabase(app);

    useEffect(()=>{
      setEmail(getProfile);
    },[getProfile])





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
  setLoading(true);
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

    if(!hasIdCard || !hasUniversity || !hasRailway){
      console.log("Couldn't verify card. Scan properly");
      setLoading(false);
      return;
    }
    const studentRef =
      textArray
        .find(t => /90\d{8}/.test(t))        // find any text that contains 90xxxxxxxx
        ?.match(/90\d{8}/)?.[0]              // extract the number
      || "Not found";
    
    const studentNum = textArray
                  .find(t=>/sri/i.test(t))
                  ?.match(/sri[\w\.]+/i)?.[0]
                  ?.replaceAll(".","")
                  ?.toUpperCase()
                  || "Not Found";
      


    setStudentNumber(studentNum);
    setRefNum(studentRef);
    
    const userPath = `buyer-profiles/${email}/credentials`;
    const userRef = ref(db, userPath);

    await update(userRef, {
      indexNumber: studentNum,
      referenceNumber: studentRef
    })
    .then(() => {
      console.log("Index and Ref No stored in credential array successfully");
      setMount(false);
      setLogger(true);
    })
    .catch((err) => {
      console.error("Error storing credentials:", err);
    });

    setLoading(false);
    // ... (logic for DOB extraction can be added here) ...

  } catch (err) {
    console.log("Error:", err);
    setLoading(false);
  }
};

    if (!device) return<Text>Loading camera.....</Text>
    // Assuming you define a PermissionsPage component somewhere or handle the UI differently
    if (!hasPermission) return <Text>Need camera permission.</Text> 


 return (
    <View style={styles.cameraBody}>
      <View style={styles.heading}>
      <Text  style={{color:"white", fontSize:30, fontWeight:"bold"}}>Scan Your Student ID</Text>
      </View>
        <View style={styles.cameraWrapper}>
          <Camera
            ref={camera}
            style={styles.cameraFrame}
            device={device}
            isActive={true}
            photo={true}
          />
      </View>
      <View style={styles.overlay}>
        <TouchableOpacity onPress={()=>captureAndExtract()} style={styles.button}>
          {loading?  
          (<View>
                <ActivityIndicator color={"white"} size={28}/>
          </View>) 
          :
          (
          <Text style={styles.buttonText}>Scan Student ID</Text>
          )
        }
        </TouchableOpacity>
        <Text style={{color:"white"}}>Student No: {studentNumber}</Text>
        <Text style={{color:"white"}}>Reference No:: {refNum}</Text>
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
cameraFrame: {
  width: "100%",
  height: "100%",
},
  cameraBody:{
    flex: 1,
    justifyContent:"center",
    alignItems: "center",
    backgroundColor: "black",
    
  },
cameraWrapper: {
  width: "90%",
  height: "25%",
  borderRadius: 15,
  overflow: "hidden",     // 🔥 REQUIRED
},
heading:{
    position: "absolute",
    top: 140,
    alignSelf: "center",
    alignItems: "center",
}

});