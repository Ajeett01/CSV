import { useEffect, useState } from "react";
import { Button, TextInput, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-reanimated/lib/typescript/Animated";


const APi = "http://www.omdbapi.com/?apikey=[yourkey]&";

function Movies({navigation}){

    const[movies,setMovies] = useState();
    const[query,setQuery] = useState('');


        function getData(){
            const res = fetch(API)
            .then((res=>res.json())).then(
                setMovies(res);
            )
        }

        function handleMoviePress(movie){
            navigation.navigate('MovieDetails', {movieId: movie.imdbId} );
        }

        console.log(movies)

    return(
        <View>
            {/* search bar */}
            <TextInput 
            placeholder="Serach for Movies"
            value={query}
            onChangeText={setQuery}
             />
             <Button title="Search" onPress={getData}/>
             <FlatList
                data={movies}
                keyExtractor={(item)=>item.imdbID}
                renderItem={({item})=>(
                    <TouchableOpacity onPress={()=>handleMoviePress(item)} >
                        <Text>{item.t}</Text>
                    </TouchableOpacity>
                )}
             />
        </View>
    )
}

export default Movies;