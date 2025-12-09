import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getDatabase, onValue, ref, update, runTransaction } from "firebase/database";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { app } from "./firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Purchases({setNotify}){

    const [getPurchases, setGetPurchases] = useState(null);
    const [confirmed, setConfirmed] = useState(null);
    const [rating, setRating] = useState(0);
    const [purchaseId, setPurchaseId] = useState("");
    const starWidth = 25;

    const db = getDatabase(app);

    useEffect(() => {
    // const db = getDatabase(app);
    const dbRef = ref(db, "buyer-profiles");

    const unsubscribe = onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
        const data = snapshot.val();
        const foundProfile = data["Foster Ametepey-242424"];
        if (foundProfile && foundProfile.purchases) {
            const purchasesArray = Object.keys(foundProfile.purchases).map(key => ({
            id: key,
            ...foundProfile.purchases[key],
            }));
            setGetPurchases(purchasesArray);
        } else {
            setGetPurchases([]);
        }
        } else {
        setGetPurchases([]);
        }
    });

    return () => unsubscribe(); // clean up listener on unmount
    }, []);

    useEffect(() => {
        const updateNotify = async () => {
            if (!getPurchases) return;

            const hasIncomplete = getPurchases.some(
                (order) => order.status === "incomplete"
            );

            if (hasIncomplete) {
                setNotify(true);
                await AsyncStorage.setItem("notify", "true");
            } else {
                setNotify(false);
                await AsyncStorage.removeItem("notify");
            }
        };

        updateNotify();
    }, [getPurchases]);

    const handleConfirmOrder = async (purchaseId) =>{
        // setConfirmed(true);
        const userPath = `buyer-profiles/Foster Ametepey-242424/purchases/${purchaseId}`;
        const userRef = ref(db, userPath);

        await update(userRef, {
            status:"complete",
        })
        .then(()=>{
            console.log("Status changed to complete");
            setConfirmed(true);
        })
        .catch(()=>{
            console.log("Unable to change status")
        })
    }

    const handleCancelOrder = async (purchaseId) =>{
        const userPath = `buyer-profiles/Foster Ametepey-242424/purchases/${purchaseId}`;
        const userRef = ref(db, userPath);

        await update(userRef, {
            status:"cancelled",
        })
        .then(()=>{
            console.log("Status changed to cancel");
            setConfirmed(false);
        })
        .catch(()=>{
            console.log("Unable to change status")
        })
    }

    const handleRateSubmission = async (purchaseId)=>{
        setRating(0);
        const userPath = `buyer-profiles/Foster Ametepey-242424/purchases/${purchaseId}`;
        const userRef = ref(db, userPath);

        const sellerPath = `restaurants/Jesi Dish/numberOfRatings`;  // it may be a shop too so check that it works for that too
        const sellerRef = ref(db, sellerPath);

        const sellerPath2 = `restaurants/Jesi Dish/sumOfRatings`;  // it may be a shop too so check that it works for that too
        const sellerRef2 = ref(db, sellerPath2);

        const ratePath = `restaurants/Jesi Dish`;
        const rateRef = ref(db, ratePath);

        await update(userRef, {
            rated: true,
        })
        .then(()=>{
            console.log("Rated successfully");
        })
        .catch(()=>{
            console.log("Unable to rate")
        })

        await runTransaction(sellerRef, (currentValue) => (currentValue || 0) + 1);

        await runTransaction(sellerRef2, (currentValue) => (currentValue || 0) + rating);

        // await update(rateRef, {
        // myRate: rating,
        // })
        // .then(()=>{
        //     console.log("Rated value recorded");
        // })
        // .catch(()=>{
        //     console.log("Unable to record rate")
        // })
    }


    

    const handlePress = (starIndex, event)=>{
        const touchX = event.nativeEvent.locationX;
        const isHalf = touchX < starWidth / 2;
        const newRating = isHalf ? starIndex - 0.5 : starIndex;
        setRating(newRating);
    }

    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) stars.push("star");
        else if (rating >= i - 0.5) stars.push("star-half-empty");
        else stars.push("star-o");
    }

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

            <View style={styles.listsContainer}>
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
                    <View style={[styles.confirmationPanel, item.status === "complete" && {
                                                                justifyContent: "flex-start",
                                                                gap: 2,        // this will now work
                                                                paddingLeft: 5
                                                            }]}>
                        {item.status === "incomplete" ?
                        <>
                            <Text> 
                                Order received?
                            </Text>
                            <TouchableOpacity 
                            style={styles.confirmBtn}
                            onPress={()=>{
                                handleConfirmOrder(item.id);                                
                            }}
                            >
                                <Text style={styles.confirmText}>Confirm</Text>
                                
                            </TouchableOpacity>
                        
                            <TouchableOpacity 
                            style={styles.cancelBtn}
                            onPress={()=>handleCancelOrder(item.id)}
                            >
                                <Text style={styles.confirmText}>Cancel Order</Text>
                            </TouchableOpacity>
                        </>

                        : 

                         item.status === "complete" ?
                        <>
                            {item.rated === false && stars.map((icon, idx)=>(
                                <Pressable
                                key={idx}
                                onPress={(e)=>handlePress(idx+1,e)}
                                style={{width: starWidth}}
                                >
                                    <FontAwesome name={icon} size={25} color="orange"/>
                                </Pressable>
                            ))
                            }

                            {console.log(item.status)}

                            {(item.rated === false) && <TouchableOpacity 
                            style={[styles.confirmBtn, {marginLeft: 170}]}
                            onPress={()=>handleRateSubmission(item.id)}
                            >
                                <Text style={styles.confirmText}>Rate Seller</Text>
                            </TouchableOpacity>}

                            {item.rated === true && 
                                <Text>
                                    Enjoy your purchase🤗                                
                                </Text>
                            }
                        
                        </>
                        :
                        <Text>
                            Order has been cancelled
                        </Text>
                        
                    }
                    </View>
                </>

                )}
                
                />
            </View>
        </View>
    )
}

//when user makes an order, the yet to confirm or cancelled orders should be numbered on the purchases icon
const styles = StyleSheet.create({
    container:{
        borderWidth: 0,
        width: 400,
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
        width: 400,
        marginBottom: 10,

    },
    confirmBtn:{
        marginLeft: 115, // pushes it to the right
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
        flex: 1,
        marginLeft: 5,
        
    },
    heading:{
        fontWeight:"bold",
        fontSize: 25,
    },
    listsContainer:{
        flex:1,
        alignItems:"center",
    }

})