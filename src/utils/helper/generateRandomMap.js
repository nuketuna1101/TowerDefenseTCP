export function generateSeededPath(seed, startX, startY, endX, endY) {
   // 시드 기반 난수 생성기 (0 ~ 1 범위)
   function seededRandom(seed) {
    return () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
}

const rng = seededRandom(seed);
const path = [];

let x = startX;
let y = startY;
path.push({ x, y });

for (let i = 0; i < 10; i++) {
    let xup = 1370 / 10;
    let yran = rng() * (500 - 200) + 200; // Y 범위 제한
    path.push({ x: xup * i, y: yran });
}

path.push({ x: endX, y: endY });
return path;
}
