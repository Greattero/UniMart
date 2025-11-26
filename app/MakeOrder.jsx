import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import BottomSheet from "@gorhom/bottom-sheet";
import { getDatabase, push, ref } from "firebase/database";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";


export default function MakeOrder({moveDisappearNavigatorSignal, getNameOfResturant, autoOpenFood, manuallyOpenFood, getFoodPrice, getRestaurantDataTransfer, onCloseCallback, getImage}) {
    const [list, setList] = useState();
    const sheetRef = useRef(null);
    const snapPoints = useMemo(() => ["85%"], []);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState(); 
    const [selectedFoodPrice, setSelectedFoodPrice] = useState(0);
    const [selectedFoodImage, setSelectedFoodImage] = useState();
    const [activateSheetManually, setActivateSheetManually] = useState(null);
    const [foodOfAutoOpen, setFoodForAutoOpen] = useState(null);
    const [resturantFullData, setResturantFullData] = useState([]);

    const db = getDatabase();



    const [checked, setChecked] = useState({});

    // const [sendDisappearNavigatorSignal, setSendDisappearNavigatorSinal] = useState(false);
        console.log(`eeee: ${getRestaurantDataTransfer}`)

    const toggleCheckbox = (id) => {
    setChecked((prev) => ({
        ...prev,
        [id]: !prev[id],
    }));
    };

    useEffect(() => {
          setActivateSheetManually(manuallyOpenFood)
    },[manuallyOpenFood])

    useEffect(() => {
          setFoodForAutoOpen(autoOpenFood)
    },[autoOpenFood])

      useEffect(() => {
        console.log(`eeee: ${getRestaurantDataTransfer}`)
          setResturantFullData(getRestaurantDataTransfer)
    },[getRestaurantDataTransfer])

    useEffect(() => {
      setSelectedFoodImage(getImage);
    },[getImage])

    const [totalPrice, setTotalPrice] = useState();       

  const openSheet = () => sheetRef.current?.expand();

  console.log(`confirm: ${activateSheetManually}`)

  useEffect(() => {
    if (foodOfAutoOpen || activateSheetManually) {
      // wait briefly so components mount first
      setTimeout(() => {
        openSheet(); // 👈 automatically open bottom sheet
      }, 300);
    }
  }, [foodOfAutoOpen, activateSheetManually]);


  
  const submitOrder = () => {

    push(ref(db, "buyer-profiles/Foster Ametepey-242424/purchases"),{
      foodName: activateSheetManually || foodOfAutoOpen,
      price: totalPrice,
      image: "photo"
    })

  }

  

// useEffect(() => {
//   setTimeout(() => {
//     openSheet(); // automatically open whenever this screen shows
//     console.log("chcahahahr")
//   }, 100);
// }, []); // runs only on mount

  // useEffect(() => {
  //   const fetchedList = [
  //       { id: 1, name: "Fried Plantain", price: 5 },
  //       { id: 2, name: "Grilled Chicken", price: 15 },
  //       { id: 3, name: "Fried Fish", price: 12 },
  //       { id: 4, name: "Beef Stew", price: 10 },
  //       { id: 5, name: "Gizzard Sauce", price: 8 },
  //       { id: 6, name: "Coleslaw", price: 5 },
  //       { id: 7, name: "Boiled Egg", price: 4 },
  //       { id: 8, name: "Extra Jollof Scoop", price: 6 },
  //       ]


  //   setList(fetchedList);
  // },[])
      console.log(`yyyyy ${getRestaurantDataTransfer}`)
      console.log(` bbbb ${manuallyOpenFood}`)
      useEffect(() => {
        const selectedFood = activateSheetManually || foodOfAutoOpen;

        if (selectedFood && Array.isArray(resturantFullData)) {
          const match = resturantFullData.find(item => item[selectedFood]);

          if (match) {
            const addOns = match[selectedFood].map((item, idx) => ({
              id: idx.toString(), // or use a real ID if you have one
              ...item,
            }));
            setList(addOns);
            console.log("Found:", addOns);
          } else {
            setList([]);
            console.log("No match found");
          }
        }
      }, [resturantFullData, activateSheetManually, foodOfAutoOpen]);



  // console.log(`hmmm ${getNameOfResturant}`)

    useEffect(()=>{
    const totalCalculation = list
      ?.filter(item => checked[item.id]) // only selected items
      .reduce((sum, item) => sum + item.price, getFoodPrice) // sum up prices

    setTotalPrice(totalCalculation)
    console.log(`pricee ${getFoodPrice}`)
    },[totalPrice,checked,getFoodPrice]) 


    // useEffect(() => {
    // moveDisappearNavigatorSignal(sendDisappearNavigatorSignal);
    // }, [sendDisappearNavigatorSignal]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <View style={{ flex: 1 }}>
        {/* <ResturantContent 
        onOpen={openSheet}
        foodNameSelected={setSelectedFood}
        // foodPictureSelected={setSelectedFoodImage}
        disappearNavigator={setSendDisappearNavigatorSinal}
        nameOfResturant={getNameOfResturant}
        />
         */}

        {/* Gray overlay behind sheet */}
        {isOpen && (
          <Pressable
            style={styles.overlay}
            onPress={() => sheetRef.current?.close()}
          />
        )}

        <BottomSheet
          ref={sheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          enableDynamicSizing={false}
          handleComponent={null}             // remove the handle itself
          // backgroundStyle={styles.bottomSheetContainer}
          onChange={(index) => setIsOpen(index !== -1)} // track open/close
          onClose={()=>{
            setChecked({});
            setActivateSheetManually(false);
            setIsOpen(false); // make sure this is reset
            onCloseCallback?.(); // new prop from parent
          }}
          style={styles.bottomSheetContainer}
        >


          <View>

            <Image 
            source={{uri:selectedFoodImage}}
            style={styles.image}
            />

            <FlatList
            data = {list}
            vertical
            showsVerticalScrollIndicator = {false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{paddingBottom: 200}}
            renderItem={({item}) => (
                <View style={styles.checkboxContainer}>
                <Pressable
                onPress={() => toggleCheckbox(item.id)}
                style={styles.pressableContainer}
                >

                    {checked[item.id] ? (
                    <>
                    <MaterialCommunityIcons 
                    name="checkbox-marked" 
                    size={24} 
                    color="green" 
                    style={styles.checkboxBox}
                    />
                    
                   {console.log(totalPrice)}

                     <Text style={styles.checkboxFoodName}>{item.name}</Text>
                     </>
                ) :
                    
                    (
                    <>
                    <MaterialCommunityIcons 
                    name="checkbox-blank-outline" 
                    size={24} 
                    color="green" 
                    style={styles.checkboxBox}                    
                    />
      
                    
                     <Text style={styles.checkboxFoodName}>{item.name}</Text>
                     </>
                    )}

                </Pressable>
                    {/* <Text style={styles.checkboxFoodName}>{item.name}</Text> */}
                    <Text style={styles.checkboxFoodPrice}>GH₵ {item.price.toFixed(2)}</Text>
                </View>


                
            )}            
            />
            {/* <View style={styles.priceDisplayContainer}>
              <View style={styles.cediContainer}>
                <Text style={styles.priceTag}>
                  GH₵ {totalPrice ?? getFoodPrice ?? 0}
                </Text>
              </View>
              <TouchableOpacity style={styles.addToOrderContainer}>
                <Text style={styles.addToOrder}>ADD TO ORDER</Text>
              </TouchableOpacity>
            </View>             */}
          </View>
        </BottomSheet>
              <View style={styles.priceDisplayContainer}>
              <View style={styles.cediContainer}>
                <Text style={styles.priceTag}>
                  GH₵ {totalPrice ?? getFoodPrice ?? 0}
                </Text>
              </View>
              <TouchableOpacity 
              onPress={()=>submitOrder()}
              style={styles.addToOrderContainer}>
                <Text style={styles.addToOrder}>ADD TO ORDER</Text>
              </TouchableOpacity>
            </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer:{
    borderTopLeftRadius: 30,   // 👈 round left corner
    borderTopRightRadius: 25,  // 👈 round right corner
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)", // gray/black transparent background
  },
  checkboxContainer:{
    flexDirection: "row",
    marginBottom: 30,
    paddingTop: 25,
    borderTopWidth: 2,
    borderTopColor: "#F8F8F8",
  },
  checkboxFoodName:{
    marginLeft: 10,
    marginTop: 5,
  },
  checkboxFoodPrice:{
    position: "absolute",
    marginTop: 28,
    right: 10,
    color: "red",
  },
  checkboxBox:{
    marginLeft: 10,
    marginTop:3,
  },
  image:{
    height: "20%",
    width: "100%",
    alignSelf:"center",
    borderTopLeftRadius: 15,   // 👈 match the sheet curve
    borderTopRightRadius: 15,
    
  },
  pressableContainer:{
    flexDirection: "row",
  },
  priceDisplayContainer:{
    flexDirection: "row",
    flex:1,
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    height: 70,
    width:"100%",
    elevation: 15,
  },
  cediContainer:{
    marginLeft: 25,
    marginTop: 12,
    height: 40,
    width: 105,
    backgroundColor:"#FFD700",
    borderRadius: 5,

  },
  priceTag:{
    paddingLeft:20,
    paddingTop: 5,
    fontSize: 18,
    color:"#800020",
    fontWeight: "bold",

  },
  addToOrder:{
    paddingLeft:17,
    paddingTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "white"

  },
  addToOrderContainer:{
    marginLeft:65,
    marginTop: 12,
    height: 40,
    width: 150, 
    backgroundColor:"rgba(45, 202, 171, 1)",
    borderRadius: 5,

  }
  
});
