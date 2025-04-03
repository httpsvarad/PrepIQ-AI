# import cv2
# from flask import Flask, Response, jsonify
# import time
# import numpy as np
# from flask_cors import CORS
# from deepface import DeepFace

# app = Flask(__name__)
# CORS(app, supports_credentials=True)

# # Load Haarcascade models
# face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
# eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_eye.xml")

# last_face_detected_time = time.time()
# face_absence_threshold = 5  # 5 seconds
# motion_detected = False
# last_frame = None
# cap = cv2.VideoCapture(0)

# analysis_data = {"eye_contact": 0, "motion": 0, "face_absence": 0, "expressions": {}}


# def detect_motion(frame):
#     global last_frame, motion_detected
#     if last_frame is None:
#         last_frame = frame
#         return False
    
#     diff = cv2.absdiff(last_frame, frame)
#     gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
#     _, thresh = cv2.threshold(gray, 30, 255, cv2.THRESH_BINARY)
#     motion = np.sum(thresh) > 50000  # Sensitivity threshold
#     last_frame = frame
#     return motion


# def analyze_expression(face_image):
#     try:
#         result = DeepFace.analyze(face_image, actions=['emotion'], enforce_detection=False)
#         return result[0]['dominant_emotion']
#     except:
#         return "unknown"


# def generate_frames():
#     global last_face_detected_time, analysis_data
#     while True:
#         success, frame = cap.read()
#         if not success:
#             break

#         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#         faces = face_cascade.detectMultiScale(gray, 1.1, 4)

#         if len(faces) > 0:
#             last_face_detected_time = time.time()
#             for (x, y, w, h) in faces:
#                 face_roi = frame[y:y+h, x:x+w]
#                 emotion = analyze_expression(face_roi)
#                 analysis_data["expressions"][emotion] = analysis_data["expressions"].get(emotion, 0) + 1

#                 eyes = eye_cascade.detectMultiScale(gray[y:y+h, x:x+w], 1.1, 3)
#                 if len(eyes) > 0:
#                     analysis_data["eye_contact"] += 1

#                 cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)

#         if detect_motion(frame):
#             analysis_data["motion"] += 1

#         _, buffer = cv2.imencode('.jpg', frame)
#         frame_data = buffer.tobytes()

#         yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame_data + b'\r\n')


# @app.route('/video_feed')
# def video_feed():
#     return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


# @app.route('/analyze', methods=['GET'])
# def analyze():
#     global last_face_detected_time, analysis_data
#     current_time = time.time()
#     face_detected = (current_time - last_face_detected_time <= face_absence_threshold)
#     if not face_detected:
#         analysis_data["face_absence"] += 1

#     suggestions = []
#     if analysis_data["face_absence"] > 3:
#         suggestions.append("Maintain presence on screen")
#     if analysis_data["eye_contact"] < 5:
#         suggestions.append("Maintain eye contact with the camera")
#     if analysis_data["motion"] > 5:
#         suggestions.append("Reduce unnecessary movements")

#     dominant_expression = max(analysis_data["expressions"], key=analysis_data["expressions"].get, default="neutral")
#     if dominant_expression in ["angry", "sad"]:
#         suggestions.append("Try to keep a neutral or positive expression")

#     report = {
#         "faceDetected": face_detected,
#         "eye_contact_score": analysis_data["eye_contact"],
#         "motion_score": analysis_data["motion"],
#         "dominant_expression": dominant_expression,
#         "suggestions": suggestions
#     }
    
#     analysis_data = {"eye_contact": 0, "motion": 0, "face_absence": 0, "expressions": {}}  # Reset analysis
#     return jsonify(report)


# if __name__ == "__main__":
#     app.run(debug=True)



# import cv2
# from flask import Flask, Response, jsonify
# import time
# import numpy as np
# from flask_cors import CORS
# from deepface import DeepFace

# app = Flask(__name__)
# CORS(app, supports_credentials=True)

# # Load Haarcascade models
# face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
# eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_eye.xml")

