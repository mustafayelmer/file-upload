export interface UploadedFile {
    [name: string]: FilePart;
}
export interface UploadedFileInfo {
    name: string;
    mimetype: string;
    size: number;
}
export interface FilePart {
    name: string;
    data: Buffer;
    size: number;
    mimetype: string;
    encoding: string;
    truncated: boolean;
    md5: string;
    mv(path: string): void;
}
export interface FileResponse extends Record<string, unknown> {
    code: string;
}
export interface CountResponse {
    count: number;
}