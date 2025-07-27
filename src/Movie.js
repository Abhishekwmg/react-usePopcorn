export default function Movie({ movie, onHandleSelectMovie }) {
    return <li key={movie.imdbID} onClick={() => { onHandleSelectMovie(movie.imdbID) }}>
        <img src={movie.Poster} alt={`${movie.Title} Poster`} />
        <h3>{movie.Title}</h3>
        <div>
            <p>
                <span>🗓</span>
                <span>{movie.Year}</span>
            </p>
        </div>
    </li>
}