import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";


// --------------------------------
// CREATE SPACE
// --------------------------------

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x020414);

const camera = new THREE.PerspectiveCamera(
    70,
    1,
    0.1,
    1000
);

camera.position.set(0, 4, 10);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

const space = document.getElementById("space-scene");

space.appendChild(renderer.domElement);


// --------------------------------
// LIGHTS
// --------------------------------

const sunlight = new THREE.PointLight(
    0xffffff,
    250
);

sunlight.position.set(-5, 5, 5);

scene.add(sunlight);

const spaceLight = new THREE.AmbientLight(
    0xffffff,
    1.5
);

scene.add(spaceLight);


// --------------------------------
// CREATE SATURN
// --------------------------------

const saturn = new THREE.Group();

const planet = new THREE.Mesh(
    new THREE.SphereGeometry(4, 64, 64),
    new THREE.MeshStandardMaterial({
        color: 0xd9b477,
        roughness: 0.9
    })
);

saturn.add(planet);


// Saturn rings

const ring = new THREE.Mesh(
    new THREE.RingGeometry(5, 8, 128),
    new THREE.MeshStandardMaterial({
        color: 0xc7aa7d,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
    })
);

ring.rotation.x = -Math.PI / 2.7;

saturn.add(ring);


// Position Saturn in space

saturn.position.set(-3, 1, -17);

scene.add(saturn);


// --------------------------------
// ADD STARS
// --------------------------------

const starPositions = [];

for (let i = 0; i < 2000; i++) {

    starPositions.push(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 200
    );

}

const starGeometry = new THREE.BufferGeometry();

starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
        starPositions,
        3
    )
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.2
});

const stars = new THREE.Points(
    starGeometry,
    starMaterial
);

scene.add(stars);


// --------------------------------
// CREATE ASTRONAUT
// --------------------------------

const astronaut = new THREE.Group();

const astronautSuit = new THREE.MeshStandardMaterial({
    color: 0xffffff
});

const helmetMaterial = new THREE.MeshStandardMaterial({
    color: 0x36c5ec,
    metalness: 0.6,
    roughness: 0.2
});


// Body

const body = new THREE.Mesh(
    new THREE.CylinderGeometry(
        0.3,
        0.4,
        1,
        24
    ),
    astronautSuit
);

body.position.y = 0;

astronaut.add(body);


// Helmet

const helmet = new THREE.Mesh(
    new THREE.SphereGeometry(
        0.35,
        32,
        32
    ),
    helmetMaterial
);

helmet.position.y = 0.75;

astronaut.add(helmet);


// Backpack

const backpack = new THREE.Mesh(
    new THREE.BoxGeometry(
        0.4,
        0.65,
        0.25
    ),
    new THREE.MeshStandardMaterial({
        color: 0x42516b
    })
);

backpack.position.set(0, 0, 0.4);

astronaut.add(backpack);


// Arms

for (const side of [-1, 1]) {

    const arm = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.15,
            0.7,
            0.15
        ),
        astronautSuit
    );

    arm.position.set(
        side * 0.4,
        0,
        0
    );

    astronaut.add(arm);

}


// Legs

for (const side of [-1, 1]) {

    const leg = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.18,
            0.65,
            0.2
        ),
        astronautSuit
    );

    leg.position.set(
        side * 0.15,
        -0.75,
        0
    );

    astronaut.add(leg);

}


// Add astronaut to space

astronaut.position.set(0, 0, 0);

scene.add(astronaut);


// --------------------------------
// RESOURCE COLLECTION
// --------------------------------

const resourceTypes = [

    {
        type: "oxygen",
        symbol: "🫧",
        color: 0x35caff
    },

    {
        type: "water",
        symbol: "💧",
        color: 0x168cff
    },

    {
        type: "power",
        symbol: "⚡",
        color: 0xffdf35
    },

    {
        type: "food",
        symbol: "🍎",
        color: 0x45e77a
    }

];

const resources = [];


// Create floating resource symbols

function createResource(symbol, type, color) {

    const canvas = document.createElement("canvas");

    canvas.width = 256;
    canvas.height = 256;

    const context = canvas.getContext("2d");

    context.fillStyle = "rgba(20, 30, 70, 0.9)";

    context.beginPath();

    context.arc(128, 128, 110, 0, Math.PI * 2);

    context.fill();

    context.font = "110px Arial";

    context.textAlign = "center";

    context.textBaseline = "middle";

    context.fillText(symbol, 128, 135);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    });

    const resource = new THREE.Sprite(material);

    resource.scale.set(1.3, 1.3, 1);

    resource.position.set(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 25
    );

    resource.userData.type = type;

    resource.userData.points = 10;

    resource.userData.collected = false;

    resource.userData.startingY = resource.position.y;

    scene.add(resource);

    resources.push(resource);

}


// Create 5 resources of each type

