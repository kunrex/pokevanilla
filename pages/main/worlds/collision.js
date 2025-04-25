import { fst, grs, nan, rck, urb, wtr, sea, mtn } from "../../../utils/constants.js";

const collisionMask = [
    [nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan],
    [nan, wtr, wtr, wtr, nan, nan, nan, nan, nan, nan, fst, fst, fst, fst, fst, fst, fst, fst, fst, fst, fst, fst, fst, fst, fst, fst, fst, fst, fst, fst, fst, nan],
    [nan, nan, wtr, wtr, nan, nan, nan, nan, nan, nan, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, nan],
    [nan, wtr, wtr, wtr, nan, nan, nan, nan, nan, nan, grs, grs, nan, nan, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, nan],
    [nan, wtr, wtr, wtr, nan, nan, fst, nan, nan, grs, grs, nan, nan, nan, nan, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, grs, nan],
    [nan, wtr, wtr, wtr, nan, nan, fst, fst, grs, grs, grs, nan, nan, nan, nan, fst, fst, fst, fst, fst, fst, fst, nan, nan, fst, fst, fst, fst, fst, fst, fst, nan],
    [nan, wtr, wtr, wtr, nan, nan, fst, fst, grs, grs, grs, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, fst, fst, fst, fst, nan],
    [nan, nan, wtr, wtr, nan, nan, fst, fst, grs, grs, grs, grs, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, fst, fst, fst, fst, nan],
    [nan, wtr, wtr, wtr, nan, nan, fst, fst, grs, grs, grs, grs, fst, fst, fst, fst, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, fst, fst, fst, fst, nan],
    [nan, wtr, wtr, wtr, nan, nan, fst, fst, grs, grs, grs, grs, fst, fst, fst, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, fst, fst, fst, fst, nan],
    [nan, nan, wtr, wtr, nan, nan, fst, fst, grs, grs, grs, grs, fst, fst, fst, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, fst, fst, fst, fst, nan],
    [nan, wtr, wtr, wtr, nan, nan, fst, fst, fst, fst, fst, fst, fst, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, fst, nan, nan, nan, nan],
    [nan, wtr, wtr, wtr, nan, nan, fst, fst, fst, fst, fst, fst, fst, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, fst, nan, nan, nan, nan],
    [nan, wtr, wtr, wtr, nan, nan, fst, fst, fst, fst, fst, fst, fst, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, fst, nan, nan, nan, nan],
    [nan, wtr, wtr, wtr, nan, nan, nan, fst, fst, fst, fst, fst, nan, nan, nan, nan, wtr, nan, nan, nan, nan, nan, nan, wtr, nan, nan, fst, fst, nan, nan, nan, nan],
    [nan, nan, wtr, wtr, wtr, nan, nan, fst, fst, fst, fst, nan, nan, nan, nan, nan, wtr, wtr, wtr, nan, nan, nan, wtr, wtr, nan, nan, fst, fst, fst, nan, nan, nan],
    [nan, nan, nan, wtr, wtr, nan, nan, fst, fst, fst, fst, nan, nan, nan, nan, wtr, wtr, wtr, wtr, nan, nan, nan, wtr, wtr, nan, fst, fst, fst, fst, nan, nan, nan],
    [nan, nan, nan, wtr, wtr, nan, nan, nan, fst, fst, fst, nan, nan, nan, wtr, wtr, wtr, wtr, wtr, wtr, wtr, wtr, wtr, nan, nan, fst, fst, fst, fst, nan, nan, nan],
    [nan, nan, wtr, wtr, wtr, wtr, wtr, nan, fst, fst, fst, nan, nan, nan, wtr, wtr, wtr, wtr, wtr, wtr, wtr, wtr, wtr, nan, nan, fst, fst, fst, fst, fst, fst, nan],
    [nan, nan, wtr, wtr, wtr, wtr, wtr, nan, urb, urb, urb, nan, nan, nan, wtr, wtr, wtr, wtr, wtr, wtr, wtr, wtr, wtr, nan, nan, fst, fst, fst, fst, fst, fst, nan],
    [nan, wtr, nan, wtr, wtr, wtr, nan, nan, urb, urb, urb, nan, nan, wtr, wtr, wtr, wtr, wtr, wtr, wtr, wtr, wtr, wtr, nan, nan, fst, fst, fst, fst, fst, fst, nan],
    [nan, nan, nan, nan, nan, wtr, wtr, wtr, urb, urb, urb, wtr, wtr, wtr, wtr, wtr, wtr, wtr, wtr, wtr, wtr, wtr, wtr, nan, nan, fst, fst, fst, fst, fst, fst, nan],
    [nan, nan, mtn, mtn, nan, nan, nan, wtr, urb, urb, urb, wtr, sea, sea, sea, sea, sea, sea, sea, wtr, wtr, rck, rck, nan, nan, fst, fst, fst, fst, fst, fst, nan],
    [nan, nan, mtn, mtn, mtn, mtn, nan, wtr, urb, urb, urb, wtr, sea, sea, sea, sea, sea, sea, sea, wtr, rck, rck, rck, nan, nan, fst, fst, fst, fst, fst, fst, nan],
    [nan, nan, mtn, mtn, nan, nan, nan, wtr, urb, urb, urb, wtr, sea, sea, sea, sea, sea, sea, sea, wtr, rck, rck, rck, nan, nan, fst, fst, fst, nan, nan, fst, nan],
    [nan, nan, mtn, mtn, nan, nan, nan, wtr, urb, urb, urb, wtr, sea, sea, sea, sea, sea, sea, sea, wtr, rck, rck, rck, nan, urb, fst, fst, nan, nan, nan, nan, nan],
    [nan, nan, mtn, mtn, wtr, wtr, wtr, wtr, nan, nan, nan, nan, nan, sea, sea, sea, sea, sea, sea, wtr, rck, rck, rck, urb, urb, fst, fst, nan, nan, nan, nan, nan],
    [nan, nan, nan, wtr, wtr, wtr, nan, nan, nan, nan, nan, nan, nan, nan, nan, sea, sea, sea, sea, sea, rck, rck, rck, urb, nan, fst, fst, nan, nan, nan, nan, nan],
    [nan, nan, nan, wtr, wtr, wtr, nan, nan, nan, nan, nan, nan, nan, nan, nan, sea, sea, sea, sea, sea, rck, rck, rck, nan, nan, fst, fst, nan, nan, nan, nan, nan],
    [nan, nan, nan, wtr, wtr, wtr, nan, nan, nan, nan, nan, nan, nan, nan, sea, sea, sea, sea, sea, sea, wtr, rck, rck, nan, nan, fst, fst, fst, fst, fst, fst, nan],
    [nan, nan, nan, wtr, wtr, wtr, nan, nan, nan, nan, nan, nan, nan, nan, sea, sea, sea, sea, sea, sea, wtr, wtr, wtr, nan, nan, fst, fst, fst, fst, fst, fst, nan],
    [nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan, nan],
]

export function maskIndex(x, y) {
    return collisionMask[y][x]
}

export function canMove(x, y) {
    return collisionMask[y][x] >= 0
}