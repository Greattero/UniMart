import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import BottomSheet from "@gorhom/bottom-sheet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, push, ref,update } from "firebase/database";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";


export default function MakeOrder({disappearNavigator, getNameOfResturant, 
                                  autoOpenFood, manuallyOpenFood, 
                                  getFoodPrice, getRestaurantDataTransfer, 
                                  onCloseCallback, getImage,
                                  setNotify, getMyProfile,
                                  getSellerProfile, getMyContact,
                                getMyName}) {
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
    const [myProfile, setMyProfile] = useState("");
    const [sellerProfile, setSellerProfile] = useState("");
    const [myContact, setMyContact] = useState("");
    const [myName, setMyName] = useState("");

    const db = getDatabase();



    const [checked, setChecked] = useState({});
    const [chosenAddOns, setChosenAddons] = useState([])

    // const [sendDisappearNavigatorSignal, setSendDisappearNavigatorSinal] = useState(false);
        console.log(`eeee: ${getRestaurantDataTransfer}`)

    const toggleCheckbox = (id) => {
    setChecked((prev) => ({
        ...prev,
        [id]: !prev[id],
    }));
    };

    useEffect(()=>{
      setMyName(getMyName)
    },[getMyName])

    useEffect(()=>{
      setMyContact(getMyContact)
    },[getMyContact])

    useEffect(()=>{
      setMyProfile(getMyProfile)
    },[getMyProfile])

    useEffect(()=>{
        setSellerProfile(getSellerProfile)
    },[getSellerProfile]);

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

    console.log("jkl: ",JSON.stringify(resturantFullData))
    const [totalPrice, setTotalPrice] = useState();       

  const openSheet = () => {sheetRef.current?.expand();
            disappearNavigator?.(true)
console.log("navigation has to disappear")
  };

  console.log(`confirm: ${activateSheetManually}`)

  useEffect(() => {
    const foodToSelect = manuallyOpenFood ?? autoOpenFood;
    if (foodToSelect) {
      setSelectedFood(foodToSelect);
      setTimeout(() => {
        openSheet();
      }, 300);
    }
  }, [manuallyOpenFood, autoOpenFood]);

  console.log("whatsapp",myContact);
  console.log("namee:", myName);

  
  const submitOrder = async () => {

    const path = String(Math.floor(1 + Math.random() * 9000));

    try{
      await update(ref(db, `buyer-profiles/${myProfile}/purchases/${path}`),{
        foodName: activateSheetManually || foodOfAutoOpen,
        price: totalPrice,
        addOns: checked,
        image: selectedFoodImage,
        status: "awaiting",
        rated: false,
        seller: sellerProfile,
    })

      await update(ref(db, `restaurants/${sellerProfile}/myOrders/${path}`),{
        foodName: activateSheetManually || foodOfAutoOpen,
        price: totalPrice,
        addOns: checked,
        image: selectedFoodImage,
        seller: sellerProfile,
        date: new Date().toISOString().split("T")[0],
        contact: myContact,
        orderId: `UM${String(Date.now()).slice(-4)}`,
        buyer: myName,
        buyerProfile: myProfile,
        status: "awaiting",


    })
      
      await AsyncStorage.setItem("notify", "true");
      setNotify(true);
  }
  catch(err){
    console.log(err);
    await AsyncStorage.removeItem("notify");
    setNotify(false);
  }

  }

  

      // console.log(`yyyyy ${getRestaurantDataTransfer}`)
      // console.log(` bbbb ${manuallyOpenFood}`)          
      // console.log('kakakak',selectedFood)
      // console.log("ewww: ",JSON.stringify(resturantFullData))

      console.log("things",checked);
      console.log("Chosen", chosenAddOns);


      useEffect(() => {

        if (selectedFood && Object.keys(resturantFullData).length > 0) {
          const match = resturantFullData[selectedFood]; // <-- dynamic key
          console.log('fghg',selectedFood);
          console.log("vvvvv: ", match);

          // if (match) {
          //   // const addOns = match[selectedFood].map((item, idx) => ({
          //   //   id: idx.toString(), // or use a real ID if you have one
          //   //   ...item,
          //   // }));
            setList(match);
          //   console.log("Found:", addOns);
          // } else {
          //   setList([]);
          //   console.log("No match found");
          // }
        }
      }, [resturantFullData, activateSheetManually, foodOfAutoOpen]);



  // console.log(`hmmm ${getNameOfResturant}`)

    useEffect(()=>{
    const totalCalculation = list
      ?.filter(item => checked[item.name]) // only selected items
      .reduce((sum, item) => sum + item.price, getFoodPrice) // sum up prices

    const filteredAddOns = Object.keys(checked).filter(key=>checked[key]);
    setChosenAddons(filteredAddOns);

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
        {console.log("🥺🥺", myProfile)}
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
                onPress={() => toggleCheckbox(item.name)}
                style={styles.pressableContainer}
                >

                    {checked[item.name] ? (
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
    marginLeft:70,
    marginTop: 12,
    height: 40,
    width: 145, 
    backgroundColor:"rgba(45, 202, 171, 1)",
    borderRadius: 5,

  }
  
});
