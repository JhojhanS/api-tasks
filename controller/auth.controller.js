const Usuario = require('../model/Usuario')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    let usuario = await Usuario.findOne({ email })

    if (!usuario) {
      return res.status(400).json({
        message: 'Usuario no existe',
      })
    }

    const passCorrecto = await bcrypt.compare(password, usuario.password)

    if (!passCorrecto) {
      return res.status(400).json({
        message: 'Contraseña incorrecta',
      })
    }

    const payload = {
      usuario: {
        id: usuario.id,
      },
    }

    const token = await jwt.sign(payload, process.env.SECRET, {
      expiresIn: 3600000,
    })

    return res.status(200).json({
      message: 'Login exitoso',
      usuario,
      token,
    })
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      message: 'Error al registrar',
    })
  }
}
