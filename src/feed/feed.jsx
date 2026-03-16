import React, { useState, useEffect } from 'react';

class FeedUpdate {
    constructor(updateType, username, userProfilePic, movie, updateTime, updateData) {
        this.updateType = updateType;
        this.username = username;
        this.userProfilePic = userProfilePic;
        this.movie = movie;
        this.updateTime = updateTime;
        this.updateData = updateData;
    }
};

function RatingUpdate( {update} ) {
    return (
        <article>
            <header>
                <img src={update.userProfilePic} alt="Profile Pic" width="30" height="30"/>
                <span><strong>{update.username}</strong> rated <strong>{update.movie}</strong> on <time>{update.updateTime}</time></span>
            </header>

            <p>Rating: {update.updateData}</p>
        </article>
    )
}

function WatchedUpdate( {update} ) {
    return (
        <article>
            <header>
                <img src={update.userProfilePic} alt="Profile Pic" width="30" height="30"/>
                <span><strong>{update.username}</strong> just watched <strong>{update.movie}</strong> on <time>{update.updateTime}</time></span>
            </header>

            <figure>
                <img src={update.updateData} alt={update.movie} width="100"/>
            </figure>
        </article>
    )
}

export function Feed() {

    const [updates, setUpdates] = useState([new FeedUpdate("Rating", "Test User", "/placeholder_user_profile_image.png", "Movie 1", "Monday", "⭐⭐⭐⭐⭐"), new FeedUpdate("Watched", "Test User 2", "/placeholder_user_profile_image.png", "Movie 2", "Saturady", "/placeholder_movie_poster.png")]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newItem = new FeedUpdate("Rating", "Test User", "/placeholder_user_profile_image.png", "Movie 1", "Monday", "⭐⭐⭐⭐⭐");
            
            setUpdates(prevUpdates => [...prevUpdates, newItem]);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <main>
            <h1 style={{ textAlign: "center" }}>Activity</h1>

            <div className="activity-feed">

                {[...updates].reverse().map((update, index) => {
                    if (update.updateType === "Rating") {
                        return <RatingUpdate key={index} update={update} />;
                    } else if (update.updateType === "Watched") {
                        return <WatchedUpdate key={index} update={update} />;
                    }
        
                    return null;
                })}

            </div>

        </main>
    );
}