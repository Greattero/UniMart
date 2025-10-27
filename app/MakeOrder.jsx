import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import ResturantContent from "./ResturantContent.jsx";

export default function MakeOrder({moveDisappearNavigatorSignal}) {
    const [list, setList] = useState();
    const sheetRef = useRef(null);
    const snapPoints = useMemo(() => ["85%"], []);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState(); 


    const [checked, setChecked] = useState({});

    const [sendDisappearNavigatorSignal, setSendDisappearNavigatorSinal] = useState(false);

    const toggleCheckbox = (id) => {
    setChecked((prev) => ({
        ...prev,
        [id]: !prev[id],
    }));
    };




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


    useEffect(() => {
    moveDisappearNavigatorSignal(sendDisappearNavigatorSignal);
    }, [sendDisappearNavigatorSignal]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ResturantContent 
        onOpen={openSheet}
        foodSelected={setSelectedFood}
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
          onChange={(index) => setIsOpen(index !== -1)} // track open/close
        //   onClose={setSendDisappearNavigatorSinal(false)}
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
            contentContainerStyle={{paddingBottom: 10}}
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
            <Text>Sheet Content: {selectedFood}</Text>
            
          </View>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
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
  },
  pressableContainer:{
    flexDirection: "row",
  }
});
