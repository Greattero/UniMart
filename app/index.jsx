import { Text, View } from "react-native";
import Navigation from "./Navigation.jsx";
import FoodDisplay from "./FoodDisplay.jsx";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
      }}
    >
      <FoodDisplay/>
      <Navigation/>
    </View>
  );
}
