import {strict as assert} from 'assert';
import * as fs from "fs";
import {UploadService} from "../src/upload/UploadService";
import {Request} from "express";

let service: UploadService = null;
describe('upload', () => {
    it(`service should be created`, () => {
        assert.doesNotThrow(() => {
            service = new UploadService();
        });
    });

    it(`upload should work`, async () => {
        let contents = fs.readFileSync(__dirname + '/exercise.csv', 'utf8');
        const fakeReq = {files: {file: {}}};
        const name = 'test.csv';
        fakeReq.files.file = {
            name: name,
            data: Buffer.from(contents),
            size: 100,
            mimetype: 'text/csv',
            encoding: 'bit',
            truncated: false,
            md5: null,
        }
        const file = await service.uploadAsync(fakeReq as unknown as Request);
        assert.deepEqual(file.name, name);
    });
    it(`size should return valid count`, async () => {
        const result = await service.sizeAsync();
        assert.deepEqual(result.count, 18);
    });
    it(`fetch all should return valid list`, async () => {
        const result = await service.fetchAllAsync();
        assert.deepEqual(result[0].code, '271636001');
    });
    it(`fetch by code should return valid row`, async () => {
        const row = await service.fetchByCodeAsync('271636001');
        assert.deepEqual(row.code, '271636001');
    });
    it(`delete-all should return valid count`, async () => {
        const result = await service.deleteAsync();
        assert.deepEqual(result.count, 18);
    });
    it(`after delete-all, there should be empy list`, async () => {
        const result = await service.sizeAsync();
        assert.deepEqual(result.count, 0);
    });
});
