export function Cell() {
    let value = null;
    let hitStatus = false;
    return {
        storeValue(ship = null) {
            value = ship;
        },

        removeValue() {
            value = null;
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

        hasBeenHit() {
            return hitStatus;
        },

        isHitButShipMissed() {
            return !this.hasShip() && hitStatus;
        },

        isShipHit() {
            return this.hasShip() && hitStatus;
        }
    }
}