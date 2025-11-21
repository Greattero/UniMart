import React, { useEffect, useState, useRef } from "react";
import { View, TouchableOpacity, Animated, StyleSheet, Text } from "react-native";
import FoodDisplay from "./FoodDisplay.jsx";
import MakeOrder from "./MakeOrder.jsx";
import Navigation from "./Navigation.jsx";
import ResturantContent from "./ResturantContent.jsx";
import ShopDisplay from "./ShopDisplay.jsx"



export default function Index() {


  const [activeNavigator, setActiveNavigator] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);
  const [restaurantData2, setRestaurantData2] = useState(null);
  const [resturantAllDetails, setRestaurantAllDetails] = useState([]);
  const [onOpenBottomSheet, setOnOpenBottomSheet] = useState(null);
  const [showSheet, setShowSheet] = useState(false);
  const [priceOfFood, setPriceofFood] = useState(null);
  const [bottomSheetImage, setBottomSheetImage] = useState(null);
  const [switchToShop, setSwitchToShop] = useState(true);
  const anim = useRef(new Animated.Value(0)).current;



  // const sheetRef = useRef(null);  // 👈 THIS IS REQUIRED

  // const openSheet = () => sheetRef.current?.expand();

  // if (onOpenBottomSheet === true){
  //   openSheet();
  // }

    const toggleRole = () => {
        setSwitchToShop(!switchToShop);
        Animated.timing(anim, {
        toValue: switchToShop ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
        }).start();
    };

    const translateX = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 85], // matches button width
    });

  console.log(restaurantData?.foodPrice)
  console.log(onOpenBottomSheet)
  console.log(`kkkkkkk: ${resturantAllDetails}`)

  // Open sheet when restaurantData exists or manually triggered
  useEffect(() => {
    if (restaurantData || onOpenBottomSheet) {
      setShowSheet(true);
    }
  }, [restaurantData, onOpenBottomSheet]);

  return (

    <>

    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        position: "absolute",
        width: "100%",
        height: "100%",
        paddingTop: 80,
      }}
    >
    <View style={styles.toggleContainer}>
      <Animated.View style={[styles.slider, { transform: [{ translateX }] }]} />
      <TouchableOpacity style={styles.toggleSide} onPress={() => !switchToShop && toggleRole()}>
          <Text style={[styles.toggleText, switchToShop && styles.activeText]}>Resturants</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.toggleSide} onPress={() => switchToShop && toggleRole()}>
          <Text style={[styles.toggleText, !switchToShop && styles.activeText]}>Shops</Text>
      </TouchableOpacity>
    </View>


    {/* {(onOpenBottomSheet) && <MakeOrder 
    // moveDisappearNavigatorSignal={setActiveNavigator}
        autoOpenFood={restaurantData.autoOpenFood} // 👈 new prop


    />} */}

    {(restaurantData2 !== null || restaurantData !== null) && <ResturantContent 
    nameOfResturant2={restaurantData2}
    setRestaurantDataTransfer={setRestaurantAllDetails}
    disappearNavigator={setActiveNavigator}
    // onOpen={setOnOpenBottomSheet}
    manuallyOpenSheet={setOnOpenBottomSheet}
    getNameOfResturant={restaurantData?.resturant}
    getNameOfResturant2={restaurantData2}
    sendPrice={setPriceofFood}
    sendImage={setBottomSheetImage}
    />}
      
    {switchToShop ? (restaurantData === null && <FoodDisplay
          nameOfResturant = {setRestaurantData}
          nameOfResturant2= {setRestaurantData2}
          />) 
    :
    <ShopDisplay/>
    }


      
      {<Navigation/>}
    </View>

          {showSheet && <MakeOrder 
    // moveDisappearNavigatorSignal={setActiveNavigator}
    getNameOfResturant={restaurantData?.resturant || restaurantData2}
    autoOpenFood={restaurantData?.autoOpenFood} // 👈 new prop
    getFoodPrice={restaurantData?.foodPrice || priceOfFood}
    manuallyOpenFood={onOpenBottomSheet}
    onCloseCallback={()=>{setShowSheet(false);
    setOnOpenBottomSheet(false);
    }}
    getRestaurantDataTransfer={resturantAllDetails}
    getImage={bottomSheetImage}

    />}

    </>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#28a745",
    borderRadius: 25,
    width: 170,
    height: 35,
    alignSelf: "center",
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
    marginBottom: 5,
  },
  slider: {
    position: "absolute",
    width: "50%",
    height: "100%",
    backgroundColor: "green",
    borderRadius: 25,
  },
  toggleSide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleText: {
    color: "black",
    fontWeight: "600",
  },
  activeText: {
    color: "white",
  },
})