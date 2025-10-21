import { Ionicons } from "@expo/vector-icons"; // ✅ correct import
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const navWidth = Dimensions.get("window").width;
const navHeight = Dimensions.get("window").height;

export default function Navigation(){

    const [active, setActive] = React.useState("home")
 
    
    
    return (
        <View style={styles.container}>
            <TouchableOpacity
             style={[styles.btn, active === "home" && styles.btnPressed]}
             onPress={()=>setActive("home")}>
                <Ionicons name={active === "home" ? "home" : "home-outline"} size={24} color={active === "home" ? "rgba(32, 93, 63, 1)" : "black"} />
                <Text style={[{fontFamily:"Poppins_500Medium"}, active === "home" && styles.textPressed]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={[styles.btn, active === "search" && styles.btnPressed]}
            onPress={()=>setActive("search")}>
                <Ionicons name={active === "search" ? "search": "search-outline"} size={24} color={active === "search" ? "rgba(32, 93, 63, 1)" : "black"} />
                <Text style={[{fontFamily:"Poppins_500Medium"}, active === "search" && styles.textPressed]}>Search</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={[styles.btn, active === "cart" && styles.btnPressed]}
            onPress={()=>setActive("cart")}>
                <Ionicons name={active === "cart" ? "cart" : "cart-outline"} size={24} color={active === "cart" ? "rgba(32, 93, 63, 1)" : "black"} />
                <Text style={[{fontFamily:"Poppins_500Medium"}, active === "cart" && styles.textPressed]}>Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={[styles.btn, active === "person" && styles.btnPressed]}
            onPress={()=>setActive("person")}>
                <Ionicons name={active === "person" ? "person" : "person-outline"} size={24} color={active === "person" ? "rgba(32, 93, 63, 1)" : "black"} />
                <Text style={[{fontFamily:"Poppins_500Medium"}, active === "person" && styles.textPressed]}>Profile</Text>
            </TouchableOpacity>
        
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flexDirection: "row",
        justifyContent:"space-evenly",
        alignItems: "center",
        backgroundColor: "white",
        width: navWidth,
        height: navHeight * 0.09,
        position: "absolute",
        bottom: 0,
        elevation: 20,
    },

    btn:{
        alignItems:"center",
        width:70
    },

    btnPressed:{
        alignItems:"center",
        backgroundColor:"rgba(70, 180, 127, 0.28)",
        borderRadius:12,
        width:70,
    },

    textPressed:{
        fontWeight:"bold",
        color: "rgba(32, 93, 63, 1)",
        fontFamily: "Poppins_500Medium",
    }

})