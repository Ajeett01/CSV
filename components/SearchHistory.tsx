import { useEffect } from "react";
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";


function SearchHistory({navigation}){

    const [history, setHistory] = useState([]);

    useEffect(() => {
        async function loadHist() {
            try {
                const saved = await AsyncStorage.getItem('searchHistory');
                if (saved) {
                    setHistory(JSON.parse(saved));
                }
            } catch (error) {
                console.error("Failed", error);
            }
        }
        loadHist();
    }, []);

    function handleItemPress(query){
        navigation.navigate('MovieSerach', {query});
    }

    return(
        <View>
            <FlatList
            data={history}
            keyExtractor={(item,index)=> index.toString()}
            renderItem={({item})=>(
                <TouchableOpacity onPress={()=>handleItemPress(item)} >
                    <Text>
                        {item}
                    </Text>
                </TouchableOpacity>
            )}
            />
        </View>
    )
}

export default SearchHistory;