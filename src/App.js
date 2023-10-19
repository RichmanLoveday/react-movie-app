import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";
const KEY = 63763874;
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);
  const [watched, setWatched] = useLocalStorageState([], 'watched');

  //const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(() => {
  //   const storedValue = JSON.parse(localStorage.getItem('watched')) || [];
  //   // console.log(watched);
  //   return storedValue;
  // });


  const handleSelectMovie = (id) => {
    setSelectedId(selectedId => id === selectedId ? null : id)
  }

  function handleCloseMovie(id) {
    setSelectedId(null);
  }

  const handleAddWatch = (movie) => {
    setWatched(watched => [...watched, movie])
    // localStorage.setItem('watched', JSON.stringify([...watched, movie]));
    setSelectedId(null);
  }

  const handleDeleteWatched = (id) => {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id));
  }


  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MoviesList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && <MoviesList onCloseMovie={handleCloseMovie} onSelectMovie={handleSelectMovie} movies={movies} />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {
            selectedId ? <MovieDetails
              onAddWatched={handleAddWatch}
              onCloseMovie={handleCloseMovie}
              selectedId={selectedId}
              watched={watched}
            /> :
              <>
                <WatchedSummary watched={watched} />
                <WatchedMovieList onDeleteWatched={handleDeleteWatched} watched={watched} />
              </>
          }
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading....</p>
}

function ErrorMessage({ message }) {
  return <p className="error">
    <span>⛔</span>{message}
  </p >
}


function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  )
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )
}

function Search({ query, setQuery }) {
  // using ref to hold DOM element
  const inputEl = useRef(null);

  // focus on input
  useKey('Enter', function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery('');
  });


  // using effect when u use  DOM element
  // useEffect(function () {
  //   const callBack = (e) => {
  //     if (document.activeElement === inputEl.current) return;
  //     if (e.code === 'Enter') {
  //       inputEl.current.focus();
  //       setQuery('');
  //     }
  //   }

  //   document.addEventListener('keydown', callBack);
  //   return () => document.removeEventListener('keydown', callBack);

  // }, [setQuery]);

  // useEffect(function () {
  //   const el = document.querySelector('.search');
  //   el.focus();
  // }, [query]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  )
}

function Main({ children }) {

  return (
    <main className="main">
      {children}
    </main>
  )
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  )
}

// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedMovieList watched={watched} />
//         </>
//       )}
//     </div>
//   )
// }


function MoviesList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie onSelectMovie={onSelectMovie} movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  )
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)} key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');

  const countRef = useRef(0);

  useEffect(function () {
    if (userRating) countRef.current++;
  }, [userRating]);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime, imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  // if (imdbRating > 8) [isTop, setIsTop] = useState(true);

  // if (imdbRating > 8) return <p>Greatest ever!</p>

  // const [isTop, setTop] = useState(imdbRating > 8);
  // console.log(isTop);
  // useEffect(function () {
  //   setTop(imdbRating > 8)
  // }, [imdbRating])

  // using derived state
  const isTop = imdbRating > 8;
  console.log(isTop);

  // movie to be added as watched
  const handleAdd = () => {
    // console.log(Runtime)
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(Runtime.split(' ').at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie)
  }

  useKey('Escape', onCloseMovie);
  // useEffect(function () {
  //   const callBack = (e) => {
  //     if (e.code === 'Escape') {
  //       onCloseMovie();
  //     }
  //   }
  //   document.addEventListener('keydown', callBack);

  //   return function () {
  //     document.removeEventListener('keydown', callBack);
  //   }
  // }, [onCloseMovie]);

  // console.log(title, year);
  // LOAD MOVIE on click
  useEffect(function () {
    async function getMovieDetails() {
      setIsLoading(true);

      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }

    getMovieDetails();
  }, [selectedId]);


  // change link address
  useEffect(function () {
    if (!title) return;
    document.title = `Movie | ${title}`

    // clean up function
    return function () {
      document.title = 'usePopcorn';
      // console.log(`Clean up effect for movie ${title}`);
    };
  }, [title])


  return (
    <div>
      {
        isLoading ? <Loader /> :
          <>
            <div className="details">
              <header>
                <button className="btn-back" onClick={onCloseMovie}>
                  &larr;
                </button>
                <img src={poster} alt={`Poster of ${movie}`} />
                <div className="details-overview">
                  <h2>{title}</h2>
                  <p>
                    {released} &bull; {Runtime}
                  </p>
                  <p>{genre}</p>
                  <p>
                    <span>⭐</span>
                    {imdbRating} IMDb rating
                  </p>
                </div>
              </header>

              <section>
                <div className="rating">
                  {!isWatched ? (
                    <>
                      <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                      {userRating > 0 && (<button className="btn-add" onClick={handleAdd}>+ Add to list</button>)}
                    </>
                  ) : (
                    <p>You rated this movie {watchedUserRating} ⭐</p>
                  )}
                </div>
                <p>
                  <em>{plot}</em>
                </p>
                <p>Staring {actors}</p>
                <p>Directed by {director}</p>
              </section>
            </div>
          </>
      }
    </div>
  )
}


function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
}

function WatchedMovieList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => <WatchedMovie onDeleteWatched={onDeleteWatched} movie={movie} key={movie.imdbID} />)}
    </ul>
  )
}


function WatchedMovie({ movie, onDeleteWatched }) {
  console.log(movie)
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  )
}

