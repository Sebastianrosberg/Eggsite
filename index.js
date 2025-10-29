
let countdown = null;
let timeLeft = 0;

function updateTempInputs() {
    const originChoice = document.querySelector('input[name="origin"]:checked').value;
    const doneChoice = document.querySelector('input[name="done"]:checked').value;

    const eggWrap = document.getElementById("eggCustomWrap");
    const tgtWrap = document.getElementById("targetCustomWrap");

    if (originChoice === "custom") {
        eggWrap.classList.remove("hidden");
        setTimeout(() => document.getElementById("eggCustom").focus(), 0);
    } else {
        eggWrap.classList.add("hidden");
    }

    if (doneChoice === "custom") {
        tgtWrap.classList.remove("hidden");
        setTimeout(() => document.getElementById("targetCustom").focus(), 0);
    } else {
        tgtWrap.classList.add("hidden");
    }
}

function calculate() {
    clearInterval(countdown);
    countdown = null;


    const size = Number(document.getElementById("size").value);


    const originChoice = document.querySelector('input[name="origin"]:checked').value;
    let startTemp;
    if (originChoice === "fridge") {
        startTemp = 5;
    } else if (originChoice === "room") {
        startTemp = 20;
    } else {
        // custom: tillåt komma
        const eggStr = (document.getElementById("eggCustom").value || "").replace(",", ".");
        startTemp = Number(eggStr);
    }

    const doneChoice = document.querySelector('input[name="done"]:checked').value;
    let targetTemp;
    if (doneChoice === "custom") {
        const tgtStr = (document.getElementById("targetCustom").value || "").replace(",", ".");
        targetTemp = Number(tgtStr);
    } else {
        targetTemp = Number(doneChoice);
    }

    const waterTemp = 100;
    const ywr = 1.0;
    let K;

    if (targetTemp === 63) K = 27.1;
    else if (targetTemp === 67) K = 28.7;
    else if (targetTemp === 70) K = 32.8;
    else K = 27.0;

    const out = document.getElementById("result");
    const det = document.getElementById("details");

    if (isNaN(size) || isNaN(startTemp) || isNaN(targetTemp)) {
        out.textContent = "Fyll i alla värden först.";
        det.textContent = "";
        return;
    }
    if (startTemp < 0 || startTemp >= 100) {
        out.textContent = "Starttemperaturen bör vara mellan 0–99 °C.";
        det.textContent = "";
        return;
    }
    if (targetTemp <= startTemp || targetTemp >= 100) {
        out.textContent = "Måltemperaturen måste vara högre än starttemp men under 100 °C.";
        det.textContent = "";
        return;
    }

    const ratio = (ywr * (startTemp - waterTemp)) / (targetTemp - waterTemp);
    if (ratio <= 0) {
        out.textContent = "Ogiltiga temperaturer. Justera och försök igen.";
        det.textContent = "";
        return;
    }

    const power = Math.pow(size, 2 / 3);
    const logValue = Math.log(ratio);
    const t = power * K * logValue;

    if (t <= 0) {
        out.textContent = "Kunde inte räkna ut en giltig tid.";
        det.textContent = "";
        return;
    }

    const mins = Math.floor(t / 60);
    const secs = Math.round(t - mins * 60);

    out.textContent = "Koktid: " + mins + " min " + secs.toString().padStart(2, "0") + " sek";
    det.textContent = "Storlek= " + size + ", äggens temp= " + startTemp + "°C, vattnets temp=100°C, mål temp=" + targetTemp + "°C";

    const btn = document.getElementById("startTimerBtn");
    btn.style.display = "block";
    timeLeft = Math.round(t);
}

function startTimer() {
    document.getElementById("timerView").style.display = "grid";
    document.getElementById("timerView").setAttribute("aria-hidden", "false");
    document.getElementById("mainView").style.display = "none";

    clearInterval(countdown);

    const mins = Math.floor(timeLeft / 60);
    const secs = Math.round(timeLeft - mins * 60);
    document.getElementById("bigTimer").textContent = mins + ":" + secs.toString().padStart(2, "0");

    countdown = setInterval(function () {
        timeLeft--;

        const m = Math.floor(timeLeft / 60);
        const s = Math.round(timeLeft - m * 60);
        document.getElementById("bigTimer").textContent = m + ":" + s.toString().padStart(2, "0");

        if (timeLeft <= 0) {
            clearInterval(countdown);
            document.getElementById("bigTimer").textContent = "✅ KLART!";
            playBeep();
        }
    }, 1000);
}

function goBack() {
    clearInterval(countdown);
    document.getElementById("timerView").style.display = "none";
    document.getElementById("timerView").setAttribute("aria-hidden", "true");
    document.getElementById("mainView").style.display = "block";
}

function stopTimer() {
    clearInterval(countdown);
    timeLeft = 0;
    document.getElementById("bigTimer").textContent = "00:00";
}


document.getElementById("calcBtn").addEventListener("click", calculate);
document.getElementById("startTimerBtn").addEventListener("click", startTimer);
document.getElementById("backBtn").addEventListener("click", goBack);
document.getElementById("stopBtn").addEventListener("click", stopTimer);

document.getElementById("origin").addEventListener("change", updateTempInputs);
document.getElementById("done").addEventListener("change", updateTempInputs);
updateTempInputs(); 
