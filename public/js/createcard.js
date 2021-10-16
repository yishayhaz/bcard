const next = document.getElementById('next');
const cards = [...document.querySelectorAll('.inputs-card')];
let step = 0;
const email_tester = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let headline_html = document.getElementById('headline');
let headline_note_html = document.getElementById('headline-note');
let headlines = [
    'עוד קצת פרטים..',
    'לוגו',
    'רשתות חברתיות',
    "איזה עיצוב תרצו לכרטיס?"
];
let headline_notes = [
    'חשוב למלא כמה שיותר פרטים ליצירת קשר!',
    'אין לכם לוגו? <a href="https://dam-website4u.com/" target="_blank">דברו איתי</a>',
    'לא חייב, אבל זה עוזר לפרסום של העסק.',
    "תמיד אפשר לשנות ולעדכן"
];

let lname = document.getElementById('lname');
let bname = document.getElementById('bname');
let description = document.getElementById('description');
let descriptionBottomNote = document.getElementById('description-bottom-note');

let bemail = document.getElementById('bemail');
let btel = document.getElementById('btel');
let whatsapp = document.getElementById('whatsapp');
let tlocation = document.getElementById('tlocation');
let llocation = document.getElementById('llocation');

let logo_btn = document.getElementById('logo-btn');
let logo = document.getElementById('logo');
let img = logo.nextElementSibling.nextElementSibling.nextElementSibling;

let facebook_username = document.getElementById('facebook_username');
let facebook_link = document.getElementById('facebook_link');
let instagram_username = document.getElementById('instagram_username');
let instagram_link = document.getElementById('instagram_link');
let twitter_username = document.getElementById('twitter_username');
let twitter_link = document.getElementById('twitter_link');
let tiktok_username = document.getElementById('tiktok_username');
let tiktok_link = document.getElementById('tiktok_link');

let bcard_example = document.querySelectorAll('.bcard-example');

// clear validation notes
document.querySelectorAll('input, textarea').forEach(inp => {
    inp.addEventListener('input', () => {
        try {
            inp.nextElementSibling.nextElementSibling.innerHTML = '';
        } catch {
            inp.parentElement.nextElementSibling.nextElementSibling.innerHTML = '';
        }
    })
})

// update link-name label's text
lname.addEventListener('input', () => {
    if (!/[^|a-z0-9]+/g.test(lname.value)) document.getElementById('link-name-span').innerHTML = lname.value;
})

next.addEventListener('click', () => {
    switch (step) {
        case 0:
            if (firstStepValidation()) {
                fetch(`/b/${lname.value}`)
                    .then(res => {
                        if (res.status == 201) {
                            step++
                            changeCard();
                        } else {
                            lname.nextElementSibling.nextElementSibling.innerHTML = 'השם הזה תפוס.';
                        }
                    })
            }
            break;
        case 1:
            if (secondStepValidation()) {
                step++
                changeCard();
                next.style.display = 'none'
            }
            break;
        case 2:
            if (next.style.display != 'none') {
                step++;
                changeCard();
            }
            break;
        case 3:
            if (forthStepValidation()) {
                step++;
                changeCard();
                next.style.display = 'none';
            }
            break;
    }
})

