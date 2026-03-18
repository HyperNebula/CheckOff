import React, { useState, useEffect } from 'react';
import TimeAgo from 'react-timeago';

import { useWebSocket } from '../WebsocketComponent';

function ToWatchUpdate( {update} ) {
    return (
        <article>
            <header>
                <span><strong>{update.user === localStorage.getItem("userName") ? "You" : update.user}</strong> added <strong>{update["#TITLE"]}</strong> to the "To Watch" list <TimeAgo date={update.updateTime} /></span>
            </header>

            <figure>
                <img src={update["#IMG_POSTER"]} alt={update["#TITLE"]} width="100"/>
            </figure>
            <hr/>
        </article>
    )
}

function WatchedUpdate( {update} ) {
    return (
        <article>
            <header>
                <span><strong>{update.user === localStorage.getItem("userName") ? "You" : update.user}</strong> watched <strong>{update["#TITLE"]}</strong> <TimeAgo date={update.updateTime} /></span>
            </header>

            <figure>
                <img src={update["#IMG_POSTER"]} alt={update["#TITLE"]} width="100"/>
            </figure>
            <hr/>
        </article>
    )
}

function RatingUpdate( {update} ) {
    return (
        <>
            <article>
                <header>
                    <span><strong>{update.user === localStorage.getItem("userName") ? "You" : update.user}</strong> rated <strong>{update["#TITLE"] }</strong> <TimeAgo date={update.updateTime} /></span>
                </header>

                <p>Rating: {update.score}/10</p>
            </article>
            <hr/>
            <WatchedUpdate update={update} />
        </>
    )
}

export function Feed() {

    const { _, updates } = useWebSocket();

    return (
        <main>
            <h1 style={{ textAlign: "center" }}>Activity</h1>

            <div className="activity-feed">

                {updates.map((update, index) => {
                    if (update.status === "To Watch") {
                        return <ToWatchUpdate key={index} update={update} />;
                    } else if (update.status === "Watched" && update.score === "") {
                        return <WatchedUpdate key={index} update={update} />;
                    } else if (update.status === "Watched") {
                        return <RatingUpdate key={index} update={update} />;
                    }
                    return null;
                })}

            </div>

        </main>
    );
}