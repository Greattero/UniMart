import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import Octicons from '@expo/vector-icons/Octicons';
import React, { useEffect } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";


export default function FoodDisplay(){

   const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    });


    const [rice, setRice] = React.useState([]);

    useEffect(()=>{
    const fetchedFoods = [
      { id: '1', name: 'Burger', price: '₵25', image: require("../assets/images/landjollof.jpg")},
      { id: '2', name: 'Pizza', price: '₵40', image: require("../assets/images/oilrice.jpg") },
      { id: '3', name: 'Burger', price: '₵25', image: require("../assets/images/landjollof.jpg")},
      { id: '4', name: 'Pizza', price: '₵40', image: require("../assets/images/oilrice.jpg") },
      { id: '5', name: 'Burger', price: '₵25', image: require("../assets/images/landjollof.jpg")},
      { id: '6', name: 'Pizza', price: '₵40', image: require("../assets/images/jollof.jpg") },
      { id: '7', name: 'Burger', price: '₵25', image: require("../assets/images/burger.jpg")},
      { id: '8', name: 'Pizza', price: '₵40', image: require("../assets/images/burger.jpg") },
      { id: '9', name: 'Burger', price: '₵25', image: require("../assets/images/burger.jpg")},
      { id: '10', name: 'Pizza', price: '₵40', image: require("../assets/images/burger.jpg") },
      { id: '11', name: 'Burger', price: '₵25', image: require("../assets/images/burger.jpg")},
      { id: '12', name: 'Pizza', price: '₵40', image: require("../assets/images/burger.jpg") },
    ];

    setRice(fetchedFoods);

    },[])

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
                            <Image source={item.image} style={styles.image}/>
                            <Pressable onPress={()=>console.log("Hiii")} 
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
                            <Pressable onPress={()=>console.log("Hiii")} 
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
                            <Pressable onPress={()=>console.log("Hiii")} 
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
                data={rice}
                vertical
                scrollEnabled={false}  // 👈 add this
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item)=>item.id}
                contentContainerStyle={{padding: 10}}
                renderItem={({item}) => (
                    <View>
                        <View style={styles.resturantCard}>
                            <Image source={item.image} style={styles.resturantImage}/>
                        </View>

                            <Text style={styles.resturantName}>Jesi Dish</Text>
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