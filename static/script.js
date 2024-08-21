document.addEventListener("DOMContentLoaded", function () {
    const realTimeButton = document.getElementById('realTimeButton');
    const uploadButton = document.getElementById('uploadButton');
    const realTimeSection = document.getElementById('realTimeSection');
    const uploadSection = document.getElementById('uploadSection');
    const video = document.getElementById('video');
    const captureButton = document.getElementById('capture');
    const realtimeEmotionDisplay = document.getElementById('realtime-emotion');
    const uploadInput = document.getElementById('upload');
    const uploadAnalyzeButton = document.getElementById('upload-analyze');
    const uploadEmotionDisplay = document.getElementById('upload-emotion');
    let imageData = null;

    // 초기 설정: 아무 섹션도 보이지 않음
    realTimeSection.style.display = 'none';
    uploadSection.style.display = 'none';

    // 버튼 클릭 이벤트 처리
    realTimeButton.addEventListener('click', function () {
        realTimeSection.style.display = 'block';
        uploadSection.style.display = 'none';
    });

    uploadButton.addEventListener('click', function () {
        uploadSection.style.display = 'block';
        realTimeSection.style.display = 'none';
    });

    // 실시간 감정 분석
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (err) {
            console.log("An error occurred: " + err);
        });

    captureButton.addEventListener('click', function () {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        imageData = canvas.toDataURL('image/jpeg');
        analyzeImage(imageData, realtimeEmotionDisplay);
    });

    // 업로드된 이미지 감정 분석
    uploadInput.addEventListener('change', function () {
        const file = uploadInput.files[0];
        const reader = new FileReader();
        reader.onloadend = function () {
            imageData = reader.result;
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    });

    uploadAnalyzeButton.addEventListener('click', function () {
        if (!imageData) {
            uploadEmotionDisplay.textContent = 'Please upload an image first!';
            return;
        }
        analyzeImage(imageData, uploadEmotionDisplay);
    });

    // 이미지 데이터 서버로 보내기
    function analyzeImage(imageData, displayElement) {
        fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData })
        })
        .then(response => response.json())
        .then(data => {
            if (data.emotion) {
                displayElement.textContent = `Emotion: ${data.emotion}`;
            } else if (data.error) {
                displayElement.textContent = `Error: ${data.error}`;
            }
        })
        .catch(err => {
            displayElement.textContent = `Error analyzing emotion: ${err}`;
        });
    }
});
