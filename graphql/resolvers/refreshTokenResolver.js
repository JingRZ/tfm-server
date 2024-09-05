import RefreshToken from "../models/refreshToken.js";

const refreshTokenResolver = {
    Query: {
        findRefreshTokenByToken: async (root, args) => {
            const refreshToken = await RefreshToken.findOne({token: args.refreshToken})
            return refreshToken
        },
        
    },
    Mutation: {
        addRefreshToken: async (root, args) => {
            const tokens = await RefreshToken.find({username: args.username})
            if(tokens.length > 0){
                console.warn("There are", tokens.length, "refresh tokens for username", args.username)
                console.warn("Removing old tokens")

                for(let i = 0; i < tokens.length; i++){
                    await RefreshToken.deleteOne({token: tokens[i].token})
                }
            }

            const refToken = new RefreshToken({...args})
            try{
                await refToken.save()
    
            } catch(error){
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }
            return refToken
        },
        removeRefreshToken: async (root, args) => {
            
            try{
                const token = RefreshToken.findOne({token: args.refreshToken, username: args.username})
                if(!token || !token.active){
                    await RefreshToken.deleteOne({username: args.username}).save()
                    return false
                }
                const res = RefreshToken.delete({username: args.username})
                await res.save()
    
            } catch(error){
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }
            return true
        }
    },
};

export default refreshTokenResolver;


