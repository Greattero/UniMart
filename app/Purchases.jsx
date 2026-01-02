import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getDatabase, onValue, ref, update, runTransaction,get } from "firebase/database";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { app } from "./firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Purchases({setNotify, getMyProfile}){

    const [getPurchases, setGetPurchases] = useState(null);
    const [confirmed, setConfirmed] = useState(null);
    const [rating, setRating] = useState(0);
    const [purchaseId, setPurchaseId] = useState("");
    const [myProfile, setMyProfile] = useState("");
    const [sellerProfile, setSellerProfile] = useState("");
    const starWidth = 25;

    const db = getDatabase(app);

    useEffect(()=>{
        setMyProfile(getMyProfile)
    },[getMyProfile]);



    // console.log(myProfile);

    const purchaseRef = ref(db, `buyer-profiles/${myProfile}/purchases`);

    get(purchaseRef).then(snapshot => {

        const purchases = snapshot.val();
        // console.log(purchases)
        if (purchases) {
            const purchasesArray = Object.keys(purchases).map(key => ({
            id: key,
            ...purchases[key],
            }));
            setGetPurchases(purchasesArray);
        } else {
            setGetPurchases([]);
        }
                
    });
    // useEffect(() => {
    // // const db = getDatabase(app);
    // // const dbRef = ref(db, `buyer-profiles/${myProfile}/purchases`);

    // const unsubscribe = onValue(dbRef, (snapshot) => {
    //     if (snapshot.exists()) {
    //     const purchases = snapshot.val();
    //     console.log(purchases)
    //     if (purchases) {
    //         const purchasesArray = Object.keys(purchases).map(key => ({
    //         id: key,
    //         ...purchases[key],
    //         }));
    //         setGetPurchases(purchasesArray);
    //     } else {
    //         setGetPurchases([]);
    //     }
    //     } else {
    //     setGetPurchases([]);
    //     }
    // });

    // return () => unsubscribe(); // clean up listener on unmount
    // }, []);

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
        const userPath = `buyer-profiles/${myProfile}/purchases/${purchaseId}`;
        const userRef = ref(db, userPath);

        get(userRef).then((snapshot)=>{

            const data = snapshot.val() || [];

            const seller = data.seller;

            setSellerProfile(seller)

            console.log(`Buying from ${seller}`)

        });

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
        const userPath = `buyer-profiles/${myProfile}/purchases/${purchaseId}`;
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

        console.log("😂😂😂: ", sellerProfile)

        const userPath = `buyer-profiles/${myProfile}/purchases/${purchaseId}`;
        const userRef = ref(db, userPath);

        const sellerPath = `restaurants/${sellerProfile}/numberOfRatings`;  // it may be a shop too so check that it works for that too
        const sellerRef = ref(db, sellerPath);

        const sellerPath2 = `restaurants/${sellerProfile}/sumOfRatings`;  // it may be a shop too so check that it works for that too
        const sellerRef2 = ref(db, sellerPath2);

        const ratePath = `restaurants/${sellerProfile}`;
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

        setRating(0);

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
                        <View style={styles.purchaseStatusContainer}>
                            <Text style={styles.purchaseStatus}>Awaiting Confirmation</Text>

                        </View>
                        <Text style={styles.foodName}>{item.foodName}</Text>
                        <Text style={styles.price}>GH₵ {item.price}</Text>

                    </View>
                    <View style={[styles.confirmationPanel, item.status === "complete" && {
                                                                justifyContent: "flex-start",
                                                                gap: 2,        // this will now work
                                                                paddingLeft: 5
                                                            }]}>
                        {item.status === "awaiting" ?
                        <>
                            <Text style={styles.orderStatus}> 
                                Wait for seller to accept order 🌚
                            </Text>
                        </>

                        : 
                        item.status==="incomplete" ?

                        <>
                            <Text style={styles.orderStatus}> 
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

                            {/* {console.log(item.status)} */}

                            {(item.rated === false) && <TouchableOpacity 
                            style={[styles.confirmBtn, {marginLeft:item.status === "complete" && 110}]}
                            onPress={()=>handleRateSubmission(item.id)}
                            >
                                <Text style={styles.confirmText}>Rate Seller</Text>
                            </TouchableOpacity>}

                            {item.rated === true && 
                                <Text style={styles.orderStatus}>
                                    Enjoy your purchase ❤️                                
                                </Text>
                            }
                        
                        </>
                        :
                        <Text style={styles.orderStatus}>
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
        flex: 1,
        borderWidth: 0,
        width: 340,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: "white",
        // elevation: 6,
        height: 100,
        marginTop: 5,
        borderColor:"rgba(219, 224, 232, 0.6)",
        borderWidth:2,
    },
    foodName:{
        paddingBottom: 5,
        marginTop: 30,
        paddingLeft: 15,
        fontSize: 20,
        fontWeight: "bold",
        color: "black"
    },
    price:{
        color: "rgba(131, 130, 127, 1)",
        paddingLeft: 15,
        fontWeight:"bold",

    },
    confirmationPanel:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent:"space-between",
        backgroundColor: "rgba(219, 224, 232, 0.6)",
        height:45,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        width: 340,
        marginBottom: 10,

    },
    confirmBtn:{
        marginLeft: 50, // pushes it to the right
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
    },
    purchaseStatus:{
        marginTop: 8,
        padding: 5,
        backgroundColor:"black",
        width: 150,
        // marginTop:20,
        marginBottom: 15,
        height:30,
        borderRadius: 80,
        color: "white"


    },
    purchaseStatusContainer:{
        flex: 1,
        marginLeft: 10,
    },
    orderStatus:{
        marginLeft: 15,
        fontWeight: "bold",
        color: "rgba(0, 0, 0, 1)"
    }

})