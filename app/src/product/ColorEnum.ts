export enum ColorEnum {
    TRANSPARENT = 'transparent',
    RED = "red",
    BLUE = "blue",
    GREEN = "green",
    YELLOW = "yellow",
    ORANGE = "orange",
    PURPLE = "purple",
    BLACK = "black",
    WHITE = "white",
    GRAY = "gray",
    PINK = "pink",
    BROWN = "brown",
    CYAN = "cyan",
    MAGENTA = "magenta",
    GOLD = "gold",
}

export function colorFromString(status: string): ColorEnum | undefined {
    return Object.values(ColorEnum).find((s) => s === status);
}