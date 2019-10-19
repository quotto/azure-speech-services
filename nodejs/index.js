"use strict";

// pull in the required packages.
var sdk = require("microsoft-cognitiveservices-speech-sdk");
var fs = require("fs");
var player = require('node-wav-player');

// replace with your own subscription key,
// service region (e.g., "westus"), and
// the name of the file you want to run
// through the speech recognizer.
var subscriptionKey = "subscriptionkey";
var serviceRegion = "westus"; // e.g., "westus"
var filename = "asano.wav"; // 16000 Hz, Mono

// create the push stream we need for the speech sdk.
var pushStream = sdk.AudioInputStream.createPushStream();

// open the file and push it to the push stream.
fs.createReadStream(filename).on('data', function(arrayBuffer) {
  pushStream.write(arrayBuffer.slice());
}).on('end', function() {
  pushStream.close();
});

// we are done with the setup
console.log("Now recognizing from: " + filename);

// now create the audio-config pointing to our stream and
// the speech config specifying the language.
var audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

// setting the recognition language to English.
speechConfig.speechRecognitionLanguage = "ja-JP";

// create the speech recognizer.
var recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

//  The event recognizing signals that an intermediate recognition result is received.
recognizer.recognizing = function(s, e){
    console.log('recognizing text', e.result.text);
};

//  The event recognized signals that a final recognition result is received.
recognizer.recognized = function(s, e){
    console.log('recognized text', e.result.text);
    script += e.result.text;
};

recognizer.speechEndDetected = (s, e)=>{
    console.log('speech end.');
             reco.close();
            System.exit(exitCode);
   recognizer.stopContinuousRecognitionAsync(()=>{
        console.log('stop recognition.');
        recognizer.close();
        recognizer = undefined;
    },(e)=>{
        console.trace("err - " + err);
    })
}

recognizer.startContinuousRecognitionAsync(
    ()=>{
        console.log("start recognition.");
        return new Promise((resolve,reject)=>{
            player.play({ path: filename }).then(() => {
                resolve();
            }).catch((err) => {
                console.log(err);
                reject();
            });
        });
},
(err)=>{
    console.trace("err - " + err);

    recognizer.close();
    recognizer = undefined;
})