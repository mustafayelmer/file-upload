export class InvalidFileError extends Error {
    constructor(type: string) {
        super(`Invalid file data with type: ${type}`);
    }
}
export class EmptyFileError extends Error {
    constructor() {
        super(`No file uploaded`);
    }
}
export class InvalidCsvLinesError extends Error {
    constructor() {
        super(`Invalid CSV lines`);
    }
}
export class CodeNotFoundError extends Error {
    constructor(code: string) {
        super(`Code was not found with value: ${code}`);
    }
}
export class InvalidCodeError extends Error {
    constructor(type: string) {
        super(`Code is invalid with type: ${type}`);
    }
}
export class EmptyCodeError extends Error {
    constructor() {
        super(`Code is empty`);
    }
}