let img = document.querySelector('img.logo');

img.addEventListener('load', () => {
    if(Math.abs(img.width - img.height) * 100 / Math.max(img.width - img.height) < 25) {
        img.width = img.height;
        img.style.borderRadius = '50%';
    }
});