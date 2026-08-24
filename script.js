const map = document.getElementById("map");
const world = document.getElementById("world");


// ===============================
// MAP SETTINGS
// ===============================

const columns = 4;
const rows = 4;

const tileWidth = 1672;
const tileHeight = 941;

const mapWidth = columns * tileWidth;
const mapHeight = rows * tileHeight;


// ===============================
// CREATE THE 16 MAP TILES
// ===============================

for (let y = 0; y < rows; y++) {

    for (let x = 0; x < columns; x++) {

        const tile = document.createElement("img");

        tile.src = `assets/world/tile-${x}-${y}.png`;

        tile.style.position = "absolute";
        tile.style.width = `${tileWidth}px`;
        tile.style.height = `${tileHeight}px`;

        tile.style.left = `${x * tileWidth}px`;
        tile.style.top = `${y * tileHeight}px`;

        tile.draggable = false;
        tile.style.pointerEvents = "none";

        map.appendChild(tile);
    }
}


// ===============================
// CITY MAP ZOOM
// ===============================

let zoom = 0.30;

const minZoom = 0.30;
const maxZoom = 1.00;
const zoomStep = 0.10;


// ===============================
// CITY MAP POSITION
// ===============================

let mapX = 0;
let mapY = 0;


// ===============================
// CENTER CITY MAP
// ===============================

function centerMap() {

    const screenWidth = world.clientWidth;
    const screenHeight = world.clientHeight;

    mapX = (screenWidth - mapWidth * zoom) / 2;
    mapY = (screenHeight - mapHeight * zoom) / 2;

    updateMap();
}


// ===============================
// UPDATE CITY MAP
// ===============================

function updateMap() {

    map.style.transform =
        `translate(${mapX}px, ${mapY}px) scale(${zoom})`;
}


// ===============================
// CITY MAP DRAGGING
// ===============================

let isDragging = false;

let startMouseX = 0;
let startMouseY = 0;

let startMapX = 0;
let startMapY = 0;


world.addEventListener("mousedown", function (event) {

    if (event.target.closest("#arcade-hotspot")) {
        return;
    }

    isDragging = true;

    startMouseX = event.clientX;
    startMouseY = event.clientY;

    startMapX = mapX;
    startMapY = mapY;

});


window.addEventListener("mousemove", function (event) {

    if (!isDragging) return;

    const movementX =
        event.clientX - startMouseX;

    const movementY =
        event.clientY - startMouseY;

    mapX =
        startMapX + movementX;

    mapY =
        startMapY + movementY;

    updateMap();

});


window.addEventListener("mouseup", function () {

    isDragging = false;

});


// ===============================
// CITY MAP WHEEL ZOOM
// ===============================

world.addEventListener(
    "wheel",
    function (event) {

        event.preventDefault();

        const oldZoom = zoom;

        if (event.deltaY < 0) {
            zoom += zoomStep;
        } else {
            zoom -= zoomStep;
        }

        zoom = Math.max(
            minZoom,
            Math.min(maxZoom, zoom)
        );

        if (zoom === oldZoom) return;


        const rect =
            world.getBoundingClientRect();

        const mouseX =
            event.clientX - rect.left;

        const mouseY =
            event.clientY - rect.top;


        mapX =
            mouseX -
            (mouseX - mapX) *
            (zoom / oldZoom);

        mapY =
            mouseY -
            (mouseY - mapY) *
            (zoom / oldZoom);


        updateMap();

    },
    { passive: false }
);


// ===============================
// START CITY MAP
// ===============================

centerMap();


// ==================================================
// ARCADE ELEMENTS
// ==================================================

const arcadeHotspot =
    document.getElementById("arcade-hotspot");

const arcadeView =
    document.getElementById("arcade-view");

const arcadeStage =
    document.getElementById("arcade-stage");

const closeArcade =
    document.getElementById("close-arcade");


// ==================================================
// OPEN ARCADE
// ==================================================

arcadeHotspot.addEventListener("click", function (event) {

    event.stopPropagation();

    arcadeView.style.display = "block";

    setupArcade();

});


// ==================================================
// CLOSE ARCADE
// ==================================================

closeArcade.addEventListener("click", function (event) {

    event.stopPropagation();

    arcadeView.style.display = "none";

});


// ==================================================
// ARCADE ZOOM SETTINGS
// ==================================================

let arcadeZoom = 0.75;

const arcadeMinZoom = 0.55;
const arcadeMaxZoom = 2.5;


// ==================================================
// ARCADE POSITION
// ==================================================

let arcadeX = 0;
let arcadeY = 0;


// ==================================================
// SETUP ARCADE
// ==================================================