function changeCard() {
    cards[step - 1].classList.add('r');
    setTimeout(() => {
        cards[step - 1].classList.remove('a', 'r')
        cards[step].classList.add('a');

        headline_html.innerHTML = headlines[step - 1];
        headline_note_html.innerHTML = headline_notes[step - 1];
    }, 300)
}
function firstStepValidation() {
    if (/[^|a-z0-9]+/g.test(lname.value)) {
        lname.nextElementSibling.nextElementSibling.innerHTML = 'a - z, ללא רווחים או סימנים מיוחדים.';
        return false;
    } else if (lname.value.length < 3) {
        lname.nextElementSibling.nextElementSibling.innerHTML = 'שדה זה חייב להכיל לכל הפחות שלושה תווים';
        return false;
    }
    if (Number(bname.value)) {
        bname.nextElementSibling.nextElementSibling.innerHTML = 'הכותרת לא יכולה להיות רק ספרות';
        return false;
    }
    else if (bname.value.length < 10 || bname.value.length > 50) {
        bname.nextElementSibling.nextElementSibling.innerHTML = 'מינימום 10 תווים, מקסימום 50.';
        return false;
    }
    if (description.value.length < 50 || description.value.length > 200) {
        description.nextElementSibling.nextElementSibling.innerHTML = 'מינימום 50 תווים, מקסימום 200.';
        return false;
    }
    return true;
}
function secondStepValidation() {
    if (!(email_tester.test(bemail.value))) {
        bemail.nextElementSibling.nextElementSibling.innerHTML = 'תיבת המייל אינה תקינה';
        return false;
    }
    if (btel.value.length == 0) {
        btel.nextElementSibling.nextElementSibling.innerHTML = 'שדה זה הינו חובה';
        return false;
    }
    if (btel.value[0] == 0 && (btel.value.length == 10 || btel.value.length == 9)) btel.value = btel.value.replace('0', '+972')
    else if (btel.value.length > 0 && (btel.value.length > 13 || btel.value.length < 12)) {
        btel.nextElementSibling.nextElementSibling.innerHTML = 'מספר הטלפון חייב להיות באורך 12 או 13 ספרות';
        return false;
    }
    if (btel.value[0] == 0 && btel.value.lastIndexOf('+972') != 0) {
        btel.nextElementSibling.nextElementSibling.innerHTML = 'מספר טלפון חייב להתחיל ב+972';
        return false;
    }
    if (whatsapp.value[0] == '0' && whatsapp.value.length == 10) whatsapp.value = whatsapp.value.replace('0', '+972');
    if (whatsapp.value.length > 0 && (whatsapp.value.length != 13)) {
        whatsapp.nextElementSibling.nextElementSibling.innerHTML = 'המספר לא באורך 13 ספרות';
        return false;
    }
    if (whatsapp.value.length > 0 && whatsapp.value.lastIndexOf('+972') !== 0) {
        whatsapp.nextElementSibling.nextElementSibling.innerHTML = 'מספר הטלפון חייב להתחיל ב+972';
        return false;
    }
    if (tlocation.value.length == 0 && llocation.value.length > 0) {
        llocation.parentElement.nextElementSibling.nextElementSibling.innerHTML = 'טקסט הינו חובה כשמשתמשים בקישור.';
        return false;
    }
    if (llocation.value.length > 0 && !linkIsValid(llocation.value, ['waze.com', 'goo.gl/', 'google.com/maps/'])) {
        llocation.parentElement.nextElementSibling.nextElementSibling.innerHTML = 'קישור לא תקין';
        return false;
    }
    return true;
}
function forthStepValidation() {
    // facebook validation
    if (facebook_username.value.length == 0 && facebook_link.value.length > 0) {
        facebook_link.parentElement.nextElementSibling.nextElementSibling.innerHTML = 'שם משתמש הינו חובה כשמשתמשים בקישור';
        return false;
    }
    if (!linkIsValid(facebook_link.value, ['facebook.com']) && facebook_link.value.length > 0) {
        facebook_link.parentElement.nextElementSibling.nextElementSibling.innerHTML = 'הקישור אינו תקין';
        return false;
    }

    // instagram validation
    if (instagram_username.value.length == 0 && instagram_link.value.length > 0) {
        instagram_link.parentElement.nextElementSibling.nextElementSibling.innerHTML = 'שם משתמש הינו חובה כשמשתמשים בקישור';
        return false;
    }
    if (!linkIsValid(instagram_link.value, ['instagram.com']) && instagram_link.value.length > 0) {
        instagram_link.parentElement.nextElementSibling.nextElementSibling.innerHTML = 'הקישור אינו תקין';
        return false;
    }

    // twitter validation
    if (twitter_username.value.length == 0 && twitter_link.value.length > 0) {
        twitter_link.parentElement.nextElementSibling.nextElementSibling.innerHTML = 'שם משתמש הינו חובה כשמשתמשים בקישור';
        return false;
    }
    if (!linkIsValid(twitter_link.value, ['twitter.com']) && twitter_link.value.length > 0) {
        twitter_link.parentElement.nextElementSibling.nextElementSibling.innerHTML = 'הקישור אינו תקין';
        return false;
    }

    // tiktok validation
    if (tiktok_username.value.length == 0 && tiktok_link.value.length > 0) {
        tiktok_link.parentElement.nextElementSibling.nextElementSibling.innerHTML = 'שם משתמש הינו חובה כשמשתמשים בקישור';
        return false;
    }
    if (!linkIsValid(tiktok_link.value, ['tiktok.com']) && tiktok_link.value.length > 0) {
        tiktok_link.parentElement.nextElementSibling.nextElementSibling.innerHTML = 'הקישור אינו תקין';
        return false;
    }
    return true
}
function linkIsValid(link, po) {
    if (!link.lastIndexOf('https://') == 0) return false;
    if (!(po.some(opt => link.includes(opt)))) return false;
    return true;
}
// textarea scroll to bottom always
description.addEventListener('input', () => {
    description.scrollTop = description.scrollHeight;
    document.getElementById('textarea-length').innerHTML = description.value.length;
})

// ltr inputs
function ltrInput(me, m = 'not_minus_30px') {
    if (me.value.length > 0) {
        me.style.direction = 'ltr';
        if (typeof m != 'undefined' && m != "not_minus_30px") me.style.textIndent = '30px'
    } else {
        me.style.direction = 'rtl';
        me.style.textIndent = '10px'
    }
}

// input - file
logo_btn.addEventListener('click', () => {
    logo.click();
})
logo.addEventListener('change', () => {
    logo_btn.innerHTML = 'שינוי לוגו <i class="fas fa-arrow-circle-up"></i>';
    next.style.display = 'block';

    img.classList.add('imgshown')
    img.alt = logo.files[0].name;
    img.src = URL.createObjectURL(logo.files[0]);

    img.onload = function () {
        URL.revokeObjectURL(this.src);
    }
})

bcard_example.forEach(example => {
    example.addEventListener('click', () => {
        bcard_example.forEach(examp => examp.classList.remove('the_chosen_one'))
        document.getElementById('bcard_type').value = example.getAttribute('type_name');
        example.classList.add('the_chosen_one');
    })
})