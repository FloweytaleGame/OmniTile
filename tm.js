import Tile from "./tile.js";

export default class {
    static import_tilemap(code) {
        const tiles = [
            "tiles/floor.png",
            "tiles/fence_left.png",
            "tiles/fence_middle.png",
            "tiles/fence_right.png",
        ];
    
        const img_factory = src => {
            const img = new Image();
            img.src = src;
            return img;
        };

        let tilemap = [];
        code.split(";").forEach(tile => {
            tilemap.push(new Tile(tile.charCodeAt(1) - 256, tile.charCodeAt(2) - 256, tile.charCodeAt(3) - 256, img_factory(tiles[tile.charCodeAt(0) - 258])));
        });
        return tilemap;
    }

    static export_tilemap(tilemap) {
        const tiles = [
            "tiles/floor.png",
            "tiles/fence_left.png",
            "tiles/fence_middle.png",
            "tiles/fence_right.png",
        ];

        let code = "";
        tilemap.forEach(tile => { code += String.fromCharCode(tiles.indexOf(tile.type.getAttribute("src")) + 258) + String.fromCharCode(tile.x + 256) + String.fromCharCode(tile.y + 256) + String.fromCharCode(tile.z + 256) + ";" });
        return code;
    }
}