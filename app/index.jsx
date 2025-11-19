import React, { useRef, useState, useEffect} from "react";
import { View } from "react-native";
import FoodDisplay from "./FoodDisplay.jsx";
import MakeOrder from "./MakeOrder.jsx";
import Navigation from "./Navigation.jsx";
import ResturantContent from "./ResturantContent.jsx";



export default function Index() {


  const [activeNavigator, setActiveNavigator] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);
  const [restaurantData2, setRestaurantData2] = useState(null);
  const [resturantAllDetails, setRestaurantAllDetails] = useState([]);
  const [onOpenBottomSheet, setOnOpenBottomSheet] = useState(null);
  const [showSheet, setShowSheet] = useState(false);
  const [priceOfFood, setPriceofFood] = useState(null);
  const [bottomSheetImage, setBottomSheetImage] = useState(null);


  // const sheetRef = useRef(null);  // 👈 THIS IS REQUIRED

  // const openSheet = () => sheetRef.current?.expand();

  // if (onOpenBottomSheet === true){
  //   openSheet();
  // }


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
        height: "100%"
      }}
    >


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
      
      {restaurantData === null && <FoodDisplay
      nameOfResturant = {setRestaurantData}
      nameOfResturant2= {setRestaurantData2}
      />}


      
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
