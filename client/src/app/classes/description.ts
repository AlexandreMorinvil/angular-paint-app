export class Description {
    private itemName: string;
    private itemShortcut: string;
    private itemiconName: string;

    constructor(name: string = 'nom inconnu', shortcut: string = '', iconName: string = 'question_mark.png') {
        this.itemName = name;
        this.itemShortcut = shortcut;
        this.itemiconName = iconName;
    }

    get name(): string {
        return this.itemName;
    }

    set name(name: string) {
        this.itemName = name;
    }

    get shortcut(): string {
        return this.itemShortcut;
    }

    set shortcut(shortcut: string) {
        this.itemShortcut = shortcut;
    }

    get iconDirectory(): string {
        return 'assets/images/' + this.itemiconName;
    }

    set iconName(iconName: string) {
        this.itemiconName = iconName;
    }
}
