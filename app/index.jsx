import { Text, View } from "react-native";
import Navigation from "./Navigation.jsx";
import FoodDisplay from "./FoodDisplay.jsx";
import ResturantContent from "./ResturantContent.jsx";
import MakeOrder from "./MakeOrder.jsx";
import React, { useState } from "react";



export default function Index() {


  const [activeNavigator, setActiveNavigator] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
      }}
    >
      <MakeOrder 
      moveDisappearNavigatorSignal={setActiveNavigator}
      />
      {/* <FoodDisplay/> */}
      {/* <ResturantContent/> */}
      
      {!activeNavigator && <Navigation/>}
    </View>
  );
}
