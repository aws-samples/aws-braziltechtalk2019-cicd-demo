function showImage() {
    let file = document.getElementById('upload').files[0];
    let reader = new FileReader();
    let image = document.getElementById('imgCelebrity');

    reader.onload = function (e) {
        image.src = e.target.result;
    }

    reader.readAsDataURL(file);
}