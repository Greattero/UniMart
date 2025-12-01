import { useEffect, useState,useRef } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, TextInput, Image, Animated} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword, 
        createUserWithEmailAndPassword, 
        GoogleAuthProvider, 
        signInWithCredential,
        fetchSignInMethodsForEmail,
        sendPasswordResetEmail,
        } from "firebase/auth";
import Foundation from '@expo/vector-icons/Foundation';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';



export default function LoginSignup(){


    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [signup, setSignup] = useState(true);
    const [feedback, setFeedBack] = useState();
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const [visible, setVisible] = useState(false);
    const [forgottenActivate, setForgottenActivate] = useState(false);
    const [retrievalEmail, setRetrievalEmail] = useState(false);
    const [isforgottenEmailSent, setIsForgottenEmailSent] = useState(false);



    // Configure Google Sign-In
    GoogleSignin.configure({
    webClientId: "365899462053-dn4jfb818anng6he8p5ef472tsl8e0r6.apps.googleusercontent.com", // Firebase Web client ID
    offlineAccess: true,
    });



    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const hasLetters = /[A-Za-z]/.test(password);
    const hasDigits = /[0-9]/.test(password);
    const isShort =  password.length >= 1 && password.length <= 7;
    const isMedium = password.length >= 8 && password.length <= 11;
    const isLong = password.length >= 12;


    useEffect(()=>{
        let timer;
        if(visible){
            Animated.timing(slideAnim,{
                toValue: 20,
                duration: 500,
                useNativeDriver: true,
            }).start(()=>{
                timer = setTimeout(()=>{
                    Animated.timing(slideAnim,{
                        toValue: -100,
                        duration: 500,
                        useNativeDriver: true,
                    }).start(()=>setVisible(false));
                }, 2000);
            });
        }

        return () => clearTimeout(timer);
    },[visible]);

    const handlePasswordReset = ()=>{
        setLoading(true);
        sendPasswordResetEmail(auth, retrievalEmail)
        .then(()=>{
            setIsForgottenEmailSent(true);
            setLoading(false);
            console.log("Reset link sent successfully");
        })
        .catch((err)=>{
            setLoading(false);
            setVisible(true);
            setFeedBack("passwordResetLinkSent");
            console.log(`Error: ${err}`);
        });
    }

    const handleBackToLogin = () =>{
        setForgottenActivate(false);
        setIsForgottenEmailSent(false);
    }

    const handleGoogleSignIn = async () => {
    try {
        // 1️⃣ Ensure Google Play Services are available (Android)
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

        // 2️⃣ Sign in and get user info
        const userInfo = await GoogleSignin.signIn();

        // 3️⃣ Get Firebase credential from the Google idToken
        const credential = GoogleAuthProvider.credential(userInfo.data.idToken);

        // 4️⃣ Sign in with Firebase
        const firebaseUser = await signInWithCredential(auth, credential);


        // Check if user already exists
        const { creationTime, lastSignInTime } = firebaseUser.user.metadata;

        const fullCreationTime = new Date(creationTime);
        const fullLastSignInTime = new Date(lastSignInTime);

        const isNewUser = fullCreationTime.getTime() === fullLastSignInTime.getTime();
        console.log("Is new user?", firebaseUser.user.metadata,"\n",isNewUser);
        console.log(new Date(fullCreationTime)); // e.g., Thu Nov 30 2025 08:26:28 GMT+0000
        console.log(new Date(fullLastSignInTime)); // e.g., Thu Nov 30 2025 08:29:32 GMT+0000
    

        console.log('🎉 Signed in with Google!', firebaseUser.user.email);
        // Clear cached account to avoid stuck sign-in
        await GoogleSignin.signOut();

        // ✅ Optional: show success message
        
        if(isNewUser){
            setVisible(true);
            setFeedBack('newGoogleSignUp'); // or 'newGoogleSignUp' if you prefer
        }
        else{
            setVisible(true);
            setFeedBack("googleAlreadyExists")
        }

    } catch (error) {
        console.log('❌ Google sign-in error:', error);

        // Clear cached account to avoid stuck sign-in
        await GoogleSignin.signOut();

        setVisible(true);
        setFeedBack('accountNotCreated');
    }
    };

    const successFeedbacks = ["accountCreated", "correctLogs", "newGoogleSignUp", "googleAlreadyExists"];

    const isSuccess = successFeedbacks.includes(feedback);

    const handleSubmit = () => {
        setLoading(true);
        if (signup === true){
            if (password !== confirmPassword) {
                setVisible(true);
                setFeedBack("notMatch")
                console.log("❌ Passwords do not match");
                console.log(`hasSpecial: ${hasSpecial}`);
                console.log(`hasLetters: ${hasLetters}`);
                console.log(`hasDigits: ${hasDigits}`);          
                setLoading(false);
                return;
            }

        if (isShort){
            setVisible(true);
            setFeedBack("shortPassword")
            console.log("Password is short");
            setLoading(false);
            return;
        }

        if ((isMedium || isLong) && (!hasLetters || !hasDigits)) {
            setVisible(true);
            setFeedBack("notAccurate")
            console.log("Password does not have both special characters and digits");
            setLoading(false);
            return;
            }


        }
        signup ? (
            createUserWithEmailAndPassword(auth, email, password)
            .then(()=>{
                setVisible(true);
                setFeedBack("accountCreated");
                console.log("Account Created");
                setLoading(false);
            })
            .catch((err)=>{
                setVisible(true);
                setFeedBack("accountNotCreated");
                console.log(`🚫 Error: ${err}`);
                setLoading(false);
            })
        
        )
        :
        (
            signInWithEmailAndPassword(auth, email, password)
            .then(()=>{
                setFeedBack("correctLogs");
                setVisible(true);
                console.log("🎉🎉 Logged in");
                setLoading(false);
            })
            .catch((err)=>{
                setFeedBack("wrongLogs");
                setVisible(true);
                console.log(`❌ Wrong password${err}`);
                setLoading(false);
            })
        )
    }



    return(

        <View style={styles.pageBackground}>

            {visible && <Animated.View
            style={[
                styles.toast,
                { transform: [{ translateY: slideAnim }] }
            ]}
            >
            {/* <View> */}
                {!isSuccess ?
                <Foundation name="x-circle" size={24} color="red" />
                :<MaterialCommunityIcons name="checkbox-marked-circle" size={24} color="green" />
                }

                <Text style={styles.feedbackText}>
                    {feedback === "notMatch" ? "Password doesn't match" 
                    : feedback === "shortPassword" ? "Password too short"
                    : feedback === "notAccurate" ? "Password must have at least letter and digit" 
                    : feedback === "accountCreated" ? "Account created successfully"
                    : feedback === "correctLogs" ? "Logged in successfully"
                    : feedback === "wrongLogs" ? "Incorrect logins"
                    : feedback === "accountNotCreated" ? "Network error"
                    : feedback === "newGoogleSignUp" ? "Account created successfully"
                    : feedback === "googleAlreadyExists" ? "Logged in successfully"
                    : feedback === "passwordResetLinkSent" ? "Password reset not successful"
                    : null}
                </Text>
            {/* </View> */}
            </Animated.View>}

            <Image 
            source={require("../assets/images/subtilepics.png")}
            style={styles.subtlePic}
            />
            <Image 
            source={require("../assets/images/subtilepics.png")}
            style={styles.subtlePic2}
            />
            
            <Ionicons name="chevron-back" size={20} color="white"  style={styles.back}/>
            <Text style={[styles.header, {top: signup ? 110 : 140}]}>UniMart</Text>
            <Text style={[styles.question, {right: !signup ? 105 : 76}]}>{signup ? "Already have an account?": "Don't have an account?"}</Text>
            <View style={[styles.signingBtn, {width: !signup ? "25%" : "16%"}]}>
                <TouchableOpacity 
                onPress={()=>{
                    setSignup(!signup);
                    setForgottenActivate(false);
                    setIsForgottenEmailSent(false);

                }}
                >
                    <Text style={styles.signingText}>{signup ? "Sign in": "Get Started"}</Text>
                </TouchableOpacity>
            </View>
            
            {signup ?
                (<View style={[styles.loginBackground, {height: signup ? "80%" : null}]}>
                
                <Text style={[styles.welcomeText, {marginTop: signup ? 15 : null}]}>Sign Up & Order</Text>
                <Text style={styles.instruct}>Hey! Jump in and start ordering</Text>
                <View style={[styles.inputContainer, , {marginTop: signup ? 75 : null}]}>

                    <View style={styles.passwordLengthIdContainer}>
                        <View style={[styles.passwordLengthId1, {backgroundColor: isShort ? "red" : isMedium ? "gold" : isLong ? "rgba(108, 197, 7, 1)" : "#3562"}]}>
                        </View>
                        <View style={[styles.passwordLengthId2, {backgroundColor: isMedium ? "gold" : isLong ? "rgba(108, 197, 7, 1)" : "#3562"}]}>
                        </View>
                        <View style={[styles.passwordLengthId3, {backgroundColor: isLong ? "rgba(108, 197, 7, 1)" : "#3562"}]}>
                        </View>
                    </View>
                    <TextInput
                    placeholder="E-mail address"
                    placeholderTextColor="gray"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    />
                    <TextInput
                    placeholder="Your name"
                    placeholderTextColor="gray"
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    keyboardType="email-address"
                    />
                    <TextInput
                    placeholder="Password"
                    placeholderTextColor="gray"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry={true}

                    />
                    <TextInput
                    key={signup ? "signupPassword" : "loginPassword"} // force re-mount
                    placeholder="Confirm Password"
                    placeholderTextColor="gray"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    style={styles.input}
                    secureTextEntry={true}

                    />


                    

                </View>

                    <TouchableOpacity
                    style={[styles.signinContainer, {marginTop: signup ? 295 : null}]}
                    onPress={()=>handleSubmit()}
                    >
                        {loading ? 
                        
                       (<View>
                            <ActivityIndicator color={"white"} size={28}/>
                        </View>)
                        :
                        (
                        <Text style={styles.signinText}>Sign in</Text>)
                        }
                    </TouchableOpacity>

                <View style={[styles.line, {marginTop: signup ? 30 : null}]}>

                </View>

                <View  style={[styles.altSiginTextContainer, {marginTop: signup ? 442 : null}]}>
                    <Text style={styles.altSigninText}>Or sign in with</Text>
                </View>

                <View style={[styles.googleContainer, {marginTop: signup ? 35 : null}]}>
                    <TouchableOpacity
                    style={styles.googleBtn}
                    onPress={()=>handleGoogleSignIn()}
                    >
                        <Image source={require("../assets/images/google.png")} style={styles.googleImage}/>
                        <Text style={styles.googleText}>Google</Text>
                    </TouchableOpacity>
                    
                </View> 
                
                
            </View>)
            
            :    
            
            forgottenActivate === false ?
            
            
            (<View style={styles.loginBackground}>
                
                <Text style={[styles.welcomeText]}> Welcome Back</Text>
                <Text style={styles.instruct}>Enter your details below</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                    placeholder="E-mail address"
                    placeholderTextColor="gray"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    />
                    <TextInput
                    key={signup ? "signupPassword" : "loginPassword"} // force re-mount
                    placeholder="Password"
                    placeholderTextColor="gray"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry={true}
                    />

                </View>

                    <TouchableOpacity
                    style={styles.signinContainer}
                    onPress={()=>handleSubmit()}
                    >
                        {loading ? 
                        
                       (<View>
                            <ActivityIndicator color={"white"} size={28}/>
                        </View>)
                        :
                        (
                        <Text style={styles.signinText}>Sign in</Text>)
                        }
                    </TouchableOpacity>

                <TouchableOpacity 
                onPress={()=>setForgottenActivate()}
                >
                    <Text style={styles.forgotText}>    
                    Forgot your password?
                    </Text>
                </TouchableOpacity>
                <View style={styles.line}>

                </View>

                <View  style={styles.altSiginTextContainer}>
                    <Text style={styles.altSigninText}>Or sign in with</Text>
                </View>

                <View style={styles.googleContainer}>
                    <TouchableOpacity style={styles.googleBtn}
                    onPress={()=>handleGoogleSignIn()}
                    >
                        <Image source={require("../assets/images/google.png")} style={styles.googleImage}/>
                        <Text style={styles.googleText}>Google</Text>
                    </TouchableOpacity>
                    
                </View> 
                
                
            </View>)

            : 
            
            <View style={[styles.loginBackground,{height: "45%"}]}>
                {isforgottenEmailSent === false ?
                <View style={styles.forgottenContainer}>
                    <Text style={styles.forgottenEmailHeading}>Enter your email</Text>
                    <TextInput
                    value={retrievalEmail}
                    onChangeText={setRetrievalEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="gray"
                    keyboardType="email-address"
                    style={[styles.input, {marginTop:55}]}
                    />
                    <View>
                        <TouchableOpacity 
                        style={styles.sendVerificationLink}
                        onPress={()=>handlePasswordReset()}
                        >
                            { loading ?
                            (<View>
                                <ActivityIndicator color={"white"} size={28}/>
                            </View>)
                            :  
                            <Text style={styles.signinText}>Send verification link</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>

                :

                <View style={styles.forgottenContainer}>
                    <Image 
                    source={require("../assets/images/mail.png")}
                    style={styles.mailPic}
                    />
                    <Text style={[styles.forgottenEmailHeading, {fontSize:25, marginTop:10}]}>
                        Password reset email sent
                    </Text>
                    <TouchableOpacity
                    style={styles.backToLogin}
                    onPress={()=>handleBackToLogin()}
                    >
                        <Text style={styles.signinText}>Back to login</Text>
                    </TouchableOpacity>
                </View>    
                }


            </View>
            }

        </View>
    )

}

const styles = StyleSheet.create({

    pageBackground:{
    flex: 1,               // <-- makes it fill the screen
    backgroundColor:"rgba(70, 180, 127, 1)",
    alignItems: "center",
    justifyContent: "center",
    },
    header:{
        color: "white",
        position: "absolute",
        top: 140,
        fontSize: 30,
        fontWeight: "bold",
    
    },
    loginBackground:{
        position: "absolute",
        width: "100%",       // or fixed like 300
        height: "72%",        // fixed height
        backgroundColor: "#f5f4f4ff",
        borderRadius: 10,
        bottom : 0,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,   
        alignItems:"center",   
    },
    back:{
        position: "absolute",
        top: 65,
        left: 20,
        fontWeight: "bold",
    },
    question:{
        position: "absolute",
        top: 67,
        right: 76,
        color: "white",
        fontSize: 12,
    },
    signingBtn:{
        position: "absolute",
        top: 62,
        right: 10,
        backgroundColor: "rgba(13, 150, 72, 0.39)",
        padding: 5,
        borderRadius: 5,
        width: "16%",
        alignItems: "center",

    },
    signingText:{
        color: "white",
        fontSize: 13,
        fontWeight: "bold",
    },
    welcomeText:{
        marginTop: 30,
        fontSize: 28,
        fontWeight: "bold"
    },
    instruct:{
        marginTop:5,
        color:"#8e8989"
    },
    inputContainer:{
        position: "absolute",
        left: 30,
        marginTop: 100,
        
    },
    input:{
        borderWidth: 1.5,
        width: 300,
        height: 55,
        borderRadius: 7,
        borderColor: "#8e898953",
        marginTop: 15,
        paddingRight: 70,
        color: "black"
    },
    signinContainer:{
        marginTop: 180,
        backgroundColor:"rgba(70, 180, 127, 1)",
        width: 300,
        height: 50,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    signinText:{
        color: "white",
        fontWeight: "bold",
    },
    forgotText:{
        marginTop: 20,
        color:"#8e8989",
        fontWeight: "bold",
    },
    line:{
        borderWidth: 0.5,
        borderColor: "#8e898923",
        width: 300,
        marginTop: 89,       

    },
    altSiginTextContainer:{
        position:"absolute",
        marginTop: 440,
        backgroundColor: "#f5f4f4ff",
        width: 125,
        alignItems:"center",        
    },
    altSigninText:{
        color:"#8e8989b8",
    },
    googleContainer:{
        // flexDirection: "row",
        // marginTop: 18,
        // backgroundColor: "#f5f4f4ff",
        // width: 300,
        // height: 50,
        // borderRadius: 10,
        // alignItems: "center",
        // justifyContent: "center",
        // borderWidth: 1.5,
        // borderColor: "#8e898944",
        // gap: 10,

    },
    googleBtn:{
        flexDirection: "row",
        marginTop: 18,
        backgroundColor: "#f5f4f4ff",
        width: 300,
        height: 50,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: "#8e898944",
        gap: 10,
    },
    googleImage:{
        width: 25,
        height: 25,
    },
    googleText:{
        fontWeight: "bold",
        color: "black"
    },
    subtlePic:{
        height: 380,
        width: 400,
        position:"absolute",
        top: 0,
        left: 0,
    },
    subtlePic2:{
        height: 380,
        width: 400,
        position:"absolute",
        top: 380,
                left: 0,


    },
    passwordLengthIdContainer:{
        flexDirection:"row",
        position: "absolute",
        right: 10,
        bottom: 95,
        gap: 3,
    },
    passwordLengthId1:{
        height: 5,
        width: 18,
        borderRadius: 5
    },
    passwordLengthId2:{
        height: 5,
        width: 18,
        borderRadius: 5
    },
    passwordLengthId3:{
        height: 5,
        width: 18,
        // backgroundColor: "rgba(108, 197, 7, 1)",
        borderRadius: 5
    },
  toast: {
    flexDirection: "row",
    position: 'absolute',
    top: 40,
    right: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  feedbackText:{
    marginLeft: 5,
    marginTop: 2,
  },
  forgottenEmailHeading:{
    marginTop: 20,
    fontSize: 28,
    fontWeight: "bold"
  },
  sendVerificationLink:{
    marginTop: 60,
    backgroundColor:"rgba(70, 180, 127, 1)",
    width: 300,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  backToLogin:{
    marginTop: 40,
    backgroundColor:"rgba(70, 180, 127, 1)",
    width: 300,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  forgottenContainer:{
    alignItems:"center"
  },
  mailPic:{
    width: 150,
    height: 150,
  }
    
    
})