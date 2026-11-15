
// Get the game screen
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Game information
let score = 0;
let lives = 5;
let level = 1;

let collected = {
    food: 0,
    power: 0,
    oxygen: 0,
    water: 0
};

let gameOver = false;
let missionComplete = false;

// Astronaut position
let astronaut = {
    x: 100,
    y: 250,
    size: 25,
    speed: 4
};

// Resources to collect
let resources = [];

let resourceTypes = [
    { name: "food", symbol: "🥫" },
    { name: "power", symbol: "⚡" },
    { name: "oxygen", symbol: "🫧" },
    { name: "water", symbol: "💧" }
];

// Create resources
function createResources() {

    resources = [];

    for (let type of resourceTypes) {

        for (let i = 0; i < 3; i++) {

            resources.push({
                x: 180 + Math.random() * 650,
                y: 40 + Math.random() * 460,
                name: type.name,
                symbol: type.symbol,
                collected: false
            });

        }
    }
}

// Create asteroids
let asteroids = [];

function createAsteroids() {

    asteroids = [];

    for (let i = 0; i < 7; i++) {

        asteroids.push({
            x: 200 + Math.random() * 650,
            y: Math.random() * 500,
            size: 18,
            speedX: (Math.random() - 0.5) * 3,
            speedY: (Math.random() - 0.5) * 3
        });

    }
}

// Draw stars
let stars = [];

for (let i = 0; i < 100; i++) {
    stars.push({
        x: Math.random() * 900,
        y: Math.random() * 550,
        size: Math.random() * 2
    });
}

// Keyboard controls
let keys = {};

document.addEventListener("keydown", function(event) {

    keys[event.key.toLowerCase()] = true;

});

document.addEventListener("keyup", function(event) {

    keys[event.key.toLowerCase()] = false;

});

// Move astronaut
function moveAstronaut() {

    if (gameOver || missionComplete) return;

    if (keys["arrowup"] || keys["w"]) {
        astronaut.y -= astronaut.speed;
    }

    if (keys["arrowdown"] || keys["s"]) {
        astronaut.y += astronaut.speed;
    }

    if (keys["arrowleft"] || keys["a"]) {
        astronaut.x -= astronaut.speed;
    }

    if (keys["arrowright"] || keys["d"]) {
        astronaut.x += astronaut.speed;
    }

    // Keep astronaut inside space screen
    astronaut.x = Math.max(20, Math.min(880, astronaut.x));
    astronaut.y = Math.max(20, Math.min(530, astronaut.y));

}

// Draw a realistic-looking Moon
function drawMoon() {

    // Moon position and size
    let moonX = 760;
    let moonY = 130;
    let moonRadius = 95;

    // Circular Moon shape
    ctx.save();

    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.clip();

    // Grey surface with light and shadow
    let moonColor = ctx.createRadialGradient(
        720, 95, 10,
        760, 130, 110
    );

    moonColor.addColorStop(0, "#eeeeea");
    moonColor.addColorStop(0.55, "#aaa9a3");
    moonColor.addColorStop(1, "#45464c");

    ctx.fillStyle = moonColor;
    ctx.fillRect(
        moonX - moonRadius,
        moonY - moonRadius,
        moonRadius * 2,
        moonRadius * 2
    );

    // Moon craters
    let craters = [
        [725, 90, 17],
        [780, 75, 12],
        [800, 135, 20],
        [740, 155, 13],
        [770, 185, 10],
        [700, 145, 8],
        [825, 95, 7],
        [750, 120, 6]
    ];

    for (let crater of craters) {

        let x = crater[0];
        let y = crater[1];
        let size = crater[2];

        // Dark crater shadow
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = "#666762";
        ctx.fill();

        // Lighter crater edge
        ctx.beginPath();
        ctx.arc(
            x - 3,
            y - 3,
            size * 0.7,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#bdbcb5";
        ctx.fill();
    }

    ctx.restore();

    // Moon outline
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);

    ctx.strokeStyle = "#d7d7d0";
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Draw space background
function drawSpace() {

    ctx.fillStyle = "#080826";
    ctx.fillRect(0, 0, 900, 550);

    ctx.fillStyle = "white";

    for (let star of stars) {

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

    }
    drawMoon();

}

// Draw astronaut
function drawAstronaut() {

    ctx.font = "40px Arial";
    ctx.fillText("👨‍🚀", astronaut.x - 20, astronaut.y + 15);

}

// Draw resources
function drawResources() {

    for (let item of resources) {

        if (!item.collected) {

            ctx.font = "30px Arial";

            ctx.fillText(
                item.symbol,
                item.x,
                item.y
            );

        }

    }

}

// Draw asteroids
function drawAsteroids() {

    for (let rock of asteroids) {

        ctx.font = "35px Arial";

        ctx.fillText("☄️", rock.x, rock.y);

        rock.x += rock.speedX;
        rock.y += rock.speedY;

        // Change direction at screen edges
        if (rock.x < 20 || rock.x > 880) {
            rock.speedX *= -1;
        }

        if (rock.y < 20 || rock.y > 530) {
            rock.speedY *= -1;
        }

    }

}

// Check resource collection
function collectResources() {

    for (let item of resources) {

        if (item.collected) continue;

        let dx = astronaut.x - item.x;
        let dy = astronaut.y - item.y;

        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 35) {

            item.collected = true;

            collected[item.name]++;

            score += 10;

            updateDashboard();

        }

    }

}

