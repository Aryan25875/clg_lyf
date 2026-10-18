const z = require('zod');

const registerSchema = z.object({
    username: z.string().min(3, "Username Must be minimum 3 chars long").max(20, "Username must be under 20 chars"),
    email: z.email("Enter Valid Email"),
    password: z.string().min(8, "Password must be minimum 8 chars long")
    
})

const loginSchema = z.object({
    username: z.string().min(3, "Username Must be minimum 3 chars long").max(20, "Username must be under 20 chars").optional(),
    email: z.email("Enter Valid Email").optional(),
    password: z.string().min(8, "Password must be minimum 8 chars long")
}).refine(
    (data)=>data.username !== undefined || data.email !== undefined,
    {
        msg : "Either Username or Email Must be Provided",
        path: ["username"]
    }
)

const onlyEmail = z.object({
    email: z.email("Enter Valid Email")
})

const changePassByOldPassSchema = z.object({
    email: z.email("Enter Valid Email"),
    password: z.string().min(8, "Password must be minimum 8 chars long"),
    newPassword: z.string().min(8, "New Password must be minimum 8 chars long")
})

const changePasswordbyOtpSchema = z.object({
    email: z.email("Enter Valid Email"),
    newPassword: z.string().min(8, "Password must be minimum 8 chars long")
})

module.exports = {registerSchema, loginSchema, onlyEmail, changePassByOldPassSchema,changePasswordbyOtpSchema};