function setupArcade() {

    const screenWidth =
        arcadeView.clientWidth;

    const screenHeight =
        arcadeView.clientHeight;

    const imageWidth = 1664;
    const imageHeight = 936;


    arcadeZoom = Math.min(
        screenWidth / imageWidth,
        screenHeight / imageHeight
    );


    arcadeZoom = Math.max(
        arcadeMinZoom,
        Math.min(arcadeZoom, 1)
    );


    arcadeX =
        (screenWidth -
            imageWidth * arcadeZoom) / 2;

    arcadeY =
        (screenHeight -
            imageHeight * arcadeZoom) / 2;


    updateArcade();

}


// ==================================================
// UPDATE ARCADE
// ==================================================

function updateArcade() {

    arcadeStage.style.transform =
        `translate(${arcadeX}px, ${arcadeY}px)
         scale(${arcadeZoom})`;

}


// ==================================================
// ARCADE SONG DATABASE
// ==================================================

const arcadeSongs = [

    {
        id: "loverboy",

        title: "Loverboy",

        artist: "A-Wall",

        x: 1160,

        y: 235,

        width: 240,

        height: 330,

        youtube:
            "https://www.youtube.com/watch?v=CTMsaUiVI5g"
    },
    {
        id: "yeh-zindagi-hai",

        title: "Yeh Zindagi Hai",

        artist: "King",

        x: 75,

        y: 75,

        width: 160,

        height: 245,

        youtube:
            "https://www.youtube.com/watch?v=3RUXw8NQIsw"
    }


];


// ==================================================
// CREATE SONG HOTSPOTS
// ==================================================

function createSongHotspots() {

    arcadeSongs.forEach(function (song) {

        const hotspot =
            document.createElement("button");


        hotspot.className =
            "song-hotspot";


        hotspot.dataset.songId =
            song.id;


        hotspot.setAttribute(
            "aria-label",
            `${song.title} — ${song.artist}`
        );


        hotspot.title =
            `${song.title} — ${song.artist}`;


        hotspot.style.left =
            `${song.x}px`;


        hotspot.style.top =
            `${song.y}px`;


        hotspot.style.width =
            `${song.width}px`;


        hotspot.style.height =
            `${song.height}px`;


        // ==========================
        // SONG CLICK
        // ==========================

        hotspot.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                // Visual click feedback

                hotspot.classList.remove(
                    "clicked"
                );


                void hotspot.offsetWidth;


                hotspot.classList.add(
                    "clicked"
                );


                // Open YouTube

                setTimeout(
                    function () {

                        window.open(
                            song.youtube,
                            "_blank",
                            "noopener,noreferrer"
                        );

                    },
                    400
                );

            }
        );


        arcadeStage.appendChild(
            hotspot
        );

    });

}


// ==================================================
// CREATE THE SONG BUTTONS
// ==================================================

createSongHotspots();


// ==================================================
// ARCADE DRAGGING
// ==================================================

let draggingArcade = false;

let arcadeStartMouseX = 0;
let arcadeStartMouseY = 0;

let arcadeStartX = 0;
let arcadeStartY = 0;


arcadeView.addEventListener(
    "mousedown",
    function (event) {

        if (
            event.target.closest(
                ".song-hotspot"
            ) ||
            event.target === closeArcade
        ) {
            return;
        }


        draggingArcade = true;


        arcadeStartMouseX =
            event.clientX;


        arcadeStartMouseY =
            event.clientY;


        arcadeStartX =
            arcadeX;


        arcadeStartY =
            arcadeY;

    }
);


window.addEventListener(
    "mousemove",
    function (event) {

        if (!draggingArcade) return;


        arcadeX =
            arcadeStartX +
            (
                event.clientX -
                arcadeStartMouseX
            );


        arcadeY =
            arcadeStartY +
            (
                event.clientY -
                arcadeStartMouseY
            );


        updateArcade();

    }
);


window.addEventListener(
    "mouseup",
    function () {

        draggingArcade = false;

    }
);


// ==================================================
// ARCADE WHEEL ZOOM
// ==================================================

arcadeView.addEventListener(
    "wheel",
    function (event) {

        event.preventDefault();


        const oldZoom =
            arcadeZoom;


        if (event.deltaY < 0) {

            arcadeZoom += 0.10;

        } else {

            arcadeZoom -= 0.10;

        }


        arcadeZoom =
            Math.max(
                arcadeMinZoom,
                Math.min(
                    arcadeZoom,
                    arcadeMaxZoom
                )
            );


        if (arcadeZoom === oldZoom) {
            return;
        }


        // ==========================
        // ZOOM TOWARD MOUSE
        // ==========================

        const rect =
            arcadeView.getBoundingClientRect();


        const mouseX =
            event.clientX -
            rect.left;


        const mouseY =
            event.clientY -
            rect.top;


        arcadeX =
            mouseX -
            (mouseX - arcadeX) *
            (arcadeZoom / oldZoom);


        arcadeY =
            mouseY -
            (mouseY - arcadeY) *
            (arcadeZoom / oldZoom);


        updateArcade();

    },
    {
        passive: false
    }
);