function addAllResources() {

    resourceTypes.forEach(function(item) {

        for (let i = 0; i < 5; i++) {

            createResource(
                item.symbol,
                item.type,
                item.color
            );

        }

    });

}

addAllResources();


// --------------------------------
// KEEP COLLECTION SCORE
// --------------------------------

let oxygen = 0;
let water = 0;
let power = 0;
let food = 0;

let totalScore = 0;


// Update dashboard

function updateDashboard() {

    document.getElementById("oxygen").textContent = oxygen;

    document.getElementById("water").textContent = water;

    document.getElementById("power").textContent = power;

    document.getElementById("food").textContent = food;

    document.getElementById("score").textContent = totalScore;

}


// --------------------------------
// COLLECT FLOATING OBJECTS
// --------------------------------

function collectResources() {

    resources.forEach(function(item) {

        if (item.userData.collected === true) {
            return;
        }

        // Find the distance between astronaut and resource

        const distance = astronaut.position.distanceTo(
            item.position
        );

        // Collect the item when astronaut comes close

        if (distance < 4) {

            item.userData.collected = true;

            // Add collected resource points

            if (item.userData.type === "oxygen") {
                oxygen = oxygen + 10;
            }

            else if (item.userData.type === "water") {
                water = water + 10;
            }

            else if (item.userData.type === "power") {
                power = power + 10;
            }

            else if (item.userData.type === "food") {
                food = food + 10;
            }

            // Increase total score

            totalScore = totalScore + 10;

            // Remove collected item from space

            scene.remove(item);

            // Show collection message

            document.getElementById("message").textContent =
                "Great! You collected " +
                item.userData.type +
                " and earned 10 points!";

            // Update dashboard

            updateDashboard();

        }

    });

}


// --------------------------------
// ASTRONAUT MOVEMENT
// --------------------------------

const pressedKeys = {};

window.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();

    if (
        key.startsWith("arrow") ||
        key === " "
    ) {
        event.preventDefault();
    }

    pressedKeys[key] = true;

});


window.addEventListener("keyup", function(event) {

    pressedKeys[event.key.toLowerCase()] = false;

});


function moveAstronaut() {

    const speed = 0.15;

    if (
        pressedKeys["arrowup"] ||
        pressedKeys["w"]
    ) {
        astronaut.position.z -= speed;
    }

    if (
        pressedKeys["arrowdown"] ||
        pressedKeys["s"]
    ) {
        astronaut.position.z += speed;
    }

    if (
        pressedKeys["arrowleft"] ||
        pressedKeys["a"]
    ) {
        astronaut.position.x -= speed;
    }

    if (
        pressedKeys["arrowright"] ||
        pressedKeys["d"]
    ) {
        astronaut.position.x += speed;
    }

    // Move upward

    if (pressedKeys[" "]) {
        astronaut.position.y += speed;
    }

    // Move downward

    if (pressedKeys["shift"]) {
        astronaut.position.y -= speed;
    }

    // Keep astronaut inside the space area

    astronaut.position.x = THREE.MathUtils.clamp(
        astronaut.position.x,
        -15,
        15
    );

    astronaut.position.y = THREE.MathUtils.clamp(
        astronaut.position.y,
        -10,
        10
    );

    astronaut.position.z = THREE.MathUtils.clamp(
        astronaut.position.z,
        -15,
        15
    );

}


// --------------------------------
// CAMERA FOLLOWS ASTRONAUT
// --------------------------------

function updateCamera() {

    camera.position.set(
        astronaut.position.x,
        astronaut.position.y + 4,
        astronaut.position.z + 10
    );

    camera.lookAt(
        astronaut.position.x,
        astronaut.position.y,
        astronaut.position.z - 2
    );

}


// --------------------------------
// RESTART MISSION
// --------------------------------

window.resetGame = function() {

    oxygen = 0;
    water = 0;
    power = 0;
    food = 0;

    totalScore = 0;

    astronaut.position.set(0, 0, 0);

    resources.forEach(function(item) {

        item.userData.collected = false;

        scene.add(item);

    });

    document.getElementById("message").textContent =
        "Your Saturn mission has restarted!";

    updateDashboard();

};


// --------------------------------
// RESIZE SPACE DISPLAY
// --------------------------------

function resizeScene() {

    const width = space.clientWidth;

    const height = space.clientHeight;

    camera.aspect = width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

}

window.addEventListener("resize", resizeScene);

resizeScene();


// --------------------------------
// ANIMATE SPACE
// --------------------------------

function animate() {

    requestAnimationFrame(animate);

    moveAstronaut();

    updateCamera();

    collectResources();

    saturn.rotation.y += 0.001;

    // Floating resource animation

    resources.forEach(function(item) {

        if (!item.userData.collected) {

            item.position.y =
                item.userData.startingY +
                Math.sin(
                    Date.now() * 0.002 +
                    item.position.x
                ) * 0.3;

        }

    });

    renderer.render(scene, camera);

}

updateDashboard();

animate();