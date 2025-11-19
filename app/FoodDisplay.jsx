import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import Octicons from '@expo/vector-icons/Octicons';
import { child, get, getDatabase, ref } from "firebase/database";
import React, { useEffect } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { app } from "./firebaseConfig.js"; // your firebaseConfig file


export default function FoodDisplay({nameOfResturant, nameOfResturant2}){

   const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    });

  const db = getDatabase(app);



    const [rice, setRice] = React.useState([]);
    const [resturants, setResturants] = React.useState([]);

    useEffect(() => {
      const fetchedFoods = async () => {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, "foodDisplay"));

        if (snapshot.exists()) {
          const dataObj = snapshot.val();
          const dataArray = Object.keys(dataObj).map((key) => ({
            id: key,
            ...dataObj[key],
          }));
          console.log("Fetched foods:", dataArray);
          setRice(dataArray);
        } else {
          console.log("No data available");
        }
      };

      fetchedFoods();
    }, []);


    useEffect(() => {
      const fetchedFoods = async () => {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, "restaurants"));

        if (snapshot.exists()) {
          const dataObj = snapshot.val();
          const dataArray = Object.keys(dataObj).map((key) => ({
            id: key,
            ...dataObj[key],
          }));
          console.log("Fetched resturant:", dataArray);
          setResturants(dataArray);
        } else {
          console.log("No data available");
        }
      };

      fetchedFoods();
    }, []);

    if (!fontsLoaded) {
      return null; // or <ActivityIndicator />
    }


    return(
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 80}}
        >
            <View>

                <Text style={styles.foodHeader}>Rice Dishes</Text>

                <FlatList
                data = {rice}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                contentContainerStyle = {{paddingHorizontal: 10}}
                renderItem={({item}) => (
                    <View>
                        <View style={styles.card}>
                            <Image source={{uri: item.image}} style={styles.image}/>
                            <Pressable onPress={()=>{console.log("Hiii");
                                nameOfResturant({
                                resturant: item.restaurantName,
                                foodPrice: item.price,
                                autoOpenFood: item.name, // 👈 include which food triggered it
                              });
                            }} 
                            style={styles.addBtn}>
                                <Text style={styles.addText}>+</Text>
                            </Pressable>
                        </View>
                        
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.resturant}>{item.restaurantName}</Text>
                            <Text style={styles.price}>{item.price}</Text>
                            
                    </View>

                )}
                />

                <Text style={styles.foodHeader}>Staple Dishes</Text>

                <FlatList
                data={rice}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item)=>item.id}
                contentContainerStyle={{paddingHorizontal: 10}}
                renderItem={({item}) => (
                    <View>
                        <View style={styles.card}>
                            <Image source={item.image} style={styles.image}/>
                            <Pressable onPress={()=>{console.log("Hiii");
                                nameOfResturant({
                                resturant: item.resturant,
                                autoOpenFood: item.name, // 👈 include which food triggered it
                              });
                            }} 
                            style={styles.addBtn}>
                                <Text style={styles.addText}>+</Text>
                            </Pressable>
                        </View>
                        
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.resturant}>{item.resturant}</Text>
                            <Text style={styles.price}>{item.price}</Text>
                            
                    </View>
                    
                )}
                />


                <Text style={styles.foodHeader}>Snackies</Text>

                <FlatList
                data={rice}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item)=>item.id}
                contentContainerStyle={{paddingHorizontal: 10}}
                renderItem={({item}) => (
                    <View>
                        <View style={styles.card}>
                            <Image source={item.image} style={styles.image}/>
                            <Pressable onPress={()=>{console.log("Hiii");
                                nameOfResturant({
                                resturant: item.resturant,
                                autoOpenFood: item.name, // 👈 include which food triggered it
                              });
                            }} 
                            style={styles.addBtn}>
                                <Text style={styles.addText}>+</Text>
                            </Pressable>
                        </View>
                        
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.resturant}>Jesi Dish</Text>
                            <Text style={styles.price}>{item.price}</Text>
                            
                    </View>
                )}
                />

                <Text style={styles.foodHeader}>All Resturants</Text>

                <FlatList
                data={resturants}
                vertical
                scrollEnabled={false}  // 👈 add this
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item)=>item.id}
                contentContainerStyle={{padding: 10}}
                renderItem={({item}) => (
                    <View>
                        <Pressable onPress={()=>{console.log("hipi");
                                nameOfResturant2(item.id);
                                console.log(`eiiiiii ${item.id}`)
                            }} 
                            style={styles.resturantCard}>
                            <Image source={{uri:item.coverPhoto}} style={styles.resturantImage}/>
                        </Pressable>

                            <Text style={styles.resturantName}>{item.id}</Text>
                        <View style={styles.starRating}>    
                            <Octicons name="star-fill" size={13} color="orange" />
                            <Text style={styles.rateDigit}>5.0</Text>       
                        </View>              
                    </View>
                )}
                />

            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
  card: {
    width: 130,
    height:110,
    backgroundColor: '#f8f7f7ff',
    borderRadius: 10,
    marginRight: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  name: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  price: {
    color: '#e62513ff',
  },
  resturant:{
    color:'#918c8cff',
  },
  foodHeader:{
    marginLeft: 10,
    marginTop: 20,
    marginBottom:10,
    color: "black",
    fontWeight: "bold",
    fontSize: 22,
  },
  addBtn:{
    flex: 1,
    position: "absolute",
    backgroundColor:"#0fa872ff",
    borderRadius: 10,
    padding:15,
    width: 30,
    height: 30,
    top: 5,
    right: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: -23,
    paddingRight: -10,
  },
  addText:{
    color: "white",
    right: 7,
    top: 5
  },
  resturantCard:{
    width: 340,
    height: 140,
    borderRadius: 10

  },
  resturantImage:{
    height:140,
    width: 340,
    marginLeft:0,
    borderRadius: 10

  },
  resturantName:{
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
  }
  
});