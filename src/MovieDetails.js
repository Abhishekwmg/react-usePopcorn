import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import StarRating from "./StarRating";

export default function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {

    const [userRating, setUserRating] = useState(0);
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const isWatched = watched.map(movie => movie.imdbID).includes(selectedId);
    const userWatchedRating = watched.find(movie => movie.imdbID === selectedId)?.userRating;

    const { Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre } = movie;

    // console.log(movie, "printing movie");

    useEffect(function () {
        async function getMovieDetails() {
            setIsLoading(true);
            const api_key = "4b4c6b8"
            let fres = await fetch(`http://www.omdbapi.com/?apikey=${api_key}&i=${selectedId}`)
            const data = await fres.json();
            setMovie(data);
            setIsLoading(false);
        }
        getMovieDetails();
    }, [selectedId])

    function handleAdd() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(' ').at(0)),
            userRating,
        }
        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    useEffect(function () {
        document.title = `Movie | ${title} | ${year}`;

        return function () {
            document.title = 'usePopcorn'
        }
    }, [title])

    useEffect(function () {

        function keydownCleanup(e) {
            if (e.code === 'Escape') {
                onCloseMovie();
            }
        }

        document.addEventListener('keydown', keydownCleanup)

        return function () {
            document.removeEventListener('keydown', keydownCleanup);
        }
    }, [onCloseMovie])

    return <div className="details">
        {isLoading ? <ClipLoader color="yellow" /> :
            <>
                <header>
                    <button className="btn-back" onClick={onCloseMovie}>
                        &larr;
                    </button>
                    <img src={poster} alt={`Poster of ${movie}`} />
                    <div className="details-overview">
                        <h2>{title}</h2>
                        <p>{released} &bull; {runtime}</p>
                        <p>{genre}</p>
                        <p><span>🌟</span>{imdbRating} IMDB Rating</p>
                    </div>
                </header>
                <section>
                    <div className="rating">
                        {!isWatched ? <>
                            <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                            {userRating > 0 && <button className="btn-add" onClick={handleAdd}> + Add to list</button>}
                        </> : <p>You rated this movie {userWatchedRating} <span>✨</span></p>}

                    </div>
                    <p><em>{plot}</em></p>
                    <p>Starring {actors}</p>
                    <p>Directed By {director}</p>
                </section></>
        }

    </div>
}