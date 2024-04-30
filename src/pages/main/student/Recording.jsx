import React, { useState, useEffect } from 'react';
import { fetchData } from '../admin/SetFormData';

const AudioToTextConverter = (props) => {
  const [audioRecording, setAudioRecording] = useState('');
  const [foundNumbers, setFoundNumbers] = useState('');
  const BASEURL = process.env.REACT_APP_BASEURL
  const url=`${BASEURL}/student/setRecoredAudioTextInAttendanceByCourseID`

  useEffect(() => {
    let recognition = null;
    if ('webkitSpeechRecognition' in window) {
      recognition = new window.webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      recognition = new window.SpeechRecognition();
    }

    if (recognition) {
      recognition.lang = 'en-US';
      recognition.continuous = true;

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setAudioRecording(transcript);
        findAndPrintNumbers(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.start();
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const findAndPrintNumbers = (text) => {
    const numberRegex = /\b\d+\b/g;
    const numberMatches = text.match(numberRegex);
    document.cookie=`audioText=${text};audioNumber=${numberMatches}`
    document.cookie=`audioNumber=${numberMatches}`
    if (numberMatches) {
      const numbersString = numberMatches.join('/');
      const data={
        studentEmail:props.email,
        studentRollNo:props.roll,
        date:props.date,
        timeSlot:props.timeSlot,
        degree:props.degree,
        audioText:text,
        audioNumber:numbersString
      }
      fetchData(url,data)
      .then((res)=>{
          
      })
      .catch((error)=>{
        console.log(error)
      })
      setFoundNumbers(numbersString);
    } else {
      setFoundNumbers('');
    }
  };

  return (
    <div>
      <div>
        <h3>Recorded Audio:</h3>
        <p>{audioRecording}</p>
      </div>
      <div>
        <h3>Found Numbers:</h3>
        <p>{foundNumbers}</p>
      </div>
    </div>
  );
};

export default AudioToTextConverter;
