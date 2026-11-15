function startMission() {
    document.getElementById("mission-screen").hidden = false;
}function chooseMoon() {
     window.location.href="moon.html";
}
function chooseSaturn() {
    window.location.href="Saturn.html";
}
    function completeDay() {
        let day = Number(document.getElementById("day").textContent);
         if (day >= 6) {
        return;
    }
        if (window.missionFailed) {
    alert("Mission has failed!");
    return;
}
        day = day + 1;
        let oxygen = Number(document.getElementById("oxygen").textContent);
        oxygen = Math.max(0, oxygen - 10);
        let water = Number(document.getElementById("water").textContent);
        water = Math.max(0, water - 7);
        let food = Number(document.getElementById("food").textContent);
        food = Math.max(0, food - 9);
        let power = Number(document.getElementById("power").textContent);
        power = Math.max(0, power - 10);
        document.getElementById("day").textContent = day;
        let progress = Math.min(day - 1, 6);
        document.getElementById("mission-progress").value = progress;
        document.getElementById("progress-text").textContent = Math.round((progress / 5) * 100) + "%";
        document.getElementById("oxygen").textContent = oxygen;
        document.getElementById("water").textContent = water;
        document.getElementById("food").textContent = food;
        document.getElementById("power").textContent = power;
        if (oxygen === 0 || water === 0 || food === 0 || power === 0) {
            window.missionFailed=true;
            alert("Mission failed! One of your resources has run out.");
}
    }
  function resetMission() {
    document.getElementById("day").textContent = 1;
    document.getElementById("oxygen").textContent = 100;
    document.getElementById("water").textContent = 98;
    document.getElementById("food").textContent = 90;
    document.getElementById("power").textContent = 100;

    document.getElementById("mission-progress").value = 0;
    document.getElementById("progress-text").textContent = "0%";

    document.getElementById("mission-message").textContent = "";

    window.missionFailed = false;
}  
