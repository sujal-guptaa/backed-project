import multer from "multer";

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/temp")
    },
    filename:function(req,file,cb){
        cb(null,file.originalname) //have a homework this origina nam is not industry standart practice
        // try for buffer
    }
})
export const upload=multer({
    storage,
})

