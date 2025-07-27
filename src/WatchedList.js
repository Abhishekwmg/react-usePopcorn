import WatchedMovie from "./WatachedMovie"

export default function WatchedList({ watched, onHandleWatchedDelete }) {
    return <ul className="list">
        {watched.map((movie) => (
            <WatchedMovie movie={movie} key={movie.imdbID} onHandleWatchedDelete={onHandleWatchedDelete} />
        ))}
    </ul>
}