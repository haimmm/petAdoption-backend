const bcrypt = require("../modules/bcrypt.module");

const jwt = require("../modules/jwt.module");

const usersService = require("../services/users.service");
const authService = require("../services/auth.service");


const register = async (req, res, next) => {
  try{
    const { email, password } = req.body;
    let user = await usersService.getByEmail(email.toLowerCase());

    if(user){
      return next({message:'This email is taken.', status:"409"});
    }

    delete req.body.passwordConfirm; 
    req.body.email = req.body.email.toLowerCase(); 

    user = {
      ...req.body,
      password: bcrypt.encrypt(password),
      pets: {
        saved: [],
        adopted: [],
        fostered: []
      }
    };
  
    const id = await usersService.add(user)
    console.log("new user regitered:", id);
    res.redirect(307, '/auth/login'); //auto login after register
  }catch(err){
    console.log(err);
    next({status: 500});
  }
}

const login = async (req, res, next) => {
  try{
    //delete prev session
    const prev_session_token = req.cookies?.refresh_token;
    if(prev_session_token){
      const session = await authService.getSession(prev_session_token);
      session && authService.removeSession(session._id);
    }

    //login
    const { email, password } = req.body;
    const user = await usersService.getByEmail(email.toLowerCase());

    if(!user || !bcrypt.compare(password, user.password)){
      return next({message:'Wrong email or password.', status:"403"});
    }



    const refreshMaxAge = parseInt(process.env.REFRESH_TOKEN_MAX_AGE);
    const access_token = jwt.createNewToken({userId:user.id}, parseInt(process.env.ACCESS_TOKEN_MAX_AGE));
    const refresh_token = jwt.createNewToken({refresh:true}, refreshMaxAge);

    authService.createNewCookie(res, "refresh_token", refresh_token, new Date(Date.now() + refreshMaxAge));

    authService.addSession({
      access_token,
      refresh_token,
      userId: user._id.toString()
    });
    console.log("logged in: ", user.email);
    res.send({
      id: user._id.toString(),
      name: user.name,
      permissions: user.permissions,
      access_token,
      pets: user.pets
    });
  }catch(err){
    console.log(err);
    next({status: 500});
  }
  
}

const refresh = async (req, res, next) => {
  const token = req?.cookies?.refresh_token;
  console.log("Cookies: ", req.cookies);
  if (!token) {
    return next({message:"Token not found", status:"404"});
  }

  try{
    const session = await authService.getSession(token);
    if (!session) {
      return next({message:"Session not found", status:"404"});
    }
    
    const user = await usersService.getById(session.userId);
    
    if (!user) {
      return next({message:"Token is invalid", status:"403"});
    }
    user._id = user._id.toString();
    await authService.removeSession(session._id);
  
    const refreshMaxAge = parseInt(process.env.REFRESH_TOKEN_MAX_AGE);
    const access_token = jwt.createNewToken({userId:user._id}, parseInt(process.env.ACCESS_TOKEN_MAX_AGE));
    const refresh_token = jwt.createNewToken({refresh:true}, refreshMaxAge);
  
    authService.createNewCookie(res, "refresh_token", refresh_token, new Date(Date.now() + refreshMaxAge));
  
    await authService.addSession({
      access_token,
      refresh_token,
      userId: user._id
    });
  
    res.send({
      id: user._id,
      name: user.name,
      permissions: user.permissions,
      access_token,
      pets: user.pets
    });
  }catch(err){
    console.log(err);
    next({status: 500});
  }

}


module.exports = {
    register,
    login,
    refresh
};