import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import ResturantContent from "./ResturantContent.jsx";

export default function MakeOrder({moveDisappearNavigatorSignal}) {
    const [list, setList] = useState();
    const sheetRef = useRef(null);
    const snapPoints = useMemo(() => ["85%"], []);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState(); 
    const [selectedFoodPrice, setSelectedFoodPrice] = useState(0);


    const [checked, setChecked] = useState({});

    const [sendDisappearNavigatorSignal, setSendDisappearNavigatorSinal] = useState(false);

    const toggleCheckbox = (id) => {
    setChecked((prev) => ({
        ...prev,
        [id]: !prev[id],
    }));
    };


    const [totalPrice, setTotalPrice] = useState();       

  const openSheet = () => sheetRef.current?.expand();

  useEffect(() => {
    const fetchedList = [
        { id: 1, name: "Fried Plantain", price: 5 },
        { id: 2, name: "Grilled Chicken", price: 15 },
        { id: 3, name: "Fried Fish", price: 12 },
        { id: 4, name: "Beef Stew", price: 10 },
        { id: 5, name: "Gizzard Sauce", price: 8 },
        { id: 6, name: "Coleslaw", price: 5 },
        { id: 7, name: "Boiled Egg", price: 4 },
        { id: 8, name: "Extra Jollof Scoop", price: 6 },
        ]


    setList(fetchedList);
  },[])


    useEffect(()=>{
    const totalCalculation = list
      ?.filter(item => checked[item.id]) // only selected items
      .reduce((sum, item) => sum + item.price, selectedFoodPrice) // sum up prices

    setTotalPrice(totalCalculation)
    },[totalPrice,checked,selectedFoodPrice]) 


    useEffect(() => {
    moveDisappearNavigatorSignal(sendDisappearNavigatorSignal);
    }, [sendDisappearNavigatorSignal]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ResturantContent 
        onOpen={openSheet}
        foodSelected={setSelectedFood}
        foodPriceSelected={setSelectedFoodPrice}
        disappearNavigator={setSendDisappearNavigatorSinal}
        />
        

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
          onClose={()=>{setSendDisappearNavigatorSinal(false);
            setChecked({});
          }}
          style={styles.bottomSheetContainer}
        >


          <View>

            <Image 
            source={require("../assets/images/oilrice.jpg")}
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
            <View style={styles.priceDisplayContainer}>
              <View style={styles.cediContainer}>
                <Text style={styles.priceTag}>
                  GH₵ {totalPrice === 0 ? selectedFoodPrice: totalPrice}
                </Text>
              </View>
              <TouchableOpacity style={styles.addToOrderContainer}>
                <Text style={styles.addToOrder}>ADD TO ORDER</Text>
              </TouchableOpacity>
            </View>            
          </View>
        </BottomSheet>
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
    backgroundColor: "white",
    position: "absolute",
    bottom: 130,
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
