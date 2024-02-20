import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('admin-login', 'AuthController.adminLogin')
  Route.get('admin-logout', 'AuthController.adminLogout')
  Route.post('get-otp', 'AuthController.sendForgotPasswordOtp')
  Route.post('verify-otp-update-password', 'AuthController.vaerifyOtpAndUpdatePassword')

  // user
  Route.post('user-login', 'AuthController.userLogin')
  Route.get('user-logout', 'AuthController.userLogout')
}).prefix('api/auth')
