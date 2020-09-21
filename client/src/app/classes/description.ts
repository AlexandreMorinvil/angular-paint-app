export class Description {
    private _name: string;
    private _shortcut: string;
    private _iconName: string;

    constructor(
        name: string = "nom inconnu",
        shortcut: string = "",
        iconName: string = "question_mark.png"
    ) {
        this._name = name;
        this._shortcut = shortcut;
        this._iconName = iconName;
    }

    // Getters
    get name(): string {
        return this._name;
    }

    get shortcut(): string {
        return this._shortcut;
    }

    get iconDirectory(): string {
        return "assets/images/" + this._iconName;
    }

    // Setters
    set name(name: string) {
        this._name = name;
    }

    set shortcut(shortcut: string) {
        this._shortcut = shortcut;
    }

    set iconName(iconName: string) {
        this._iconName = iconName;
    }
}
