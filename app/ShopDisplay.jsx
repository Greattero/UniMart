import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import Octicons from '@expo/vector-icons/Octicons';
import { child, get, getDatabase, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { app } from "./firebaseConfig.js"; // your firebaseConfig file
import RNPickerSelect from "react-native-picker-select";



export default function ShopDisplay({nameOfShop}){

   const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    });

    const db = getDatabase(app);

    const [shops, setShops] = React.useState([]);
    const [category, setCategory] = useState(null);


    // useEffect(() => {
    //   const fetchedFoods = async () => {
    //     const dbRef = ref(db);
    //     const snapshot = await get(child(dbRef, "restaurants"));

    //     if (snapshot.exists()) {
    //       const dataObj = snapshot.val();
    //       const dataArray = Object.keys(dataObj).map((key) => ({
    //         id: key,
    //         ...dataObj[key],
    //       }));
    //       console.log("Fetched shops:", dataArray);
    //       setShops(dataArray);
    //     } else {
    //       console.log("No data available");
    //     }
    //   };

    //   fetchedFoods();
    // }, []);


    useEffect(()=>{
        const fetchedContent = [
  { id: '1',  name: 'Nike',              price: 35,  image: require("../assets/images/jollof.jpg"),        category: "Fashion" },
  { id: '2',  name: 'Campus Books',      price: 20,  image: require("../assets/images/burger.jpg"),        category: "Books" },
  { id: '3',  name: 'Beauty Palace',     price: 30,  image: require("../assets/images/oilrice.jpg"),       category: "Cosmetics" },
  { id: '4',  name: 'Huawei Store',      price: 95,  image: require("../assets/images/landjollof.jpg"),    category: "Electronics" },
  { id: '5',  name: 'Royal Styles',      price: 75,  image: require("../assets/images/burger.jpg"),        category: "Fashion" },
  { id: '6',  name: 'General Mart',      price: 25,  image: require("../assets/images/landjollof.jpg"),    category: "Others" },
  { id: '7',  name: 'Console Center',    price: 300, image: require("../assets/images/landjollof.jpg"),    category: "Electronics" },
  { id: '8',  name: 'Makeup Planet',     price: 25,  image: require("../assets/images/burger.jpg"),        category: "Cosmetics" },
  { id: '9',  name: 'Gucci Shop',        price: 25,  image: require("../assets/images/landjollof.jpg"),    category: "Fashion" },
  { id: '10', name: 'Readers Hub',       price: 10,  image: require("../assets/images/jollof.jpg"),        category: "Books" },
  { id: '11', name: 'Air Force',         price: 50,  image: require("../assets/images/burger.jpg"),        category: "Fashion" },
  { id: '12', name: 'Tech Nation',       price: 220, image: require("../assets/images/landjollof.jpg"),    category: "Electronics" },
  { id: '13', name: 'Glow Haven',        price: 55,  image: require("../assets/images/landjollof.jpg"),    category: "Cosmetics" },
  { id: '14', name: 'Book Galaxy',       price: 18,  image: require("../assets/images/burger.jpg"),        category: "Books" },
  { id: '15', name: 'Vintage Closet',    price: 40,  image: require("../assets/images/landjollof.jpg"),    category: "Fashion" },
  { id: '16', name: 'Kivo Inc.',         price: 60,  image: require("../assets/images/landjollof.jpg"),    category: "Fashion" },
  { id: '17', name: 'Samsung Hub',       price: 120, image: require("../assets/images/oilrice.jpg"),       category: "Electronics" },
  { id: '18', name: 'Beauty SkinCo',     price: 60,  image: require("../assets/images/oilrice.jpg"),       category: "Cosmetics" },
  { id: '19', name: 'Elite Fashion',     price: 90,  image: require("../assets/images/jollof.jpg"),        category: "Fashion" },
  { id: '20', name: 'Modern Tech',       price: 110, image: require("../assets/images/oilrice.jpg"),       category: "Electronics" },

  // 21–40
  { id: '21', name: 'Balenciaga',        price: 80,  image: require("../assets/images/landjollof.jpg"),    category: "Fashion" },
  { id: '22', name: 'Writers Point',     price: 20,  image: require("../assets/images/oilrice.jpg"),       category: "Books" },
  { id: '23', name: 'Laptop Zone',       price: 420, image: require("../assets/images/landjollof.jpg"),    category: "Electronics" },
  { id: '24', name: 'Sneaker Plug',      price: 45,  image: require("../assets/images/jollof.jpg"),        category: "Fashion" },
  { id: '25', name: 'Skin Bliss',        price: 19,  image: require("../assets/images/landjollof.jpg"),    category: "Cosmetics" },
  { id: '26', name: 'Campus Gadgets',    price: 140, image: require("../assets/images/burger.jpg"),        category: "Electronics" },
  { id: '27', name: 'Face Care Shop',    price: 22,  image: require("../assets/images/jollof.jpg"),        category: "Cosmetics" },
  { id: '28', name: 'Apple Ghana',       price: 1500,image: require("../assets/images/burger.jpg"),        category: "Electronics" },
  { id: '29', name: 'Novel Empire',      price: 17,  image: require("../assets/images/jollof.jpg"),        category: "Books" },
  { id: '30', name: 'Urban Outfit',      price: 65,  image: require("../assets/images/oilrice.jpg"),       category: "Fashion" },
  { id: '31', name: 'Anua Beauty',       price: 8,   image: require("../assets/images/oilrice.jpg"),       category: "Cosmetics" },
  { id: '32', name: 'Volt Power Shop',   price: 90,  image: require("../assets/images/jollof.jpg"),        category: "Electronics" },
  { id: '33', name: 'Paper Corner',      price: 7,   image: require("../assets/images/jollof.jpg"),        category: "Books" },
  { id: '34', name: 'Diamond Fash',      price: 80,  image: require("../assets/images/oilrice.jpg"),       category: "Fashion" },
  { id: '35', name: 'Tech Warehouse',    price: 190, image: require("../assets/images/landjollof.jpg"),    category: "Electronics" },
  { id: '36', name: 'Shea Glow',         price: 33,  image: require("../assets/images/burger.jpg"),        category: "Cosmetics" },
  { id: '37', name: 'Elite Gadgets',     price: 250, image: require("../assets/images/burger.jpg"),        category: "Electronics" },
  { id: '38', name: 'Book Hive',         price: 12,  image: require("../assets/images/landjollof.jpg"),    category: "Books" },
  { id: '39', name: 'Classic Shoes',     price: 55,  image: require("../assets/images/jollof.jpg"),        category: "Fashion" },
  { id: '40', name: 'Nestle Ghana',      price: 40,  image: require("../assets/images/oilrice.jpg"),       category: "Others" },

  // 41–60
  { id: '41', name: 'Fashion Line',       price: 60, image: require("../assets/images/landjollof.jpg"), category: "Fashion" },
  { id: '42', name: 'Galaxy Electronics', price: 200,image: require("../assets/images/burger.jpg"),     category: "Electronics" },
  { id: '43', name: 'Glow Room',          price: 27, image: require("../assets/images/landjollof.jpg"), category: "Cosmetics" },
  { id: '44', name: 'Readers Stop',       price: 9,  image: require("../assets/images/oilrice.jpg"),    category: "Books" },
  { id: '45', name: 'Gadget Stop',        price: 155,image: require("../assets/images/jollof.jpg"),     category: "Electronics" },
  { id: '46', name: 'Smart Tech',         price: 260,image: require("../assets/images/jollof.jpg"),     category: "Electronics" },
  { id: '47', name: 'Beauty Works',       price: 28, image: require("../assets/images/oilrice.jpg"),    category: "Cosmetics" },
  { id: '48', name: 'Chic Closet',        price: 35, image: require("../assets/images/burger.jpg"),     category: "Fashion" },
  { id: '49', name: 'Book Villa',         price: 15, image: require("../assets/images/landjollof.jpg"), category: "Books" },
  { id: '50', name: 'Gadget Hub',         price: 180,image: require("../assets/images/burger.jpg"),     category: "Electronics" },
  { id: '51', name: 'Campus Wear',        price: 18, image: require("../assets/images/landjollof.jpg"), category: "Fashion" },
  { id: '52', name: 'Mega Electronics',   price: 310,image: require("../assets/images/jollof.jpg"),     category: "Electronics" },
  { id: '53', name: 'Sparkle Beauty',     price: 42, image: require("../assets/images/oilrice.jpg"),    category: "Cosmetics" },
  { id: '54', name: 'Fashion Hub',        price: 50, image: require("../assets/images/jollof.jpg"),     category: "Fashion" },
  { id: '55', name: 'Writer’s Den',       price: 11, image: require("../assets/images/burger.jpg"),     category: "Books" },
  { id: '56', name: 'Electric Palace',    price: 130,image: require("../assets/images/landjollof.jpg"), category: "Electronics" },
  { id: '57', name: 'Cosmetic Lane',      price: 24, image: require("../assets/images/oilrice.jpg"),    category: "Cosmetics" },
  { id: '58', name: 'Shoe Republic',      price: 49, image: require("../assets/images/landjollof.jpg"), category: "Fashion" },
  { id: '59', name: 'Readers Vault',      price: 16, image: require("../assets/images/jollof.jpg"),     category: "Books" },
  { id: '60', name: 'Universal Shop',     price: 33, image: require("../assets/images/burger.jpg"),     category: "Others" },

  // 61–80
  { id: '61', name: 'Tech Plug',          price: 270, image: require("../assets/images/jollof.jpg"),      category: "Electronics" },
  { id: '62', name: 'Beauty Secret',      price: 38,  image: require("../assets/images/oilrice.jpg"),      category: "Cosmetics" },
  { id: '63', name: 'Style Empire',       price: 72,  image: require("../assets/images/landjollof.jpg"),   category: "Fashion" },
  { id: '64', name: 'Book Tower',         price: 13,  image: require("../assets/images/jollof.jpg"),      category: "Books" },
  { id: '65', name: 'Tech Store',         price: 198, image: require("../assets/images/burger.jpg"),      category: "Electronics" },
  { id: '66', name: 'Cosmetic House',     price: 45,  image: require("../assets/images/jollof.jpg"),      category: "Cosmetics" },
  { id: '67', name: 'Premium Fashion',    price: 55,  image: require("../assets/images/oilrice.jpg"),      category: "Fashion" },
  { id: '68', name: 'Laptop City',        price: 520, image: require("../assets/images/burger.jpg"),      category: "Electronics" },
  { id: '69', name: 'Glow Beauty',        price: 20,  image: require("../assets/images/landjollof.jpg"),   category: "Cosmetics" },
  { id: '70', name: 'Book Nation',        price: 12,  image: require("../assets/images/jollof.jpg"),      category: "Books" },
  { id: '71', name: 'Urban Fashion',      price: 58,  image: require("../assets/images/burger.jpg"),      category: "Fashion" },
  { id: '72', name: 'Gadget World',       price: 340, image: require("../assets/images/jollof.jpg"),      category: "Electronics" },
  { id: '73', name: 'Beauty Bay',         price: 29,  image: require("../assets/images/oilrice.jpg"),      category: "Cosmetics" },
  { id: '74', name: 'Fitted Wear',        price: 37,  image: require("../assets/images/landjollof.jpg"),   category: "Fashion" },
  { id: '75', name: 'Book Corner',        price: 14,  image: require("../assets/images/jollof.jpg"),      category: "Books" },
  { id: '76', name: 'Top Electronics',    price: 260, image: require("../assets/images/landjollof.jpg"),   category: "Electronics" },
  { id: '77', name: 'Glow Center',        price: 34,  image: require("../assets/images/burger.jpg"),      category: "Cosmetics" },
  { id: '78', name: 'Street Fashion',     price: 44,  image: require("../assets/images/jollof.jpg"),      category: "Fashion" },
  { id: '79', name: 'Book Lab',           price: 18,  image: require("../assets/images/oilrice.jpg"),      category: "Books" },
  { id: '80', name: 'Easy Mall',          price: 27,  image: require("../assets/images/landjollof.jpg"),   category: "Others" },

  // 81–100
  { id: '81', name: 'Tech Pro',           price: 305, image: require("../assets/images/jollof.jpg"),      category: "Electronics" },
  { id: '82', name: 'Skin Glow',          price: 26,  image: require("../assets/images/burger.jpg"),      category: "Cosmetics" },
  { id: '83', name: 'Chic Boutique',      price: 48,  image: require("../assets/images/landjollof.jpg"),   category: "Fashion" },
  { id: '84', name: 'Book House',         price: 21,  image: require("../assets/images/oilrice.jpg"),      category: "Books" },
  { id: '85', name: 'Smart World',        price: 199, image: require("../assets/images/jollof.jpg"),      category: "Electronics" },
  { id: '86', name: 'Beauty Studio',      price: 32,  image: require("../assets/images/burger.jpg"),      category: "Cosmetics" },
  { id: '87', name: 'Fashion Zone',       price: 57,  image: require("../assets/images/landjollof.jpg"),   category: "Fashion" },
  { id: '88', name: 'Readers Room',       price: 17,  image: require("../assets/images/jollof.jpg"),      category: "Books" },
  { id: '89', name: 'Gadget Planet',      price: 370, image: require("../assets/images/burger.jpg"),      category: "Electronics" },
  { id: '90', name: 'Glow Shop',          price: 23,  image: require("../assets/images/oilrice.jpg"),      category: "Cosmetics" },
  { id: '91', name: 'Fashion Square',     price: 62,  image: require("../assets/images/landjollof.jpg"),   category: "Fashion" },
  { id: '92', name: 'Book Circle',        price: 16,  image: require("../assets/images/jollof.jpg"),      category: "Books" },
  { id: '93', name: 'Tech Experts',       price: 280, image: require("../assets/images/oilrice.jpg"),      category: "Electronics" },
  { id: '94', name: 'Beauty Heaven',      price: 40,  image: require("../assets/images/burger.jpg"),      category: "Cosmetics" },
  { id: '95', name: 'Urban Closet',       price: 50,  image: require("../assets/images/jollof.jpg"),      category: "Fashion" },
  { id: '96', name: 'Read & Write',       price: 10,  image: require("../assets/images/landjollof.jpg"),   category: "Books" },
  { id: '97', name: 'Digital Zone',       price: 310, image: require("../assets/images/burger.jpg"),      category: "Electronics" },
  { id: '98', name: 'Cosmetic X',         price: 43,  image: require("../assets/images/oilrice.jpg"),      category: "Cosmetics" },
  { id: '99', name: 'Fashion Depot',      price: 65,  image: require("../assets/images/jollof.jpg"),      category: "Fashion" },
  { id: '100', name: 'Prime Market',      price: 30,  image: require("../assets/images/landjollof.jpg"),   category: "Others" }
        ]

        setShops(fetchedContent);
    },[])

    if (!fontsLoaded) {
      return null; // or <ActivityIndicator />
    }


    return(
        <View>

                <Text style={styles.shopHeader}>All Shops</Text>
                <View style={styles.picker}>
                <RNPickerSelect
                onValueChange={(value) => setCategory(value)}

                items= {[
                    {label: "Fashion", value: "Fashion"},
                    {label: "Electronics", value: "Electronics"},
                    {label: "Cosmetics", value: "Cosmetics"},
                    {label: "Books", value: "Books"},
                    {label: "Others", value: "Others"}
                ]}
                placeholder={{label: "All", value: null}}
                style={{placeholder: {color:"black"}}}
                
                />
                </View>

                <FlatList
                data={shops}
                vertical
                scrollEnabled={true}  // 👈 add this
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item)=>item.id}
                contentContainerStyle={{paddingBottom: 80}}
                renderItem={({item}) => (

                    item.category === category || category === null ? (
                    <View>
                        
                        <Pressable onPress={()=>{console.log("kapa");
                                nameOfShop(item.name);
                                console.log(`eiiiiii ${item.name}`)
                            }} 
                            style={styles.shopCard}>
                            <Image source={item.image} style={styles.shopImage}/>
                        </Pressable>

                            <Text style={styles.shopName}>{item.name}</Text>
                        <View style={styles.starRating}>    
                            <Octicons name="star-fill" size={13} color="orange" />
                            <Text style={styles.rateDigit}>5.0</Text>       
                        </View>              
                    </View>)
                    :
                    null
                )}
                />
        </View>

    )
}

const styles = StyleSheet.create({
  shopHeader:{
    marginLeft: 10,
    marginTop: 20,
    marginBottom:10,
    color: "black",
    fontWeight: "bold",
    fontSize: 22,
  },
  shopCard:{
    width: 340,
    height: 140,
    borderRadius: 10
  },
  shopImage:{
    height:140,
    width: 340,
    marginLeft:0,
    borderRadius: 10
  },
  shopName:{
    marginTop: 5,
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
  },
  starRating:{
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  rateDigit:{
    marginLeft:5,
    color: "orange",
    fontFamily: "Montserrat_700Bold",
  },
  picker:{
    flex: 1,
    width: 100,
    position: "absolute",
    right: 0,
    marginTop: 8,
  },
  
});