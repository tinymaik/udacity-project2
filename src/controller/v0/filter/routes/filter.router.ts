import {Router, Request, Response} from "express";
import { stringify } from "querystring";
import { deleteLocalFiles } from "../../../../util/util";
import { filterImageFromURL } from "../../../../util/util";
const imagefilter_router : Router = Router()

imagefilter_router.get("/filteredimage", async(req: Request, res:Response) => {
    let image_url: string = req.query.image_url

    if( !image_url ){
        return res.status(400).send({message: "img_url parameter is mandatory"})
    }
    if (! image_url.startsWith("http")) {
        return res.status(400).send({message: "please use a url that starts with http"})
    }
    let newimage_path: string;

    try{
        newimage_path = await filterImageFromURL(image_url)
    } catch (err) {
        console.error("ERROR::Filter >> ", err);
        return res.status(204).send({message: "An Error ocurr when trying to apply the filter"});
    }
    res.setHeader('Content-type', 'image/jpeg');
    res.download(newimage_path, async err => {
        if(err) {
        res.status(204).end();
        }
    
        try {
            await deleteLocalFiles([newimage_path])
            
        } catch (err) {
            console.error("Error:: Cant delete the file >>", err)
        }
    });
});
export const ImageFilterRouter: Router = imagefilter_router;