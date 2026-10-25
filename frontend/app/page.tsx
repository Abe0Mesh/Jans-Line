"use client"; // so we can run component on web
import {useState} from "react";

interface Venue {
  id: number;
  name: string;
  waitMins: number;
  vibe: string;
}


export default function Home() {
  // array of all the venues
  const [venues, setVenues] = useState<Venue[]>([ // React changes state by checking if the memory address (pointer) has changed 
    { id: 1, name: "Jack & Dan's", waitMins: 25, vibe: "the line is past the corner"},
    { id: 2, name: "The Globe", waitMins: 10, vibe: "the line is out the door"},
    { id: 3, name: "Borracho's", waitMins: 15, vibe: "a couple groups waiting to get in"},
  ]);
  function addFiveMins(index: number) {
    const copy = [...venues]; // create new arr pointer so we force react to redraw
    copy[index] = { ...copy[index], waitMins: copy[index].waitMins + 5};
    setVenues(copy)
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-blue-200 p-10 space-y-4">

      {venues.map((venue, index) => (
        <div key={venue.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-600">
          <h2>{venue.name}</h2>
          <p>Wait time is about {venue.waitMins} minutes</p>
          <p>It's looking like {venue.vibe}</p> 
          <button onClick={() => addFiveMins(index)} className="p-1 rounded border">Add 5 Mins to Wait</button>
        </div>
      ))}

    </main>
  );
}
