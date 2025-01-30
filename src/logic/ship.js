export function Ship(length) {
    let hitCount = 0;
    return {
        length,
        hit() {
            hitCount < length ? hitCount++ : null;
        },
        getHitCount() {
            return hitCount;
        },
        isSunk() {
            return hitCount >= length;
        }
    }
}