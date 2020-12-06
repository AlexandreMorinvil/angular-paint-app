import { TestBed } from '@angular/core/testing';
import { DrawingToDatabase } from '@common/communication/drawing-to-database';
import { Tag, TagFilterService } from './tag-filter.service';

describe('TagFilterService', () => {
    let service: TagFilterService;
    const tag: Tag = { tagName: 'a' };
    const tag2: Tag = { tagName: 'b' };
    const tag3: Tag = { tagName: 'c' };

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TagFilterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add tag', () => {
        service.addTag(tag);
        expect(service.getActiveTags()[0]).toBe(tag);
    });

    it('should remove tag', () => {
        service.addTag(tag);
        service.addTag(tag2);
        service.addTag(tag3);
        service.removeTag(tag2);
        expect(service.getActiveTags()[1]).toBe(tag3);
        expect(service.getActiveTags()[0]).toBe(tag);
    });

    it('should clear tags', () => {
        service.addTag(tag);
        service.addTag(tag2);
        service.addTag(tag3);
        service.clearTags();
        expect(service.getActiveTags()).toEqual([]);
    });

    it('should filter correctly list', () => {
        const listToFilter: DrawingToDatabase[] = [
            { _id: 1, name: 'test1', tags: [] },
            { _id: 2, name: 'test2', tags: ['a'] },
            { _id: 3, name: 'test3', tags: ['a', 'b'] },
        ];
        listToFilter.push(new DrawingToDatabase());
        service.addTag(tag);
        const listFiltered: DrawingToDatabase[] = [
            { _id: 2, name: 'test2', tags: ['a'] },
            { _id: 3, name: 'test3', tags: ['a', 'b'] },
        ];
        expect(service.filterByTag(listToFilter)[0]._id).toBe(listFiltered[0]._id);
        expect(service.filterByTag(listToFilter)[1]._id).toBe(listFiltered[1]._id);
    });

    it('should return same list if no tag are active', () => {
        const listToFilter: DrawingToDatabase[] = [
            { _id: 2, name: 'test2', tags: ['a'] },
            { _id: 3, name: 'test3', tags: ['a', 'b'] },
        ];
        const listFiltered: DrawingToDatabase[] = [
            { _id: 2, name: 'test2', tags: ['a'] },
            { _id: 3, name: 'test3', tags: ['a', 'b'] },
        ];
        expect(service.filterByTag(listToFilter)[0]._id).toBe(listFiltered[0]._id);
        expect(service.filterByTag(listToFilter)[1]._id).toBe(listFiltered[1]._id);
    });
});
