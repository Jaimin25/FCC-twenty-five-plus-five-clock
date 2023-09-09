import { useEffect, useState } from "react";
import "./App.css";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

function App() {
	const [breakLen, setBreakLen] = useState(5);
	const [sessionLen, setSessionLen] = useState(25);
	const [timeLeft, setTimeLeft] = useState(sessionLen * 60);
	const [timingType, setTimingtype] = useState("session");
	const [running, setRunning] = useState(false);

	const handleBreakDec = () => {
		if (breakLen > 1) {
			setBreakLen(breakLen - 1);
		}
	};

	const handleBreakInc = () => {
		if (breakLen < 60) {
			setBreakLen(breakLen + 1);
		}
	};

	const handleSessionDec = () => {
		if (sessionLen > 1) {
			setSessionLen(sessionLen - 1);
			setTimeLeft(timeLeft - 60);
		}
	};

	const handleSessionInc = () => {
		if (sessionLen < 60) {
			setSessionLen(sessionLen + 1);
			setTimeLeft(timeLeft + 60);
		}
	};

	const handleReset = () => {
		setRunning(false);
		setBreakLen(5);
		setSessionLen(25);
		setTimeLeft(25 * 60);
		setTimingtype("session");

		const audio = document.getElementById("beep");
		audio.pause();
		audio.currentTime = 0;
	};

	const togglePlay = () => {
		setRunning(!running);
	};

	const formatTime = (seconds) => {
		const mm = Math.floor(seconds / 60)
			.toString()
			.padStart(2, "0");
		const ss = (seconds % 60).toString().padStart(2, "0");
		return `${mm}:${ss}`;
	};

	useEffect(() => {
		let timer;
		if (running) {
			timer = setInterval(() => {
				if (timeLeft == 0) {
					const audio = document.getElementById("beep");
					audio.play();

					if (timingType === "session") {
						setTimingtype("break");
						setTimeLeft(breakLen * 60);
					} else {
						setTimingtype("session");
						setTimeLeft(sessionLen * 60);
					}
				} else {
					setTimeLeft(timeLeft - 1);
				}
			}, 1000);
		} else {
			clearInterval(timer);
		}
		return () => clearInterval(timer);
	}, [running, timeLeft, timingType, breakLen, sessionLen]);

	const title = timingType === "session" ? "session" : "break";

	return (
		<div className="main">
			<div className="break-session-length">
				<div id="break-label">
					<p>Break Length</p>
					<div className="ctrl-div">
						<button
							id="break-decrement"
							disabled={running}
							onClick={handleBreakDec}>
							<FaArrowDown />
						</button>
						<p id="break-length">{breakLen}</p>
						<button
							id="break-increment"
							disabled={running}
							onClick={handleBreakInc}>
							<FaArrowUp />
						</button>
					</div>
				</div>
				<div id="session-label">
					<p>Session Length</p>
					<div className="ctrl-div">
						<button
							id="session-decrement"
							disabled={running}
							onClick={handleSessionDec}>
							<FaArrowDown />
						</button>
						<p id="session-length">{sessionLen}</p>
						<button
							id="session-increment"
							disabled={running}
							onClick={handleSessionInc}>
							<FaArrowUp />
						</button>
					</div>
				</div>
			</div>
			<div className="timer-frame">
				<div className="timer">
					<h2 id="timer-label">{title}</h2>
					<h3 id="time-left">{formatTime(timeLeft)}</h3>
				</div>
				<button
					id="start_stop"
					onClick={togglePlay}>
					Start/Stop
				</button>
				<button
					id="reset"
					onClick={handleReset}>
					Reset
				</button>
			</div>
			<audio
				id="beep"
				preload="auto"
				src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
			/>
		</div>
	);
}

export default App;
