import {
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    useFonts,
} from "@expo-google-fonts/montserrat";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { get, getDatabase, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { app } from "./firebaseConfig";


export default function ShopContent({manuallyOpenSheet,  disappearNavigator, getShopName, setShopDataTransfer,sendImage}){
   const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    });


    const [content, setContent] = useState([]);

    // useEffect(()=>{
    //     const fetchedContent = [
    //   { id: '1', name: 'Burger', price: 25, image: require("../assets/images/landjollof.jpg")},
    //   { id: '2', name: 'Pizza', price: 40, image: require("../assets/images/oilrice.jpg") },
    //   { id: '3', name: 'Burger', price: 60, image: require("../assets/images/landjollof.jpg")},
    //   { id: '4', name: 'Pizza', price: 8, image: require("../assets/images/oilrice.jpg") },
    //   { id: '5', name: 'Burger', price: 80, image: require("../assets/images/landjollof.jpg")},
    //   { id: '6', name: 'Pizza', price: 35, image: require("../assets/images/jollof.jpg") },
    //   { id: '7', name: 'Burger', price: 50, image: require("../assets/images/burger.jpg")},   
        
    //     ]

    //     setContent(fetchedContent);
    // },[])


    useEffect(() => {
    const fetchShops = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "shops");

        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
        const data = snapshot.val(); // this is an object
        const shopsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
        }));

        setShopDataTransfer?.(shopsArray);
        console.log(`eeee: ${shopsArray}`)


        // Now find the restaurant that matches
        const foundShop = data[getShopName]

        // If it has foods, set them as content
        if (foundShop && foundShop.items) {
            const itemsArray = foundShop.items.map((item, index) => ({
                id: index.toString(),
                ...item,
            }));
            setContent(itemsArray);
            console.log(`yooo ${itemsArray[0].name}`)
        } else {
            setContent([]);
        }
        } else {
        setContent([]);
        }
    };

    fetchShops();
    }, [getShopName]);


    if (!fontsLoaded) {
      return null; // or <ActivityIndicator />
    }

console.log("onOpen:", manuallyOpenSheet);

    
    return(
        <View>
                    
            <Image source={require("../assets/images/landjollof.jpg")} style={styles.resturantPicture}/>
            <View style={styles.resturantDetailsContainer}>
                <Text style={styles.resturantName}>{getShopName}</Text>
                <View style={styles.delivery}>
                    <MaterialIcons name="delivery-dining" size={21} color="#d8d3d3ff" />
                    <Text style={styles.otherResturantDetails}>30min delivery</Text>
                </View >
                <View style={styles.delivery}>
                    <FontAwesome6 name="cedi-sign" size={16} color="#d8d3d3ff" />
                    <Text style={[styles.otherResturantDetails,{marginLeft:23}]}>GH₵ 20.00 to GH₵ 30.00</Text>
                </View>
                <View style={styles.delivery}>
                    <Octicons name="star-fill" size={13} color="orange" />
                    <Text style={[styles.otherResturantDetails,{marginTop:-2, marginLeft:23}]}>5.0 {"(20)"}</Text>
                </View>                        
            </View>

            <FlatList
            data={content}
            vertical
            showsVerticalScrollIndicator={false}
            keyExtractor={(item)=>item.id}
            contentContainerStyle={{paddingBottom: 20}}
            renderItem={({item}) => (
                <Pressable 
                style={styles.menuContainer}
                onPress={() => {manuallyOpenSheet(item.name); // reverse to true if doesnt work
                    disappearNavigator?.(true);
                    sendImage(item.image);
                }}
                >
                    <Text style={[styles.menuDetails,{fontSize:20,fontWeight:"bold"}]}>{item.name}</Text>
                    {/* <Text style={styles.menuDetails}>₵{item.price}</Text> */}
                    <View style={styles.menuPictureContainer}>
                        <Image source={{uri:item.image}} style={styles.menuPicture}/>
                    </View>

                </Pressable>
            )}
            
            />
            
        </View>
    )
}

const styles = StyleSheet.create({
    resturantPicture:{
        height:140,
        marginBottom:150,
        backgroundColor:"red",

    },
    resturantDetailsContainer:{
        flex: 1,
        backgroundColor: "white",
        paddingLeft: 10,
        paddingTop: 10,
        width: 330,
        height: 160,
        marginLeft: 15,
        position:"absolute",
        marginTop:120,
        borderRadius: 15,
        borderWidth:1,
        borderColor: "#efebebff"
    },
    resturantName:{
        fontSize: 25,
        fontWeight: "bold",
    },
    delivery:{
        flexDirection: "row",
        marginTop: 11,
    },
    otherResturantDetails:{
        fontFamily: "Montserrat_400Regular",
        marginLeft:15,

    },
    menuContainer:{
        marginBottom: 25,
        marginLeft:19,
        marginRight:19,
        height: 120,
        marginTop:10,
        borderBottomWidth: 1,
        borderColor: "#d8d3d3ff",

    },
    
    menuPicture:{
    width: "80%",
    height: "80%",
    
    },
    menuPictureContainer:{
        backgroundColor:"#f5f1f1ff",
        width: 80,
        height: 80,
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        right: 0,
        borderRadius: 15,
        marginTop:2,       
    },
    menuDetails:{
        marginTop: 8,

    }
    
    
})