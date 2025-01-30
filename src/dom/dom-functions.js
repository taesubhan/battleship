export function removeAllChildren(parent) {
    while (parent.lastChild) {
        parent.lastChild.remove();
    }
}