import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AudioRecorder = () => {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [chunks, setChunks] = useState([]);
    const [audioURL, setAudioURL] = useState('');
    const [recording, setRecording] = useState(false);
    const BASEURL = process.env.REACT_APP_BASEURL
    useEffect(() => {
        let recorder;
        if (navigator.mediaDevices.getUserMedia) {
            const constraints = { audio: true };
            navigator.mediaDevices.getUserMedia(constraints)
                .then(stream => {
                    recorder = new MediaRecorder(stream);
                    setMediaRecorder(recorder);
                    recorder.ondataavailable = e => {
                        setChunks(prevChunks => [...prevChunks, e.data]);
                    };
                })
                .catch(err => {
                    console.error('The following getUserMedia error occurred:', err);
                });
        } else {
            console.error('getUserMedia not supported on your browser!');
        }

        return () => {
            if (recorder && recorder.state === 'recording') {
                recorder.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (mediaRecorder) {
            startRecording();
        }

        return () => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                stopRecording();
            }
        };
    }, [mediaRecorder]);

    const startRecording = () => {
        if (mediaRecorder) {
            setChunks([]);
            mediaRecorder.start();
            setRecording(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            setRecording(false);
            saveAudio();
        }
    };

    const saveAudio = async () => {
        if (chunks.length === 0) return;

        const formData = new FormData();
        formData.append('audio', new Blob(chunks, { type: 'audio/ogg; codecs=opus' }));
        
        try {
            const response = await axios.post(`${BASEURL}/upload`, formData);
            console.log('Audio saved:', response.data);
            setAudioURL(response.data.audioURL);
        } catch (error) {
            console.error('Error saving audio:', error);
        }
    };

    return (
        <div>
            <h1>Audio Recorder</h1>
            {recording && <p>Recording...</p>}
            {audioURL && <audio controls src={audioURL}></audio>}
        </div>
    );
};

export default AudioRecorder;
