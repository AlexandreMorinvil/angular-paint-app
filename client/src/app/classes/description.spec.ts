import { Description } from './description';

describe('ToolboxService', () => {
    let object: Description;

    beforeEach(() => {});

    it('should be created', () => {
        object = new Description('a', 'b', 'c.png');
        expect(object).toBeTruthy();
    });

    it('a Description should have the default values upon creation', () => {
        object = new Description();
        expect(object.name).toEqual('nom inconnu');
        expect(object.shortcut).toEqual('');
        expect(object.iconDirectory).toEqual('assets/images/question_mark.png');
    });
});
