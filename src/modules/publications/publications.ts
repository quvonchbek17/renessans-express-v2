import { Request, Response, NextFunction } from "express";
import model from "./model"
import { ErrorHandler } from "../../errors/errorHandler"
import { FileUpload } from "../fileupload/fileupload";


export class Publications {
    static async Get(req: Request,res: Response,next: NextFunction): Promise<void> {
        res.status(200).json({
            success: true,
            data: await model.find().sort({created_at: -1})
        })
    }

    static async Post(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { name, desc, imgUrl, fileUrl} =  req.body;

        const publication = new model({
            name, desc, imgUrl, fileUrl
        })
        publication.save()
        res.status(200).json({
            success: true,
            data: publication
        })
    }

    static async Update(req: Request, res: Response,next: NextFunction): Promise<void> {
        const { id, name, desc, imgUrl, fileUrl } = req.body
        const updated = await model.findOneAndUpdate({ _id: id }, {
            $set: {
                name, desc, imgUrl, fileUrl,
                updated_at: new Date()
            }
        }).
        catch((err: ErrorHandler) => next(new ErrorHandler(err.message, 503)))

           if(updated){
            updated.save()
            const [ newData ] = await model.find({_id: id})
            res.status(200).json({
                success: true,
                data: newData
            })
           } else {
            res.status(404).json({
                success: false,
                message: "Nashr topilmadi"
            })
           }
    }


    static async Delete(req: Request, res: Response,next: NextFunction): Promise<void> {
        const { id } = req.params

        const deleted  = await model.findByIdAndDelete({_id: id})
        .catch((err: ErrorHandler) => next(new ErrorHandler(err.message, 503)))
        if(deleted) {
            let fileName = (deleted.fileUrl || "").split("/").at(-1)
            await FileUpload.DeleteFile(fileName || "")
            res.status(200).json({
                success: true,
                data: deleted
            })
        } else {
            res.status(404).json({
                success: false,
                message: "Nashr topilmadi"
            })
        }

    }
}
