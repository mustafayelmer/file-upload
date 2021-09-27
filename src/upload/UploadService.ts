import {CountResponse, FileResponse, UploadedFile, UploadedFileInfo} from "./UploadedFile";
import {Request} from "express";
import {
    CodeNotFoundError,
    EmptyCodeError,
    EmptyFileError,
    InvalidCodeError,
    InvalidCsvLinesError,
    InvalidFileError
} from "./errors";
import * as CSV from 'csv-string';
import alasql from "alasql";


// noinspection JSUnusedGlobalSymbols,SqlDialectInspection
export class UploadService {
    private _table = 'GERI_MEDICA';
    async uploadAsync(req: Request): Promise<UploadedFileInfo> {
        const files = req ? req['files'] as UploadedFile : null;
        if(!files) {
            throw new EmptyFileError();
        } else if (typeof files === 'object') {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            const file = files.file;
            const content = file.data.toString('utf8');
            const rows = CSV.parse(content);
            if (!Array.isArray(rows)) {
                throw new InvalidCsvLinesError();
            }
            const columns = rows[0] as Array<string>;
            rows.shift();

            try {
                await alasql("DROP TABLE GERI_MEDICA");
            } catch (e) {
            }
            alasql(`CREATE TABLE ${this._table} (${columns.map(column => column + ' string').join(', ')})`);
            rows.forEach(row => {
                const inserted = {};
                columns.forEach((column, index) => {
                    inserted[column] = row[index];
                });
                alasql(`INSERT INTO ${this._table} VALUES ?`, [inserted]);
            });
            // xonsole.log('data', alasql['tables'].GERI_MEDICA.data);
            return {mimetype: file.mimetype, size: file.size, name: file.name};
        } else {
            throw new InvalidFileError(typeof files);
        }
    }

    async sizeAsync(): Promise<CountResponse> {
        const rows = alasql(`SELECT COUNT(*) FROM ${this._table}`);
        let count = 0;
        try {
            count = rows[0]['COUNT(*)'] ?? 0;
        } catch (e) {}
        return {count};
    }

    async fetchAllAsync(): Promise<Array<FileResponse>> {
        return alasql('SELECT * FROM GERI_MEDICA');
    }

    async fetchByCodeAsync(code: string): Promise<FileResponse> {
        if (typeof code !== 'string') {
            throw new InvalidCodeError(typeof code);
        }
        code = code.trim();
        if (code === '') {
            throw new EmptyCodeError();
        }
        const result = alasql(`SELECT * FROM ${this._table} WHERE code = ?`, [code]) as Array<FileResponse>;
        if (Array.isArray(result) && result.length > 0) {
            return result[0];
        }
        throw new CodeNotFoundError(code);
    }

    async deleteAsync(): Promise<CountResponse> {
        const result = await this.sizeAsync();
        alasql(`DELETE FROM ${this._table}`);
        return result;
    }
}