# last_face_detected_time = time.time()
# face_absence_threshold = 5  # 5 seconds
# motion_detected = False
# last_frame = None
# cap = cv2.VideoCapture(0)

# analysis_data = {"eye_contact": 0, "motion": 0, "face_absence": 0, "expressions": {}}
# suggestions = []


# def detect_motion(frame):
#     global last_frame, motion_detected
#     if last_frame is None:
#         last_frame = frame
#         return False

#     diff = cv2.absdiff(last_frame, frame)
#     gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
#     _, thresh = cv2.threshold(gray, 30, 255, cv2.THRESH_BINARY)
#     motion = np.sum(thresh) > 50000  # Sensitivity threshold
#     last_frame = frame
#     return motion


# def analyze_expression(face_image):
#     try:
#         result = DeepFace.analyze(face_image, actions=['emotion'], enforce_detection=False)
#         return result[0]['dominant_emotion']
#     except:
#         return "unknown"


# def generate_frames():
#     global last_face_detected_time, analysis_data, suggestions
#     while True:
#         success, frame = cap.read()
#         if not success:
#             break

#         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#         faces = face_cascade.detectMultiScale(gray, 1.1, 4)

#         if len(faces) > 0:
#             last_face_detected_time = time.time()
#             for (x, y, w, h) in faces:
#                 face_roi = frame[y:y+h, x:x+w]
#                 emotion = analyze_expression(face_roi)
#                 analysis_data["expressions"][emotion] = analysis_data["expressions"].get(emotion, 0) + 1

#                 eyes = eye_cascade.detectMultiScale(gray[y:y+h, x:x+w], 1.1, 3)
#                 if len(eyes) > 0:
#                     analysis_data["eye_contact"] += 1

#                 cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)

#         if detect_motion(frame):
#             analysis_data["motion"] += 1

#         # Generate suggestions
#         suggestions = []
#         if analysis_data["eye_contact"] < 5:
#             suggestions.append("Look at the camera!")
#         if analysis_data["motion"] > 5:
#             suggestions.append("Reduce movement!")
#         dominant_expression = max(analysis_data["expressions"], key=analysis_data["expressions"].get, default="neutral")
#         if dominant_expression in ["angry", "sad"]:
#             suggestions.append("Try to stay calm & neutral!")

#         # Display suggestions on the screen
#         y_offset = 30
#         for suggestion in suggestions:
#             cv2.putText(frame, suggestion, (50, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
#             y_offset += 30

#         _, buffer = cv2.imencode('.jpg', frame)
#         frame_data = buffer.tobytes()

#         yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame_data + b'\r\n')


# @app.route('/video_feed')
# def video_feed():
#     return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


# @app.route('/analyze', methods=['GET'])
# def analyze():
#     global last_face_detected_time, analysis_data, suggestions
#     current_time = time.time()
#     face_detected = (current_time - last_face_detected_time <= face_absence_threshold)
#     if not face_detected:
#         analysis_data["face_absence"] += 1
#         suggestions.append("Maintain presence on screen")

#     dominant_expression = max(analysis_data["expressions"], key=analysis_data["expressions"].get, default="neutral")

#     report = {
#         "faceDetected": face_detected,
#         "eye_contact_score": analysis_data["eye_contact"],
#         "motion_score": analysis_data["motion"],
#         "dominant_expression": dominant_expression,
#         "suggestions": suggestions
#     }

#     analysis_data = {"eye_contact": 0, "motion": 0, "face_absence": 0, "expressions": {}}  # Reset analysis
#     return jsonify(report)


# if __name__ == "__main__":
#     app.run(debug=True)

#PERFECT CODE BUT NO SUGGESTIONS
# import cv2
# from flask import Flask, Response, jsonify, request
# import time
# import numpy as np
# from flask_cors import CORS
# from deepface import DeepFace

# app = Flask(__name__)
# CORS(app, supports_credentials=True)

# # Load Haarcascade models
# face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
# eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_eye.xml")
# smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_smile.xml")

# cap = cv2.VideoCapture(0)
# interview_active = False
# start_time = None
# end_time = None
# analysis_data = {"eye_contact": 0, "face_presence": 0, "blink_count": 0, "expressions": {}, "smile_count": 0}
# blink_threshold = 3
# previous_eye_state = None

