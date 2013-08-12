# OCRDrone

A demo application for NodeCopter - uses the onboard video stream to detect written flight commands in real-time.

## Demo
You can see a short video of this application being demoed at NodeCopter Southampton: http://youtu.be/Oj0n5iOXN2U?t=12m10s (at 12:10)

Here's another video of exactly the same demo, created by stitching together all the images captured by this application. This is what OCRDrone sees and processes: http://youtu.be/aGo6oPC92QE 

## Prerequisites

ar-drone (https://github.com/felixge/node-ar-drone):

```bash
npm install ar-drone
```

nodecr (https://github.com/joscha/nodecr):

```bash
npm install nodecr
```

tesseract: https://code.google.com/p/tesseract-ocr/
ffmpeg: http://ffmpeg.org/download.html

Note: The executable binaries for tesseract and ffmpeg must be in your system path.

## Tips

Although it is possible to show a laptop/tablet screen at the onboard camera, we found that text printed on paper worked much better.

The longer the text/command, the better the match. We found that tesseract preferred "LAND PLEASE" to just "LAND".

It appears that the video stream can only be consumed by one application. So, if you're capturing the onboard video with another application, then you might get TcpVideoStream errors from OCRDrone.  

Occasionally, we got TcpVideoStream errors when starting the application. Pressing Ctrl+C and restarting the application a couple of times eventually got it working. Sometimes we had to disconnect/reconnect to the WiFi.

