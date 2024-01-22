import os
import librosa
import json

def extract_beats(mp3_folder, json_folder):
    # MP3 파일이 있는 폴더에서 모든 파일을 나열
    for file in os.listdir(mp3_folder):
        if file.endswith(".mp3"):
            file_path = os.path.join(mp3_folder, file)
            try:
                # 오디오 파일 로드
                y, sr = librosa.load(file_path, sr=None)

                # 비트 추적 수행
                tempo, beats = librosa.beat.beat_track(y=y, sr=sr)

                # 비트 타임스탬프 계산
                beat_times = librosa.frames_to_time(beats, sr=sr).tolist()

                # JSON 파일로 저장
                json_file_name = file.replace(".mp3", ".json")
                json_path = os.path.join(json_folder, json_file_name)
                with open(json_path, 'w') as json_file:
                    json.dump(beat_times, json_file)

                print(f"Processed: {file}")

            except Exception as e:
                print(f"Error processing {file}: {e}")

# 사용 예시
mp3_folder = "/path/to/mp3/folder"
json_folder = "/path/to/json/folder"
extract_beats(mp3_folder, json_folder)
