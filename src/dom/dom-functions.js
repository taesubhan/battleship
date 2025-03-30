export function removeAllChildren(parent) {
    if (!parent) return;
    while (parent.lastChild) {
        parent.lastChild.remove();
    }
}