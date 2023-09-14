import React, { Component } from 'react';
import Webcam from 'react-webcam';
import RecordRTC from 'recordrtc';
import bhashini from 'bhashini-translation'; // Import bhashini-translation

import './ASRRecorder.css'; // Add your own CSS file for styling

class ASRRecorder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recording: false,
            recordedAudio: null,
            webcamEnabled: false, // Added webcamEnabled state
            asrResult: '',
            translatedText: '',
            selectedLanguage: 'en',
            bhashiniAudio: '',
            showSpeakingAnimation: false, // Add state for speaking animation
            showLoudnessAnimation: false, // Add state for loudness detection animation
        };
        this.webcamRef = React.createRef();
        this.mediaRecorder = null;
    }

    startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new RecordRTC(stream, {
                type: 'audio',
                recorderType: RecordRTC.StereoAudioRecorder, // force for all browsers
                mimeType: 'audio/wav', // Change this to 'audio/mp3' if you have an MP3 encoder
            });

            this.mediaRecorder.startRecording();

            this.setState({
                recording: true,
                webcamEnabled: true, // Enable webcam when recording starts
                showSpeakingAnimation: true, // Enable speaking animation when recording starts

            });
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    };

    handleLanguageChange = async (event) => {
        const selectedLanguage = event.target.value;
        await this.setState({ selectedLanguage });
        console.log(this.state.selectedLanguage);
    };

    stopRecording = async () => {
        if (this.mediaRecorder) {
            this.mediaRecorder.stopRecording(async () => {
                const blob = this.mediaRecorder.getBlob();
                const recordedAudio = URL.createObjectURL(blob);

                // Reset webcam permission
                const tracks = this.webcamRef.current.stream.getTracks();
                tracks.forEach((track) => {
                    track.stop();
                });

                // Convert recorded audio to base64
                const reader = new FileReader();
                reader.readAsDataURL(blob);

                reader.onloadend = async () => {
                    const base64Audio = reader.result.split(',')[1];

                    // Call bhashini.asr() with the base64 audio data
                    const lang = this.state.selectedLanguage;
                    const sourceLang = this.state.selectedLanguage === 'en' ? 'hi' : 'en';
                    const text = await bhashini.asr(lang, base64Audio);
                    const translate = await bhashini.nmt(lang, sourceLang, text);
                    const audio = await bhashini.tts(sourceLang, translate);
                    this.setState({
                        asrResult: text, // Set the ASR result
                        recording: false,
                        webcamEnabled: false,
                        translatedText: translate,
                        bhashiniAudio: audio,
                        showSpeakingAnimation: false, // disable speaking animation when recording starts
                    });

                    this.setState({
                        recording: false,
                        recordedAudio,
                        webcamEnabled: false, // Disable webcam when recording stops
                    });
                };
            });
        }
    };

    render() {
        return (
            <div className="asr-recorder-container">
                <h2 className="title">Bhashini ⭐</h2>

                <div className="language-selector">
                    <label htmlFor="language-dropdown">Source Language:</label>
                    <hr />
                    <select
                        id="language-dropdown"
                        value={this.state.selectedLanguage}
                        onChange={this.handleLanguageChange}
                    >
                        <option value="en">English</option>
                        <option value="ta">Tamil - தமிழ்</option>
                        <option value="hi">Hindi - हिन्दी</option>
                        <option value="kn">Kannada - ಕನ್ನಡ</option>
                        <option value="ml">Malayalam - മലയാളം</option>
                        <option value="te">Telugu - తెలుగు</option>
                    </select>
                </div>
                <div className="button-container">
                    {this.state.recording ? (
                        <button onClick={this.stopRecording}> Stop Recording</button>
                    ) : (
                        <button onClick={this.startRecording}>  🎤 Start Recording</button>
                    )}
                </div>
                {this.state.webcamEnabled && ( // Show webcam only when webcamEnabled is true
                    <div className="webcam-container">
                        {/* Add speaking animation */}
                        {this.state.showSpeakingAnimation && (

                            <div className="speaking-animation"></div>
                        )}
                        <Webcam
                            ref={this.webcamRef}
                            audio={true}
                            video={false}
                            muted
                            screenshotFormat="image/jpeg"
                            style={{
                                width: '50%',
                                aspectRatio: '1.33', // Adjust aspect ratio as needed
                            }}
                        />
                    </div>
                )}
                <div className="text-container">
                    <span> 💡 Click on stop recording to see the result. </span>
                    <textarea
                        className="stt"
                        placeholder="🗣️ Speech to Text Output will appear here.."
                        rows="4"
                        cols="50"
                        value={this.state.asrResult} // Set the value of the text box to the ASR result
                        readOnly // Make the text box read-only
                    ></textarea>
                    <textarea
                        className="translate-box"
                        placeholder="🌐 Translated Output will appear here..."
                        rows="4"
                        cols="50"
                        value={this.state.translatedText} // Set the value of the text box to the ASR result
                        readOnly // Make the text box read-only
                    ></textarea>
                    {this.state.bhashiniAudio && (
                        <div className="audio-container">
                            <span> 🌐 Translated Audio 🔊 </span>
                            <audio controls src={this.state.bhashiniAudio} />
                        </div>
                    )}
                </div>
                {/* <img src="https://presentations.gov.in/presgov_new/wp-content/uploads/2020/06/Digital-india-black.jpg?x42937" alt = "Digital India" height="100px" width="150px"/> */}
            </div>
        );
    }
}

export default ASRRecorder;