// Check if astronaut hits asteroid
let invincibleUntil = 0;

function checkAsteroids() {

    if (Date.now() < invincibleUntil) return;

    for (let rock of asteroids) {

        let dx = astronaut.x - rock.x;
        let dy = astronaut.y - rock.y;

        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 40) {

            lives--;

            invincibleUntil = Date.now() + 1500;

            updateDashboard();

            document.getElementById("message").textContent =
                "Asteroid hit! Be careful!";

            // Move astronaut away from asteroid
            astronaut.x = 100;
            astronaut.y = 250;

            if (lives <= 0) {

                gameOver = true;

                document.getElementById("message").textContent =
                    "MISSION FAILED! Click Restart to try again.";

            }

            break;

        }

    }

}

// Update dashboard
function updateDashboard() {

    document.getElementById("food").textContent =
        collected.food;

    document.getElementById("power").textContent =
        collected.power;

    document.getElementById("oxygen").textContent =
        collected.oxygen;

    document.getElementById("water").textContent =
        collected.water;

    document.getElementById("score").textContent =
        score;

    document.getElementById("lives").textContent =
        lives;

    // Change levels according to score
    level = Math.min(3, Math.floor(score / 40) + 1);

    document.getElementById("level").textContent =
        level;

}

// Check mission completion
function checkMission() {

    let allCollected =
        collected.food === 3 &&
        collected.power === 3 &&
        collected.oxygen === 3 &&
        collected.water === 3;

    if (allCollected && !gameOver) {

        missionComplete = true;

        document.getElementById("message").textContent =
            "🎉 Mission Complete! You reached the Moon Rocket!";

    }

}

// Draw rocket after mission
function drawRocket() {

    ctx.font = "75px Arial";

    ctx.fillText("🚀", 700, 300);

    ctx.font = "20px Arial";

    ctx.fillStyle = "white";

    ctx.fillText("Moon Rocket", 690, 330);

}

// Main game function
function gameLoop() {

    drawSpace();

    if (!gameOver && !missionComplete) {

        moveAstronaut();

        drawResources();

        drawAsteroids();

        collectResources();

        checkAsteroids();

        checkMission();

    }

    if (missionComplete) {

        drawRocket();

        astronaut.x = 610;
        astronaut.y = 280;

    }

    drawAstronaut();

    if (gameOver) {

        ctx.font = "45px Arial";
        ctx.fillStyle = "red";

        ctx.fillText("GAME OVER", 330, 270);

    }

    if (missionComplete) {

        ctx.font = "35px Arial";
        ctx.fillStyle = "#ffe66d";

        ctx.fillText("MISSION COMPLETED!", 250, 100);

        drawRocket();

    }

    requestAnimationFrame(gameLoop);

}

// Restart game
function resetGame() {

    score = 0;
    lives = 5;
    level = 1;

    collected = {
        food: 0,
        power: 0,
        oxygen: 0,
        water: 0
    };

    gameOver = false;
    missionComplete = false;

    astronaut.x = 100;
    astronaut.y = 250;

    invincibleUntil = 0;

    keys = {};

    createResources();
    createAsteroids();

    updateDashboard();

    document.getElementById("message").textContent =
        "Collect 3 of each resource and avoid asteroids!";

}

// Start game
resetGame();

gameLoop();
