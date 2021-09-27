import * as express from "express";
import {Express, Router} from "express";
import {UploadService} from "./UploadService";
import fileUpload from "express-fileupload";
// import * as fileUpload from "express-fileupload";

// noinspection JSUnusedGlobalSymbols
export class UploadController {
    _router: Router;
    _service: UploadService;


    /**
     * @constructor
     * */
    constructor() {
        this._router = express.Router();
        this._service = new UploadService();
    }
    route(app: Express): void {
        app.use(fileUpload({
            createParentPath: true,
            limits: {
                fileSize: 10 * 1024 * 1024 * 1024 //10MB max file
            }
        }));
        this._router.post('/upload', (req, res) => {
            this._service.uploadAsync(req)
                .then(content => {
                    res.status(200).json(content);
                })
                .catch((e: Error) => {
                    res.status(400).json({name: e.name, message: e.message});
                });
        });

        this._router.get('/size', (req, res) => {
            this._service.sizeAsync()
                .then(content => {
                    res.json(content);
                })
                .catch((e: Error) => {
                    res.status(400).json({name: e.name, message: e.message});
                });
        });
        this._router.get('/all', (req, res) => {
            this._service.fetchAllAsync()
                .then(content => {
                    res.json(content);
                })
                .catch((e: Error) => {
                    res.status(400).json({name: e.name, message: e.message});
                });
        });
        this._router.get('/fetch/:code', (req, res) => {
            this._service.fetchByCodeAsync(req.params.code as string)
                .then(content => {
                    res.json(content);
                })
                .catch((e: Error) => {
                    res.status(400).json({name: e.name, message: e.message});
                });
        });
        this._router.delete('/delete-all', (req, res) => {
            this._service.deleteAsync()
                .then(content => {
                    res.json(content);
                })
                .catch((e: Error) => {
                    res.status(400).json({name: e.name, message: e.message});
                });
        });
        app.use(this._router);
    }
}