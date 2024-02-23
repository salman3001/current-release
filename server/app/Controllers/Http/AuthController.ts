import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import AdminUser from 'App/Models/adminUser/AdminUser'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/user/User'
import ForgotPasswordOtpMail from 'App/Mailers/ForgotPasswordOtpMail'
import VenderUser from 'App/Models/venderUser/VenderUser'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const payloadSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.normalizeEmail({ allLowercase: true }),
      ]),
      password: schema.string({ trim: true }),
      userType: schema.enum(['admin', 'vendor', 'customer'])
    })


    const payload = await request.validate({ schema: payloadSchema })

    let user: AdminUser | User | VenderUser | null = null

    if (payload.userType === 'admin') {
      user = await AdminUser.findBy('email', payload.email)
    }

    if (payload.userType === 'vendor') {
      user = await VenderUser.findBy('email', payload.email)
    }

    if (payload.userType === 'customer') {
      user = await User.findBy('email', payload.email)
    }

    if (!user || user?.isActive == false) {
      return response.custom({
        message: 'Failed to login. Check your credentials!',
        code: 400,
        data: null,
        success: false,
      })
    }

    // try {
    let token: any = ''
    if (user instanceof AdminUser) {

      token = await auth.use('adminUserApi').attempt(payload.email, payload.password, {
        expiresIn: '1 day',
      })
      // console.log(user);
      await user.load('role')
    }

    if (user instanceof VenderUser) {

      token = await auth.use('venderUserApi').attempt(payload.email, payload.password, {
        expiresIn: '1 day',
      })
      console.log('ran');
    }


    if (user instanceof User) {
      token = await auth.use('userApi').attempt(payload.email, payload.password, {
        expiresIn: '1 day',
      })
    }
    const socketToken = Math.floor(100000 + Math.random() * 900000).toString()

    user.socketToken = socketToken

    await user.save()

    return response.custom({
      message: 'Login Successfull',
      code: 200,
      data: { user, token, socketToken },
      success: true,
    })
    // } 
    // catch (error) {
    //   return response.custom({
    //     message: 'Failed to login. Check your credentials!',
    //     code: 400,
    //     data: null,
    //     success: false,
    //   })
    // }
  }

  public async logout({ auth, response, request }: HttpContextContract) {
    const payloadSchema = schema.create({
      userType: schema.enum(['admin', 'vendor', 'customer'])
    })
    const payload = await request.validate({ schema: payloadSchema })

    if (payload.userType == 'admin') {
      await auth.use('adminUserApi').revoke()
    }
    if (payload.userType == 'customer') {
      await auth.use('userApi').revoke()
    }
    if (payload.userType == 'vendor') {
      await auth.use('venderUserApi').revoke()
    }

    return response.custom({
      message: 'Logout Success',
      code: 200,
      data: null,
      success: true,
    })
  }

  public async sendForgotPasswordOtp({ response, request }: HttpContextContract) {
    const validationSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.normalizeEmail({ allLowercase: true }),
      ]),
      userType: schema.enum(['admin', 'vendor', 'customer'])
    })

    const payload = await request.validate({
      schema: validationSchema,
    })

    let user: AdminUser | User | VenderUser | null = null

    if (payload.userType === 'admin') {
      user = await AdminUser.findBy('email', payload.email)
    }

    if (payload.userType === 'vendor') {
      user = await VenderUser.findBy('email', payload.email)
    }

    if (payload.userType === 'customer') {
      user = await User.findBy('email', payload.email)
    }

    if (user) {
      await new ForgotPasswordOtpMail(user as any).sendLater()
      return response.json({ message: 'Otp Sent' })
    } else {
      return response.custom({
        message: 'invalid email id',
        code: 406,
        data: null,
        success: false,
      })
    }
  }

  public async vaerifyOtpAndUpdatePassword({ response, request }: HttpContextContract) {
    const validationSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.normalizeEmail({ allLowercase: true }),
      ]),
      otp: schema.string({ trim: true }),
      password: schema.string({ trim: true }, [rules.minLength(8)]),
      password_confirmation: schema.string({ trim: true }, [rules.confirmed('password')]),
      userType: schema.enum(['admin', 'vendor', 'customer'])
    })

    const payload = await request.validate({
      schema: validationSchema,
    })

    let user: AdminUser | User | VenderUser | null = null

    if (payload.userType === 'admin') {
      user = await AdminUser.findBy('email', payload.email)
    }

    if (payload.userType === 'vendor') {
      user = await VenderUser.findBy('email', payload.email)
    }

    if (payload.userType === 'customer') {
      user = await User.findBy('email', payload.email)
    }

    if (user) {
      if (user.token == payload.otp) {
        user.password = payload.password

        await user.save()

        return response.custom({
          message: 'Password updated',
          code: 200,
          data: null,
          success: true,
        })
      } else {
        return response.custom({
          message: 'Invalid OTP',
          code: 406,
          data: null,
          success: false,
        })
      }
    } else {
      return response.custom({
        message: 'Invalid Email',
        code: 406,
        data: null,
        success: false,
      })
    }
  }

  public async updateUserPassword({ params, response, request }: HttpContextContract) {
    const validationSchema = schema.create({
      password: schema.string({ trim: true }, [rules.minLength(8)]),
      password_confirmation: schema.string({ trim: true }, [rules.confirmed('password')]),
      old_password: schema.string({ trim: true }),
      userType: schema.enum(['admin', 'vendor', 'customer'])

    })

    const payload = await request.validate({
      schema: validationSchema,
    })

    let user: AdminUser | User | VenderUser | null = null

    if (payload.userType === 'admin') {
      user = await AdminUser.findOrFail(+params.id)
    }

    if (payload.userType === 'vendor') {
      user = await VenderUser.findOrFail(+params.id)
    }

    if (payload.userType === 'customer') {
      user = await User.findOrFail(+params.id)
    }

    if (user && await Hash.verify(user.password, payload.password)) {
      const newPassword = await Hash.make(payload.password)
      user.password = newPassword
      await user.save()
      return response.custom({
        message: 'Password changed',
        code: 200,
        data: null,
        success: true,
      })
    } else {
      return response.custom({
        message: 'Old password dont match',
        code: 406,
        data: null,
        success: false,
      })
    }
  }
}
