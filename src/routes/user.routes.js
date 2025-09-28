import {Router} from 'express';
import { loggedOutUser, loginUser, refreshAceessToken, registerUser } from '../controllers/user.cotroller.js';
import {upload} from '../middlewares/multer.midddlerware.js';
import { verityJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser)

//secured user 
router.route("/logout").post(verityJWT, loggedOutUser)

router.route("/refresh-token").post(refreshAceessToken)

export default router;