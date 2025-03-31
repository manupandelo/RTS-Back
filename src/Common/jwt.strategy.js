import { ExtractJwt, Strategy } from "passport-jwt"
import passport from "passport"
import "dotenv/config"

// Configuración de la estrategia JWT
const jwtOptions = {
  secretOrKey: process.env.AUTH_HS256_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  issuer: process.env.AUTH_ISSUER_URL,
  algorithms: ["HS256"],
}

// Crear la estrategia
const strategy = new Strategy(jwtOptions, (payload, done) => {
  try {
    if (!payload) {
      return done(null, false)
    }
    return done(null, payload)
  } catch (error) {
    return done(error, false)
  }
})

// Inicializar passport con la estrategia
passport.use(strategy)

// Middleware de autenticación
export const Authenticate = (req, res, next) => {
  console.log("Token:", req.headers.authorization)
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Error en autenticación:", err)
      return res.status(500).json({ message: "Error interno del servidor" })
    }

    if (!user) {
      console.log("Token inválido o no proporcionado:", info?.message)
      return res.status(401).json({ message: "No autorizado" })
    }

    // Guardar el usuario en el request para uso posterior
    req.user = user
    next()
  })(req, res, next)
}