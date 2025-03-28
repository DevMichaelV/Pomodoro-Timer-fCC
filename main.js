import React, { useState, useEffect, useRef } from "https://esm.sh/react"
import { createRoot } from 'https://esm.sh/react-dom/client';

const domNode = document.getElementById("root")
const root = createRoot(domNode)

const App = () => {
  const initB = 5;
  const initS = 25;
  const [running, setRunning] = useState(false);
  const [bLength, setBLength] = useState(initB);
  const [sLength, setSLength] = useState(initS);
  const [segment, setSegment] = useState(true);
  const [time, setTime] = useState(null);
  const intRef = useRef(null);

  const startPause = (action) => {
    if(action === "play") {
      clearInterval(intRef.current);
      intRef.current = setInterval(()=>{
        setTime(time => time - 1);
      }, 1000);
    } // End play
    
    if(action === "pause" || action === "reset") {
      clearInterval(intRef.current);
    } // End pause || reset
  }

  const handleClick = (e) => {
    const id = e.target.id;
    
    switch(true) {
      case (id === "break-decrement"): {
        if(!running && bLength > 1) {
          if(!segment) setTime((bLength - 1) * 60);
          setBLength(bLength - 1);
        }
        break; } // End break-dec

      case (id === "break-increment"): {
        if(!running && bLength < 60) {
          if(!segment) setTime((bLength + 1) * 60);
          setBLength(bLength + 1);
        }
        break; } // End break-inc

      case (id === "session-decrement"): {
        if(!running && sLength > 1) {
          if(segment) setTime((sLength - 1) * 60);
          setSLength(sLength - 1);
        }
        break; } // End sess-dec

      case (id === "session-increment"): {
        if(!running && sLength < 60) {
          if(segment) setTime((sLength + 1) * 60);
          setSLength(sLength + 1);
        }
        break; } // End sess-inc

      case (id === "start_stop"): {
        if(running) {
          setRunning(false);
          startPause("pause");
        } else {
          setRunning(true);
          startPause("play");
        }
        break; } // End start_stop

      case (id === "reset"): {
        setRunning(false);
        setBLength(initB);
        setSLength(initS);
        setSegment(true);
        setTime(null);
        startPause("reset");
        document.getElementById("beep").pause();
        document.getElementById("beep").currentTime = 0;
        break; } // End reset
    }
  }

  // If time has expired+, switch the segment
  if(time < 0) {
    setSegment(!segment);
    setTime(null);

  // Otherwise, if time is null (only on first load, after reset, and switching segments)
  } else if(time === null) {
    // If segment is false, we're on break; otherwise, we're working
    segment === false
      ? setTime(bLength * 60)
      : setTime(sLength * 60);
  }

  const redCon = segment ? sLength * 12 : bLength * 12;
  let timeStr = "";
  if(time) {
    let m = Math.floor(time / 60);
    let s = Math.floor(time % 60);
    timeStr = m < 10 ? "0" + m : m;
    timeStr += s < 10 ? ":0" + s : ":"+ s;
  }

  useEffect(()=>{
    if(time === 0) {
      document.getElementById("beep").play();
    }
  });

  // Return the App JSX to the renderer
  { return (
    <div id="app-wrap">
      <div id="title-bar">
        <h1>25 + 5 Clock</h1>
        <h2>(Pomodoro Timer)</h2>
        <span id="tribute"><em>by</em> <h3 className="author">Sfluack</h3></span>
      </div>
      <div id="clock-box">
        <div id="break-controls">
          <div id="break-label">Break Duration</div>
          <div className="controls">
            <div id="break-decrement" onClick={handleClick}></div>
            <div id="break-length">{bLength}</div>
            <div id="break-increment" onClick={handleClick}></div>
          </div>
        </div>
        <div id="timer-box">
          <div id="timer-label">{segment ? "Session" : "Break"}</div>
          <div id="time-left" className={time <= redCon? "red-text":""}>{time <= 0? "00:00" : timeStr}</div>
          <div id="timer-controls">
            <i id="start_stop" className={running ? "fa-solid fa-pause" : "fa-solid fa-play"} onClick={handleClick}></i>
            <i id="reset" class="fa-solid fa-arrow-rotate-left" onClick={handleClick}></i>
          </div>
        </div>
        <div id="session-controls">
          <div id="session-label">Session Duration</div>
          <div class="controls">
            <div id="session-decrement" onClick={handleClick}></div>
            <div id="session-length">{sLength}</div>
            <div id="session-increment" onClick={handleClick}></div>
          </div>
        </div>
      </div>
      <audio id="beep" preload="auto"><source src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav" type="audio/wav" /></audio>
    </div>
  ); }
}

root.render(<App/>, document.getElementById("root"));
