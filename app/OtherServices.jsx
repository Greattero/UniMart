import {View, TouchableOpacity, Text, StyleSheet} from "react-native";
import {useState, useEffect} from "react";

export default function OtherServices(){

    const [switchToNextPage, setSwitchToNextPage] = useState(null);
    


    return(

        <View>
            {switchToNextPage ? (<View>
                <TouchableOpacity>
                    <Text>Gas Fillers</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text>
                        Laundry
                    </Text>
                </TouchableOpacity>
            </View>)
            :
            (<View>
                <TouchableOpacity>
                    <Text>Dress seller</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text>
                        Perfumes
                    </Text>
                </TouchableOpacity>
            </View>)}

        </View>
    )
}

const styles = StyleSheet.create({


})