import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from 'antd';
import Webcam from "react-webcam";
import * as SC from "./camera.styles"
import '../../App.css';
import axios from "axios";

const { Footer } = Layout;

function App() {
	const webcamRef = React.useRef(null);
	const mediaRecorderRef = React.useRef(null);
	const [capturing, setCapturing] = React.useState(false);
	const [recordedChunks, setRecordedChunks] = React.useState([]);

	const axiosRunner = () => {
		// 	axios.get("https://api.tesggdgdsgd.com/v1/breeds").then((data) => {
		// 	console.log("data came --> ", data);
		// }); 
	};

	useEffect(() => {
		axiosRunner();
	}, []);

	const handleStartCaptureClick = React.useCallback(() => {
		setCapturing(true);
		mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
			mimeType: "video/webm",
		});
		mediaRecorderRef.current.addEventListener(
			"dataavailable",
			handleDataAvailable
		);
		mediaRecorderRef.current.start();
	}, [webcamRef, setCapturing, mediaRecorderRef]);

	useEffect(() => {
		console.log("recordedChunks -->", recordedChunks);
	}, [recordedChunks]);

	const handleDataAvailable = React.useCallback(
		({ data }) => {
			if (data.size > 0) {
				setRecordedChunks((prev) => prev.concat(data));
			}
		},
		[setRecordedChunks]
	);

	const handleStopCaptureClick = React.useCallback(() => {
		mediaRecorderRef.current.stop();
		setCapturing(false);
	}, [mediaRecorderRef, webcamRef, setCapturing]);

	const handleDownload = React.useCallback(() => {
		if (recordedChunks.length) {
			const blob = new Blob(recordedChunks, {
				type: "video/webm",
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			document.body.appendChild(a);
			a.style = "display: none";
			a.href = url;
			a.download = "react-webcam-stream-capture.webm";
			a.click();
			window.URL.revokeObjectURL(url);
			setRecordedChunks([]);
		}
	}, [recordedChunks]);

	return (
		<>
        <Layout>
        <SC.Div className="video-frame">
        <Webcam audio={true} ref={webcamRef} />
        </SC.Div>
        <SC.DivButton>
        {capturing ? (
				<button onClick={handleStopCaptureClick}>Stop Capture</button>
			) : (
				<button onClick={handleStartCaptureClick}>Start Capture</button>
			)}
			{recordedChunks.length > 0 && (
				<button onClick={handleDownload}>Download</button>
			)} 
        </SC.DivButton>
      
        </Layout>
        			
		</>
	);
}

export default App;