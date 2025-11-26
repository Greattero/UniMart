import { get, getDatabase, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { app } from "./firebaseConfig";


export default function Purchases(){

    const [getPurchases, setGetPurchases] = useState(null);

    useEffect(() => {
    const fetchProfiles = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "buyer-profiles");

        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
        const data = snapshot.val(); // this is an object
        // const shopsArray = Object.keys(data).map((key) => ({
        //     id: key,
        //     ...data[key],
        // }));

        // console.log(`eeee: ${shopsArray}`)


        // Now find the restaurant that matches
        const foundProfile = data["Foster Ametepey-242424"]

        // If it has foods, set them as content
        if (foundProfile && foundProfile.purchases) {
            const purchasesArray = Object.keys(foundProfile.purchases).map(key => ({
                id: key,
                ...foundProfile.purchases[key],
            }));
            setGetPurchases(purchasesArray);
            // console.log(JSON.stringify(purchasesArray, null, 2));
        } else {
            setGetPurchases([]);
        }
        } else {
        setGetPurchases([]);
        }
    };

    fetchProfiles();
    }, []);



    return(

        <View style={styles.purchaseContainer}>

            <Text style={styles.heading}>Purchases</Text>
            {/* <View style={styles.container}>
                <Text style={styles.foodName}>Jollof Rice</Text>
                <Text style={styles.price}>GH₵ 50</Text>
            </View>
            <View style={styles.confirmationPanel}>
                <Text> 
                    Order received?
                </Text>
                <TouchableOpacity style={styles.confirmBtn}>
                    <Text style={styles.confirmText}>Confirm</Text>
                </TouchableOpacity>
            </View> */}


            <FlatList
            data={getPurchases}
            vertical
            showsVerticalScrollIndicator
            keyExtractor={(item)=>item.id}
            contentContainerStyle={{paddingBottom: 110}}
            renderItem={({item}) => (
                <>
                <View style={styles.container}>
                    <Text style={styles.foodName}>{item.foodName}</Text>
                    <Text style={styles.price}>GH₵ {item.price}</Text>
                </View>
                <View style={styles.confirmationPanel}>
                    <Text> 
                        Order received?
                    </Text>
                    <TouchableOpacity style={styles.confirmBtn}>
                        <Text style={styles.confirmText}>Confirm</Text>
                    </TouchableOpacity>
                
                    <TouchableOpacity style={styles.cancelBtn}>
                        <Text style={styles.confirmText}>Cancel Order</Text>
                    </TouchableOpacity>
                </View>
            </>

            )}
            
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        borderWidth: 0,
        width: 350,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: "rgba(32, 35, 93, 1)",
        elevation: 6,
        height: 100,
        marginTop: 5,
    },
    foodName:{
        paddingBottom: 25,
        paddingTop: 6,
        paddingLeft: 5,
        fontSize: 20,
        fontWeight: "bold",
        color: "white"
    },
    price:{
        color: "rgba(214, 208, 14, 1)",
        paddingLeft: 5,

    },
    confirmationPanel:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent:"space-between",
        backgroundColor: "rgba(205, 204, 204, 0.6)",
        height:45,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        width: 350,
        marginBottom: 10,

    },
    confirmBtn:{
        marginLeft: 70, // pushes it to the right
        backgroundColor: "rgba(32, 93, 63, 1)",   
        padding: 5,
        borderRadius: 5,
    },
    cancelBtn:{
        marginRight: 5, 
        backgroundColor: "red",   
        padding: 5,
        borderRadius: 5,

    },
    confirmText:{
        fontWeight: "bold",
        color: "white"
    },
    purchaseContainer:{
        marginLeft: 5,
    },
    heading:{
        fontWeight:"bold",
        fontSize: 25,
    }

})