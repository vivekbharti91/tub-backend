import { Router } from 'express';
import { 
    changeCurrentPassword, 
    getCurrentUser, 
    getUserChannelProfile, 
    getWatchHistory, 
    loggedOutUser, 
    loginUser, 
    refreshAceessToken, 
    registerUser, 
    updateAcountDetail, 
    updateUserAvatar, 
    updateUsercoverImage 
} from '../controllers/user.cotroller.js';

import { upload } from '../middlewares/multer.midddlerware.js';
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

router.route("/change-password").post(verityJWT, changeCurrentPassword)

router.route("/current-user").get(verityJWT, getCurrentUser)

router.route("/update-account").patch(verityJWT, updateAcountDetail)

router.route("/avatart").patch(verityJWT, upload.single("avatar"), updateUserAvatar)

router.route("/cover-image").patch(verityJWT, upload.single("coverImage"), updateUsercoverImage)

router.route("/c/:username").get(verityJWT, getUserChannelProfile)

router.route("/history").get(verityJWT, getWatchHistory)

export default router;