import { Cell } from '../logic/cell.js';
import { Ship } from '../logic/ship.js';

/* Determining whether cell has been hit */

test('Cell hit status - true', () => {
    const cell = Cell();
    cell.hit();
    expect(cell.hasBeenHit()).toBe(true);
});

test('Cell hit status - false', () => {
    const cell = Cell();
    expect(cell.hasBeenHit()).toBe(false);
});

/* Storing a ship in a cell */

test('Store ship', () => {
    const cell = Cell();
    cell.storeValue(Ship(3));
    const ship = cell.getValue();
    expect(ship.length).toBe(3);
});

test('Store ship - null', () => {
    const cell = Cell();
    const ship = cell.getValue();
    expect(ship).toBeNull();
});

/* Hitting a cell with a ship */

test('Hitting cell should strike the ship object once', () => {
    const cell = Cell();
    cell.storeValue(Ship(3));
    cell.hit();
    const ship = cell.getValue();
    expect(ship.getHitCount()).toBe(1);
});

test('Hitting the cell multiple times should strike the ship only once', () => {
    const cell = Cell();
    cell.storeValue(Ship(3));
    cell.hit();
    cell.hit();
    const ship = cell.getValue();
    expect(ship.getHitCount()).toBe(1);
});

/* Determining whether cell has a ship object */

test('Ship object is on cell - true', () => {
    const cell = Cell();
    cell.storeValue(Ship(3));
    expect(cell.hasShip()).toBe(true);
});

test('Ship object is on cell - false', () => {
    const cell = Cell();
    expect(cell.hasShip()).toBe(false);
});

/* Determining whether cell, without a ship, has been hit (aka missed) */

test('isHitButShipMissed() - Cell is hit, but no ship - true', () => {
    const cell = Cell();
    cell.hit();
    expect(cell.isHitButShipMissed()).toBe(true);
});

test('isHitButShipMissed() - Cell is hit with ship - false', () => {
    const cell = Cell();
    cell.storeValue(Ship(3));
    cell.hit();
    expect(cell.isHitButShipMissed()).toBe(false);
});

test('isHitButShipMissed() - Cell is hit twice with ship - false', () => {
    const cell = Cell();
    cell.storeValue(Ship(3));
    cell.hit();
    cell.hit();
    expect(cell.isHitButShipMissed()).toBe(false);
});

test('isHitButShipMissed() - Cell is not hit - false', () => {
    const cell = Cell();
    cell.storeValue(Ship(3));
    expect(cell.isHitButShipMissed()).toBe(false);
});

/* Determining whether a cell, with a ship, has been hit */

test('isShipHit() - Cell is hit, but no ship - false', () => {
    const cell = Cell();
    cell.hit();
    expect(cell.isShipHit()).toBe(false);
});

test('isShipHit() - Cell is hit with ship - true', () => {
    const cell = Cell();
    cell.storeValue(Ship(3));
    cell.hit();
    expect(cell.isShipHit()).toBe(true);
});

test('isShipHit()- Cell is hit twice with ship - true', () => {
    const cell = Cell();
    cell.storeValue(Ship(3));
    cell.hit();
    cell.hit();
    expect(cell.isShipHit()).toBe(true);
});

test('isShipHit() - Cell is not hit - false', () => {
    const cell = Cell();
    cell.storeValue(Ship(3));
    expect(cell.isShipHit()).toBe(false);
});
