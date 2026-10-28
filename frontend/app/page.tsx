"use client"; // so we can run component on web
import {useState, useEffect} from "react";


interface Venue {
  id: number;
  name: string;
  waitMins: number;
  vibe: string;
}

interface VenueCardProps {
  venue : Venue;
  onUpdateWait: (id: number, newWait: number) => void;
}

// Uppercase first letter identifer used for functions that return HTML
function VenueCard({ venue, onUpdateWait} : VenueCardProps) {
  let waitColor = "text-green-400";
  if (venue.waitMins >= 25) {
    waitColor = "text-red-400";
  } else if (venue.waitMins >= 10) {
    waitColor = "text-yellow-400";
  }

  return (
    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-600">
      <h2 className="text-xl font-bold text-white">{venue.name}</h2>
      <p className={waitColor}>Wait time is about {venue.waitMins} minutes</p>
      <p>It&apos; looking like {venue.vibe}</p> 
      <div className="mt-2 flex gap-2">
          <button onClick={() => onUpdateWait(venue.id, 0)} className="p-1 rounded border">No Line</button>
          <button onClick={() => onUpdateWait(venue.id, 10)} className="p-1 rounded border">10m</button>
          <button onClick={() => onUpdateWait(venue.id, 20)} className="p-1 rounded border">20m</button>
          <button onClick={() => onUpdateWait(venue.id, 30)} className="p-1 rounded border">30m</button>
      </div>

    </div>
  )
}

export default function Home() {
  // array of all the venues
  // const [venues, setVenues] = useState<Venue[]>([ // React changes state by checking if the memory address (pointer) has changed 
  //   { id: 1, name: "Jack & Dan's", waitMins: 25, vibe: "the line is past the corner"},
  //   { id: 2, name: "Globe", waitMins: 10, vibe: "the line is out the door"},
  //   { id: 3, name: "Borracho's", waitMins: 15, vibe: "a couple groups waiting to get in"},
  //   { id: 4, name: "Logan Tavern", waitMins: 10, vibe: "the line is out the door"},
  //   { id: 5, name: "Star", waitMins: 15, vibe: "a couple groups waiting to get in"},
  //   { id: 6, name: "The Viking", waitMins: 15, vibe: "a couple groups waiting to get in"},

  // ]);

  const [venues, setVenues] = useState<Venue[]>([]);

  // GET bars from backend
  useEffect(() => {
    fetch("http://localhost:8000/api/venues/")
      .then((res) => res.json())
      .then((data) => setVenues(data));
  }, [])

  // Lowercase first letter identifer used for normal functions
  async function updateWait(id: number, newWait: number) {
    const res = await fetch("http://localhost:8000/api/checkins/", {
      method: "POST",
      headers: {"Content-Type": "application/json" },
      body: JSON.stringify({ venue_id: id, wait_mins: newWait }),
    });

    const result = await res.json();

    const updated = venues.map((v) => {
      if (v.id === id) {
        return { ...v, waitMins: result.waitMins};
      }
      return v;
    });
    setVenues(updated);

  }

  return (
    <main className="min-h-screen bg-zinc-950 text-blue-200 p-10 space-y-4">
      <h1 className="text-3xl font-bold text-white">Jan&apos;s Line</h1>

          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} onUpdateWait={updateWait} />
          ))}


    </main>
  );
}
