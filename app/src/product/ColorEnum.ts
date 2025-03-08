export enum ColorEnum {
    TRANSPARENT = "transparent",
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
    UNKNOWN = "unknown",
}

export function colorFromString(status: string): ColorEnum {
    const color = Object.values(ColorEnum).find((s) => s === status);
    return color ?? ColorEnum.UNKNOWN;
}