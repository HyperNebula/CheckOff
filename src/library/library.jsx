import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from 'react-hot-toast';

import { useWebSocket } from '../WebsocketComponent';

export function Library() {
    const [libraryDB, setLibraryDB] = useState([]);
    const [movieReturn, setMovieReturn] = useState([]);
    const [searchText, setSearchText] = useState("");

    const [currentFilter, setCurrentFilter] = useState("all");

    const [selectedMovieIndex, setSelectedMovieIndex] = useState(null);
    const [formStatus, setFormStatus] = useState("Watched");
    const [formRating, setFormRating] = useState("");
    const [formDate, setFormDate] = useState("");

    const detailsModalRef = useRef(null);

    const { sendUpdate, _ } = useWebSocket();

    useEffect(() => {
        getLibrary();
    }, []);

    const getMovieResults = async (e) => {
        e.preventDefault();

        const res = await fetch("https://imdb.iamidiotareyoutoo.com/search?q=" + searchText, {
			method: "GET",
			headers: { Accept: '*/*' }
		});
        const result = await res.json()
        setMovieReturn(result.description);
    };

    async function getLibrary() {
		const res = await fetch("api/library", {
			method: "GET",
			headers: { "Content-Type": "application/json" }
		});
        if (res.status == 401) {
            toast.error("Invalid token or user not found. Log in again");
            return;
        }
        const data = await res.json();
        setLibraryDB(JSON.parse(data.library));

        return;
	}

    function handleOpenDetails(index) {
        setSelectedMovieIndex(index);
        setFormStatus("Watched");
        setFormRating("");
        setFormDate("");
        detailsModalRef.current.showModal();
    }

    async function addMovie(e) {
        e.preventDefault();

        if (formStatus == "Watched" && formDate == "" ) {
            toast.error("Make sure to add the date viewed", {
                toasterId: 'modal',
            });
            return;
        }
        
        const moviePUT = movieReturn[selectedMovieIndex];
        moviePUT.status = formStatus;
        moviePUT.score = formRating;
        moviePUT.dateViewed = formDate;

        const res = await fetch("api/library", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
            body: JSON.stringify( moviePUT ),
		});

        if (res.status == 401) {
            toast.error("Invalid token or user not found. Log in again", {
                toasterId: 'modal',
            });
            return;
        }

        detailsModalRef.current.close();
        document.getElementById('searchModal').close()
        getLibrary();

        toast.success(moviePUT["#TITLE"] + " was added to your library");

        moviePUT.user = localStorage.getItem("userName");
        moviePUT.updateTime = Date();
        sendUpdate(moviePUT);
    }

    async function removeMovie(index) {
        const res = await fetch("api/library", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ index }),
		});

        getLibrary();
    }

    function DisplayMovieLibrary() {
        const filteredLibrary = libraryDB.filter((movie) => {
            if (currentFilter == "all") return true;
            return movie.status == currentFilter;
        });

        if (filteredLibrary.length == 0) {
            return (<span id="emptyLibrary">Your library is empty</span>);
        } else {
            return filteredLibrary.map((movie, index) => {
                const originalIndex = libraryDB.indexOf(movie);
                return <DisplayMovie key={index} movie={movie} index={originalIndex}/>;
            })
        }
    }

    function DisplayMovie({ movie, index }) {
        return (
            <div className="item">
                <button className="removeEntry" onClick={(e) => removeMovie(index)}>X</button>
                <img src={movie["#IMG_POSTER"]} alt={movie["#TITLE"]} />
                <div className="item-details">
                    <h2>{movie["#TITLE"]}</h2>
                    <p>
                        Year: {movie["#YEAR"]}
                        <br />
                        Status: { movie.status }
                        <br />
                        {movie.score && <>Rating: { movie.score }/10</>}
                        <br />
                        {movie.dateViewed && <>Date Viewed: {movie.dateViewed}</>}
                    </p>
                </div>
            </div>
        );
    }

    function DisplayMovieResult({ movie, index }) {
        return (
            <div className="searchItem" data-index={index}>
                <img src={movie["#IMG_POSTER"]} alt={`${movie["#TITLE"]} poster`} />
                <div className="searchItemDetails">
                    <h3>
                        {movie["#TITLE"]} ({movie["#YEAR"]})
                    </h3>
                    <p>{movie["#ACTORS"]}</p>
                    {/*<p>Description</p>*/}
                </div>
                <button
                    className="add-to-library-btn"
                    onClick={(e) => handleOpenDetails(index)}
                >
                    +
                </button>
            </div>
        );
    }

    return (
        <main>
            <div className="library-header">
                <h1 id="userTitle">
                    {localStorage.getItem("userName")}'s Library
                </h1>
                <button
                    type="button"
                    className="add-movie"
                    command="show-modal"
                    commandfor="searchModal"
                >
                    Add Movie
                </button>
            </div>

            <div className="library-content">
                <div id="filter-container">
                    <button className={`filter-btn ${currentFilter === "all" ? "active" : ""}`} onClick={() => setCurrentFilter("all")}> All </button>
                    <button className={`filter-btn ${currentFilter === "Watched" ? "active" : ""}`} onClick={() => setCurrentFilter("Watched")}> Watched </button>
                    <button className={`filter-btn ${currentFilter === "To Watch" ? "active" : ""}`} onClick={() => setCurrentFilter("To Watch")}> To Watch </button>
                </div>

                <div className="item-list">
                    {<DisplayMovieLibrary/>}
                </div>
            </div>

            <dialog id="searchModal">
                <button
                    id="closeSearchModal"
                    commandfor="searchModal"
                    command="close"
                >
                    X
                </button>

                <div id="modalBody">
                    <h2>Search for a Movie</h2>
                    <form id="searchForm" onSubmit={getMovieResults}>
                        <input
                            type="search"
                            id="movieSearchInput"
                            placeholder="Search for a movie..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <button type="submit">Search</button>
                    </form>
                    <div id="searchResults">
                        {movieReturn.map((movie, index) => {
                            return (
                                <DisplayMovieResult
                                    key={index}
                                    movie={movie}
                                    index={index}
                                />
                            );
                        })}
                    </div>
                </div>
            </dialog>

            <dialog id="detailsModal" ref={detailsModalRef}>
                <div><Toaster toasterId="modal"/></div>

                <div style={{ padding: '20px' }}>
                    <h2>Add Details</h2>
                    <form onSubmit={addMovie}>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Status: </label>
                            <select 
                                value={formStatus} 
                                onChange={(e) => setFormStatus(e.target.value)}
                            >
                                <option value="Watched">Watched</option>
                                <option value="To Watch">To Watch</option>
                            </select>
                        </div>

                        {formStatus == "Watched" && <>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Rating (1-10): </label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="10" 
                                    value={formRating} 
                                    onChange={(e) => setFormRating(e.target.value)}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label>Date Viewed: </label>
                                <input 
                                    type="date" 
                                    value={formDate} 
                                    onChange={(e) => setFormDate(e.target.value)}
                                />
                            </div>
                        </>}

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                type="button" 
                                onClick={() => detailsModalRef.current.close()}
                            >
                                Cancel
                            </button>
                            <button type="submit">Save to Library</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </main>
    );
}
