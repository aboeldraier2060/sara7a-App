import mongoose, { Schema } from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../utils/enums/user.enum.js";


const userSchema = new Schema ({
    firstName : {
        type:String ,
        require: [ true , "please enter your user name"],
        minLength : 2,
        maxLength : 25,
        trim : true
    },
    lastName : {
        type:String ,
        require: [ true , "please enter your user name"],
        minLength : 2,
        maxLength : 25,
        trim : true
    },
    email : {
        type: String,
        unique : true,
        require : true
    },
    password : {
        type : String,
        require : true,
    },
    DOB:Date,
    age:Number,
    phone :String,
    gender : {
        type :String,
        enum : Object.values(GenderEnum),
        default : GenderEnum.MALE,
    },
    role : {
        type:Number,
        enum:Object.values(RoleEnum),
        default : RoleEnum.ADMIN,
    },
    provider : {
        type:Number,
        enum:Object.values(ProviderEnum),
        default : ProviderEnum.SYSTEM,
    },
    confirmEmsil:Date ,
    confirmEmailOTP : String,
    forgetPasswordOTP: String,
    changeCredentialTime:Date,
    profilePic:String,
    converPic : [String]
}, {
    timestamps : true,
    toJSON : { virtuals : true},
    toObject :{ virtuals : true},

},
);


userSchema.virtual("username").set(function(value) {
    const [firstName , lastNmae] = value.split(" ")  || [];
    this.set({firstName, lastNmae});
}).get (function (){
    return`${this.firstName} ${this.lastName}`;
});


const UserModel = mongoose.model("User" , userSchema);

export default UserModel;