# def analyze_expression(face_image):
#     try:
#         result = DeepFace.analyze(face_image, actions=['emotion'], enforce_detection=False)
#         return result[0]['dominant_emotion']
#     except:
#         return "unknown"

# def generate_frames():
#     global analysis_data, previous_eye_state
#     while interview_active:
#         success, frame = cap.read()
#         if not success:
#             break

#         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#         faces = face_cascade.detectMultiScale(gray, 1.1, 4)

#         if len(faces) > 0:
#             analysis_data["face_presence"] += 1
#             for (x, y, w, h) in faces:
#                 face_roi = frame[y:y + h, x:x + w]
#                 emotion = analyze_expression(face_roi)
#                 analysis_data["expressions"][emotion] = analysis_data["expressions"].get(emotion, 0) + 1

#                 eyes = eye_cascade.detectMultiScale(gray[y:y + h, x:x + w], 1.1, 3)
#                 if len(eyes) > 0:
#                     analysis_data["eye_contact"] += 1
#                     current_eye_state = "open"
#                 else:
#                     current_eye_state = "closed"

#                 if previous_eye_state == "open" and current_eye_state == "closed":
#                     analysis_data["blink_count"] += 1

#                 previous_eye_state = current_eye_state

#                 smile = smile_cascade.detectMultiScale(gray[y:y + h, x:x + w], 1.7, 22)
#                 if len(smile) > 0:
#                     analysis_data["smile_count"] += 1

#                 # Draw bounding boxes
#                 cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
#                 for (ex, ey, ew, eh) in eyes:
#                     eye_box_size = (ew // 2, eh // 2)
#                     cv2.rectangle(frame, (x + ex, y + ey), (x + ex + eye_box_size[0], y + ey + eye_box_size[1]), (0, 255, 0), 2)
#                 for (sx, sy, sw, sh) in smile:
#                     cv2.rectangle(frame, (x + sx, y + sy), (x + sx + sw, y + sy + sh), (0, 255, 255), 2)

#         _, buffer = cv2.imencode('.jpg', frame)
#         frame_data = buffer.tobytes()
#         yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame_data + b'\r\n')

# @app.route('/start_interview', methods=['POST'])
# def start_interview():
#     global interview_active, start_time, analysis_data
#     interview_active = True
#     start_time = time.time()
#     analysis_data = {"eye_contact": 0, "face_presence": 0, "blink_count": 0, "expressions": {}, "smile_count": 0}
#     return jsonify({"message": "Interview started"})

# @app.route('/end_interview', methods=['POST'])
# def end_interview():
#     global interview_active, end_time
#     interview_active = False
#     end_time = time.time()
#     return jsonify({"message": "Interview ended, generating report"})

# @app.route('/interview_report', methods=['GET'])
# def interview_report():
#     if start_time is None or end_time is None:
#         return jsonify({"error": "No interview data available"}), 400

#     interview_duration = round(end_time - start_time, 2)
#     total_frames = analysis_data["face_presence"]
#     dominant_expression = max(analysis_data["expressions"], key=analysis_data["expressions"].get, default="neutral")
#     confidence_score = round((analysis_data["eye_contact"] / total_frames * 100) if total_frames else 0, 2)

#     report = {
#         "interview_duration_seconds": interview_duration,
#         "eye_contact_score": analysis_data["eye_contact"],
#         "eye_contact_percentage": confidence_score,
#         "blink_count": analysis_data["blink_count"],
#         "smile_count": analysis_data["smile_count"],
#         "dominant_expression": dominant_expression,
#         "confidence_score": confidence_score
#     }
#     return jsonify(report)

# @app.route('/video_feed')
# def video_feed():
#     return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# if __name__ == "__main__":
#     app.run(debug=True)


import cv2
from flask import Flask, Response, jsonify, request
import time
import numpy as np
from flask_cors import CORS
from deepface import DeepFace

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Load Haarcascade models
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_eye.xml")
smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_smile.xml")

