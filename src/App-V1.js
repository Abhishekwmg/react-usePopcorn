import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Logo from "./Logo";
import Search from "./Search";
import Numresults from "./NumResults";
import Main from "./Main";
import Box from './Box'
import MovieList from "./MovieList";
import WatchedSummary from "./WatchedSummary";
import WatchedList from "./WatchedList";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import StarRating from "./StarRating";
import { ClipLoader } from "react-spinners";



export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);


  function handleSelectMovie(id) {
    setSelectedId(selectedId => id === selectedId ? null : id);
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  }

  //Fetching Movie
  useEffect(function () {
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const api_key = "4b4c6b8"
        const res = await fetch(`http://www.omdbapi.com/?apikey=${api_key}&s=${query}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Something went wrong with fetching movies.")

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");
        setMovies(data.Search);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("")
      return;
    }
    handleCloseMovie();
    fetchMovies();
    return function () {
      controller.abort();
    }
  }, [query]);

  useEffect(function () {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        handleCloseMovie();
      }
    })
  }, [])

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Numresults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} onHandleSelectMovie={handleSelectMovie} />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? <MovieDetails selectedId={selectedId} onCloseMovie={handleCloseMovie} onAddWatched={handleAddWatched} watched={watched} />
            : <><WatchedSummary watched={watched} /> <WatchedList watched={watched} onHandleWatchedDelete={handleDeleteWatched} />
            </>}
        </Box>
      </Main>
    </>
  );
}


function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {

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
    {isLoading ? <ClipLoader color="green" /> :
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