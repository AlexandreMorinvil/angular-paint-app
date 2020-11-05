export class Description {
    name: string;
    shortcut: string;
    private itemiconName: string;

    constructor(name: string = 'nom inconnu', shortcut: string = '', iconName: string = 'question_mark.png') {
        this.name = name;
        this.shortcut = shortcut;
        this.itemiconName = iconName;
    }

    get iconDirectory(): string {
        return 'assets/images/icon/' + this.itemiconName;
    }
}
