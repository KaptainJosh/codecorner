const User = require('./models/userModel');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;

const verifyCallback = (username, password, done) => {
	User.findOne({username: username}).then(user => {

		if (!user) 
		{
			return done(null, false);
		}
		else
		{
            const comparePassword = async (password, hash) => {
                try {
                    return await bcrypt.compare(password, hash);
                } catch (error) {
                    console.log(error);
                }

                return false;
            }

            (async () => {
                const passwordHash = user.passwordHash;

                const isValidPass = await comparePassword(password, passwordHash);

                if (isValidPass)
                {
                    return done(null, user);
                }

                else
                {
                    return done(null, false);
                }
            })();
		}
		
		
	})
}

const authenticateUser = (passport) => {
	passport.use(new localStrategy(verifyCallback));

	passport.serializeUser((user, done) => done(null, user.id));

	passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)))
}

module.exports = authenticateUser;