export function Cell() {
    let value = null;
    let hitStatus = false;
    return {
        storeValue(ship = null) {
            value = ship;
        },

        getValue() {
            return value;
        },

        hasShip() {
            return Boolean(value);
        },
        
        hit() {
            if (!hitStatus) {
                value ? value.hit() : null;
                hitStatus = true;
            }
        },

        isHit() {
            return hitStatus;
        }
    }
}