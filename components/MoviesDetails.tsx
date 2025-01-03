import { useEffect, useState } from "react";
import { View } from "react-native";

const APi = "http://www.omdbapi.com/?apikey=[yourkey]&";

function MoviesDetails({route}){

    const {movieId} = route.params;
    const [movie, setMovie] = useState(null);

    useEffect(()=>{
        function fetchMovieDetail(){
            const res = fetch(API)
            .then((res=>res.json())).then(
                setMovie(res);
            )
        }
    },[movieId])


    if(!movie){
        return <Text>....</Text>
    }

    return(
        <View>
            <Text> {movie.Title} </Text>
            <Text> {movie.Realeased } </Text>
        </View>
    )
}

export default MoviesDetails;