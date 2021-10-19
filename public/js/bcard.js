let img = document.querySelector('img.logo');

img.addEventListener('load', () => {
    var max = Math.max(img.width, img.height);
    var min = Math.min(img.width, img.height);
    if((max - min) < 75) {
        img.width = img.height;
        img.style.borderRadius = '50%';
    }
})