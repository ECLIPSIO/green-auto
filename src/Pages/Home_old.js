import React, { useState } from 'react';
import RaceChart from '../components/RaceChart';
import useInterval from "../components/useInterval";

const getRandomIndex = array => {
    return Math.floor(array.length * Math.random());
};

export default function Home() {
    const [iteration, setIteration] = useState(0);
    const [start, setStart] = useState(true);
    const [data, setData] = useState([
      {
        name: "alpha",
        value: 10,
        color: "#f4efd3"
      },
      {
        name: "beta",
        value: 15,
        color: "#cccccc"
      },
      {
        name: "charlie",
        value: 20,
        color: "#c2b0c9"
      },
      {
        name: "delta",
        value: 25,
        color: "#9656a1"
      },
      {
        name: "echo",
        value: 30,
        color: "#fa697c"
      },
      {
        name: "foxtrot",
        value: 35,
        color: "#fcc169"
      }
    ]);
  
    useInterval(() => {
      if (start) {
        const randomIndex = getRandomIndex(data);
        setData(
          data.map((entry, index) =>
            index === randomIndex
              ? {
                  ...entry,
                  value: entry.value + 10
                }
              : entry
          )
        );
        setIteration(iteration + 1);
      }
    }, 500);
  
    return (
      <React.Fragment>
        <h1>Racing Bar Chart</h1>
        <RaceChart data={data} />
        <button onClick={() => setStart(!start)}>
          {start ? "Stop the race" : "Start the race!"}
        </button>
        <p>Iteration: {iteration}</p>
      </React.Fragment>
    );
  }