cap = cv2.VideoCapture(0)
interview_active = False
start_time = None
end_time = None
analysis_data = {"eye_contact": 0, "face_presence": 0, "blink_count": 0, "expressions": {}, "smile_count": 0}
blink_threshold = 3
previous_eye_state = None

def analyze_expression(face_image):
    try:
        result = DeepFace.analyze(face_image, actions=['emotion'], enforce_detection=False)
        return result[0]['dominant_emotion']
    except:
        return "unknown"

def generate_frames():
    global analysis_data, previous_eye_state
    while interview_active:
        success, frame = cap.read()
        if not success:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)

        if len(faces) > 0:
            analysis_data["face_presence"] += 1
            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)  # Blue rectangle for face
                face_roi = frame[y:y + h, x:x + w]
                emotion = analyze_expression(face_roi)
                analysis_data["expressions"][emotion] = analysis_data["expressions"].get(emotion, 0) + 1

                eyes = eye_cascade.detectMultiScale(gray[y:y + h, x:x + w], 1.1, 3)
                for (ex, ey, ew, eh) in eyes:
                    cv2.rectangle(frame, (x + ex, y + ey), (x + ex + ew, y + ey + eh), (0, 255, 0), 2)  # Green rectangle for eyes

                if len(eyes) > 0:
                    analysis_data["eye_contact"] += 1
                    current_eye_state = "open"
                else:
                    current_eye_state = "closed"

                if previous_eye_state == "open" and current_eye_state == "closed":
                    analysis_data["blink_count"] += 1

                previous_eye_state = current_eye_state

                smile = smile_cascade.detectMultiScale(gray[y:y + h, x:x + w], 1.7, 22)
                for (sx, sy, sw, sh) in smile:
                    cv2.rectangle(frame, (x + sx, y + sy), (x + sx + sw, y + sy + sh), (0, 255, 255), 2)  # Yellow rectangle for smile

                if len(smile) > 0:
                    analysis_data["smile_count"] += 1

        _, buffer = cv2.imencode('.jpg', frame)
        frame_data = buffer.tobytes()
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame_data + b'\r\n')

@app.route('/start_interview', methods=['POST'])
def start_interview():
    global interview_active, start_time, analysis_data
    interview_active = True
    start_time = time.time()
    analysis_data = {"eye_contact": 0, "face_presence": 0, "blink_count": 0, "expressions": {}, "smile_count": 0}
    return jsonify({"message": "Interview started"})

@app.route('/end_interview', methods=['POST'])
def end_interview():
    global interview_active, end_time
    interview_active = False
    end_time = time.time() 
    cap.release()
    return jsonify({"message": "Interview ended, generating report"})

@app.route('/interview_report', methods=['GET'])
def interview_report():
    if start_time is None or end_time is None:
        return jsonify({"error": "No interview data available"}), 400

    interview_duration = round(end_time - start_time, 2)
    total_frames = analysis_data["face_presence"]
    dominant_expression = max(analysis_data["expressions"], key=analysis_data["expressions"].get, default="neutral")
    confidence_score = round((analysis_data["eye_contact"] / total_frames * 100) if total_frames else 0, 2)

    suggestions = []
    if confidence_score < 50:
        suggestions.append("Improve eye contact to appear more engaged.")
    if analysis_data["blink_count"] < 5:
        suggestions.append("Try to blink naturally to avoid appearing too rigid.")
    if analysis_data["smile_count"] == 0:
        suggestions.append("Smiling occasionally can make you appear more approachable.")
    if dominant_expression in ["angry", "sad", "fear"]:
        suggestions.append("Try to maintain a neutral or positive facial expression for a confident presence.")

    report = {
        "interview_duration_seconds": interview_duration,
        "eye_contact_score": analysis_data["eye_contact"],
        "eye_contact_percentage": confidence_score,
        "blink_count": analysis_data["blink_count"],
        "smile_count": analysis_data["smile_count"],
        "dominant_expression": dominant_expression,
        "confidence_score": confidence_score,
        "suggestions": suggestions
    }
    return jsonify(report)

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(debug=True)




    