import User from "../models/User";

export const swipeRight = async (req,res) => {
    try{
        const{likedUserId} = req.params;
        const currentUser = await User.findById(req.user.id);
        const likedUser = await User.findById(likedUserId);

        if(!likedUser){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if(!currentUser.likes.includes(likedUserId)){
            currentUser.likes.push(likedUserId);
            await currentUser.save();

            if(likedUser.likes.includes(currentUser.id)){
                currentUser.matches.push(likedUserId);
                likedUser.matches.push(currentUser.id);
                
                //TODO: Send notification if it is a match => socket.io
                
                //saves the matches at the same time
                await Promise.all([
                    await currentUser.save(),
                    await likedUser.save()
                ]);
            }

        }
        res.status(200).json({
            success: true,
            user: currentUser,

        });
    } catch (error){
        console.log("Error in swipeRight: ", error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export const swipeLeft = async (req,res) => {
    try{
        const dislikedUserId = req.params;
        const currentUser = await User.findById(req.user.id);

        if(!currentUser.dislikes.includes(dislikedUserId)){
            currentUser.dislikes.push(dislikeUserId);
            await currentUser.save();
        }

        res.status(200).json({
            success: true,
            user: currentUser,

        })
    }catch(error){
        console.log("Error in swipeLeft: ", error);

        res.status(500).json({
            success: false,
            message: "Internal service error",
        });
    }
};

export const getMatches = async (req,res) => {

};

export const getUserProfiles = async (req,res) => {
    try{
        const currentUser = await User.findById(req.user.id);

        const users = await User.find({
            $and: [
                { _id: {$ne: currentUser.id}},
                { _id: {$nin: currentUser.likes}},
                { _id: {$nin: currentUser.dislikes}},
                { _id: {$nin: currentUser.matches}},
                {
                    gender: 
                    currentUser.genderPreference === "both" ? {
                        $in: ["male","female"]
                    }
                    : currentUser.genderPreference,
                },
                //make both users happy
                {genderPreference: {$in: [currentUser.gender, "both"]}} 
            ]
        })

        res.status(200).json({
            success: true,
            users,
        })
    } catch (error){

    }
};