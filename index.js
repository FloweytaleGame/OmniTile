import Tile from "./tile.js";
import TM from "./tm.js";

const cnv = document.getElementById("cnv");
const ctx = cnv.getContext("2d");
const z_selector = document.getElementById("z_selector");
const fps = 60;
const tiles = [
    "tiles/fence_left.png",
    "tiles/fence_middle.png",
    "tiles/fence_right.png",
    "tiles/floor.png",
];
let tilemap = [];

cnv.width = window.innerWidth;
cnv.height = window.innerHeight;

let tx = 0;
let ty = 0;
//let scale = 1;
const start_y = 80;

let selected;

document.getElementById("tiles").append(...tiles.map(tile => {
    const img = document.createElement("img");
    img.src = tile;
    img.onclick = () => {
        [...document.querySelectorAll("#tiles > img")].forEach(elem => elem.style.borderColor = "transparent");
        img.style.borderColor = "#00dd0077";
        selected = img;
    };
    return img;
}));

window.onbeforeunload = () => {
    return "Be sure to have exported your work if you don't want to lose it!";
};  

onmousemove = e => {
    tx = Math.floor(e.clientX / 20);
    ty = Math.floor(e.clientY / 20);
};

/*onwheel = e => {
    scale += e.deltaY / 1000;
    scale = Math.round(scale * 10) / 10;
    scale = Math.min(Math.max(scale, 0.1), 10);
    console.log(scale);
    ctx.scale(scale, scale);
};*/

const containsTile = (tile, list) => list.some(elem => elem.x == tile.x && elem.y == tile.y && elem.z == tile.z && elem.z == tile.z && elem.type.src == tile.type.src);

onclick = () => {
    if (selected && ty >= start_y / 20) {
        let z = parseInt(z_selector.value) || 0;
        const t = new Tile(tx, ty - start_y / 20, z, selected);
        if (!containsTile(t, tilemap)) tilemap.push(t);
    }
};

onkeydown = e => {
    if (e.key == "z" && e.ctrlKey) tilemap.pop();
};

const import_file = document.getElementById("import_file");
import_file.onchange = () => {
    const file = import_file.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        tilemap = TM.import_tilemap(reader.result);
    };
    reader.readAsText(file);
};
const export_button = document.getElementById("export");
export_button.onclick = async () => {
    const file = TM.export_tilemap(tilemap);
    const handle = await showSaveFilePicker();
    const writable = await handle.createWritable();
    writable.write(file);
    writable.close();
};

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    // grid
    ctx.fillStyle = "white";
    ctx.strokeStyle = "#444";
    for (let x = 0; x < cnv.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, start_y);
        ctx.lineTo(x, cnv.height);
        ctx.stroke();
    }
    for (let y = start_y; y < cnv.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cnv.width, y);
        ctx.stroke();
    }

    // selected rect
    ctx.fillStyle = "#00dd0077";
    if (ty >= start_y / 20) ctx.fillRect(tx * 20, ty * 20, 20, 20);

    tilemap.sort((a, b) => a.z - b.z);
    tilemap.forEach(tile => {
        try {
            ctx.drawImage(tile.type, tile.x * 20, tile.y * 20 + start_y, 20, 20);
        }
        catch (e) {
            // image still loading...
        }
    });

    setInterval(draw, 1000 / fps);
}

draw();
