import React, { useEffect, useRef, useState } from "react";
import { Animated, BackHandler, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FoodDisplay from "./FoodDisplay.jsx";
import MakeOrder from "./MakeOrder.jsx";
import Navigation from "./Navigation.jsx";
import ResturantContent from "./ResturantContent.jsx";
import ShopContent from "./ShopContent.jsx";
import ShopDisplay from "./ShopDisplay.jsx";
import Purchases from "./Purchases.jsx";
import LoginSignup from "./LoginSignup.jsx";
import FaceScanner from "./FaceScanner.jsx";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [inactiveNavigator, setInactiveNavigator] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);
  const [restaurantData2, setRestaurantData2] = useState(null);
  const [resturantAllDetails, setRestaurantAllDetails] = useState([]);
  const [shopAllDetails, setShopAllDetails] = useState([]);
  const [onOpenBottomSheet, setOnOpenBottomSheet] = useState(null);
  const [showSheet, setShowSheet] = useState(false);
  const [priceOfFood, setPriceofFood] = useState(null);
  const [bottomSheetImage, setBottomSheetImage] = useState(null);
  const [switchToRestaurant, setSwitchToRestaurant] = useState(true);
  const [shopData,setShopData] = useState(null);
  const [page, setPage] = useState("home");
  const anim = useRef(new Animated.Value(0)).current;
  const [cameraSignal, setCameraSignal] = useState(false);
  const [profile, setProfile] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNotify, setIsNotify] = useState(false);

  console.log(`restaurantData`);

  // Toggle role with animation
  const toggleRole = (targetShop) => {
    setSwitchToRestaurant(targetShop);
    Animated.timing(anim, {
      toValue: targetShop ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 85], // matches button width
  });

  // Open sheet when restaurantData exists or manually triggered
  useEffect(() => {
    if (restaurantData || onOpenBottomSheet) {
      setShowSheet(true);
    }
  }, [restaurantData, onOpenBottomSheet]);

  useEffect(() => {
    if(page !== "home"){
      setRestaurantData(null);
      setRestaurantData2(null);
      setShopData(null);
      setShowSheet(false);
    }
  },[page])

  // Handle Android hardware back button
  useEffect(() => {
    const backAction = () => {

      if (showSheet) {
        setShowSheet(false);
        setOnOpenBottomSheet(false);
        return true;
      }

      if (!switchToRestaurant) {
        setSwitchToRestaurant(true);
        toggleRole(true);
        return true;
      }

      if (shopData) {
        setShopData(null);
        return true;
      }

      if (restaurantData || restaurantData2) {
        setRestaurantData(null);
        setRestaurantData2(null);
        return true;
      }

      return true; // allow default behavior
    };

    // Correct: store the subscription object
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Remove listener on cleanup
    return () => backHandler.remove();
  }, [showSheet, switchToRestaurant, shopData, restaurantData, restaurantData2]);


  useEffect(()=>{
    
    const checkAwaitingOrders = async () =>{
      const hasAwaitingOrders = await AsyncStorage.getItem("notify");

      if (hasAwaitingOrders === "true")
      {
        setIsNotify(true);
        console.log("unfinished order found")
      }
      else{
        setIsNotify(false);
      }
    }


    checkAwaitingOrders();
  },[])



  return (
    
    <>
      {isLoggedIn ?
        <>
          {page === "receipt" ? 
            (
            <View
            style={{
              flex: 1,
              // justifyContent: "center",
              // alignItems: "center",
              backgroundColor: "white",
              position: "absolute",
              width: "100%",
              height: "100%",
              paddingTop: 80,
            }}  
            >
            <Purchases
            setNotify={setIsNotify}
            />
            {/* <Navigation 
            goToPurchases={setPage}
            goToHome={setPage}
            /> */}
            </View>) 
            : page === "home" ? 
            (<View
            style={{
              flex: 1,
              // justifyContent: "center",
              // alignItems: "center",
              backgroundColor: "white",
              position: "absolute",
              width: "100%",
              height: "100%",
              paddingTop: !shopData && !restaurantData && !restaurantData2 ? 80 : 0,
            }}
          >
            {((!shopData && !restaurantData && !restaurantData2) && page==="home") && (
              <View style={styles.toggleContainer}>
                <Animated.View style={[styles.slider, { transform: [{ translateX }] }]} />
                <TouchableOpacity style={styles.toggleSide} onPress={() => !switchToRestaurant && toggleRole(true)}>
                  <Text style={[styles.toggleText, switchToRestaurant && styles.activeText]}>Resturants</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toggleSide} onPress={() => switchToRestaurant && toggleRole(false)}>
                  <Text style={[styles.toggleText, !switchToRestaurant && styles.activeText]}>Shops</Text>
                </TouchableOpacity>
              </View>
            )}

            {(restaurantData2 !== null || restaurantData !== null) && (
              <ResturantContent 
                nameOfResturant2={restaurantData2}
                setRestaurantDataTransfer={setRestaurantAllDetails}
                disappearNavigator={setInactiveNavigator}
                manuallyOpenSheet={setOnOpenBottomSheet}
                getNameOfResturant={restaurantData?.resturant}
                getNameOfResturant2={restaurantData2}
                sendPrice={setPriceofFood}
                sendImage={setBottomSheetImage}
              />
            )}


            {switchToRestaurant ? (
              restaurantData === null && restaurantData2 === null &&(
                <FoodDisplay
                  nameOfResturant={setRestaurantData}
                  nameOfResturant2={setRestaurantData2}
                />
              )
            ) : (
              !shopData && <ShopDisplay nameOfShop={setShopData} />
            )}

            {shopData && (
              <ShopContent
                getShopName={shopData}
                manuallyOpenSheet={setOnOpenBottomSheet}
                disappearNavigator={setInactiveNavigator}
                sendImage={setBottomSheetImage}
                setShopDataTransfer={setShopAllDetails}
              />
            )}

            {/* <Navigation 
            goToPurchases={setPage}
            goToHome={setPage}
            /> */}

          </View>) : null}

          {showSheet && (
            <MakeOrder 
              getNameOfResturant={restaurantData?.resturant || restaurantData2}
              autoOpenFood={restaurantData?.autoOpenFood}
              getFoodPrice={restaurantData?.foodPrice || priceOfFood}
              manuallyOpenFood={onOpenBottomSheet}
              onCloseCallback={() => {
                setShowSheet(false);
                setOnOpenBottomSheet(false);
                setInactiveNavigator(false);
              }}
              getRestaurantDataTransfer={switchToRestaurant ? resturantAllDetails : shopAllDetails}
              getImage={bottomSheetImage}
              setNotify={setIsNotify}
              disappearNavigator={setInactiveNavigator}
            />
          )}

           { inactiveNavigator === false && <Navigation 
            goToPurchases={setPage}
            goToHome={setPage}
            showRedDot={isNotify}
            />}


            {/* {page ? 
            (<Purchases/>) 
            : 
            (switchToRestaurant ? (
              restaurantData === null && (
                <FoodDisplay
                  nameOfResturant={setRestaurantData}
                  nameOfResturant2={setRestaurantData2}
                />
              )
            ) : (
              !shopData && (
              <>
              <ShopDisplay nameOfShop={setShopData} /> 
                        <MakeOrder/>
                        </>
                        )
            )) } */}
          </>


    :

    <>
      {!cameraSignal &&   <LoginSignup
          sendCameraSignal={setCameraSignal}
          sendProfile={setProfile}
          setLogger={setIsLoggedIn}               // when you integrate the logout, make sure you handle the setislogged in properly
          />}
          {(cameraSignal && profile) ? <FaceScanner getProfile={profile} setMount={setCameraSignal} setLogger={setIsLoggedIn}/> : null}

      </>
}

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
    marginBottom: 5,
    overflow: "hidden",
    position: "relative",
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
});
