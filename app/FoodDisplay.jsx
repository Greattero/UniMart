import React, { useEffect } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function FoodDisplay(){

    const [rice, setRice] = React.useState([]);

    useEffect(()=>{
    const fetchedFoods = [
      { id: '1', name: 'Burger', price: '₵25', image: require("../assets/images/burger.jpg")},
      { id: '2', name: 'Pizza', price: '₵40', image: require("../assets/images/burger.jpg") },
      { id: '3', name: 'Burger', price: '₵25', image: require("../assets/images/burger.jpg")},
      { id: '4', name: 'Pizza', price: '₵40', image: require("../assets/images/burger.jpg") },
      { id: '5', name: 'Burger', price: '₵25', image: require("../assets/images/burger.jpg")},
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
  }
  
});