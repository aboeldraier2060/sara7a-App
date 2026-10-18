import successResponce from "../../utils/response/sucess.response.js";
export const getProfile = async (req , res) =>{
    successResponce ({res, message: "done" , data :{user: req.user}})
}