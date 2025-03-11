import { ExtractJwt, Strategy } from "passport-jwt";
import passport from "passport";
import "dotenv/config";

const opt = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.AUTH_HS256_KEY,
  issuer: process.env.AUTH_ISSUER_URL,
  algorithms: ['HS256'],
};

// Registrar la estrategia JWT con Passport
passport.use(
  new Strategy(opt, (jwt_payload, done) => {
    if (!jwt_payload) {
      // Si no hay carga útil, no se permite la autenticación
      return done(null, false); 
    }
    // Si se encuentra la carga útil, se pasa como el usuario autenticado
    return done(null, jwt_payload); 
  })
);

// Middleware de autenticación
export const Authenticate = (req, res, next) => {
  console.log('Authenticate');
  console.log(req.headers);  // Para ver las cabeceras y el token recibido
  
  // Usar la estrategia 'jwt' registrada con Passport
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(401).send({ message: 'Unauthorized' });
    }
    if (!user) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    
    // El usuario está autenticado, continuar con la siguiente función
    req.user = user;  // Puedes almacenar el usuario en `req.user`
    next();
  })(req, res, next);
};