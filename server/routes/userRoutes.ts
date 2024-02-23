import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('users/export', 'user/UsersController.export')
  Route.post('users/import', 'user/UsersController.import')
  Route.get('/users/unique-field', 'user/UsersController.uniqueField')
  Route.post('users/ban/:id', 'user/UsersController.banUser')
  Route.post('users/update-password/:id', 'user/UsersController.updateUserPassword')

  Route.resource('users', 'user/UsersController').apiOnly()

  Route.resource('job-industry', 'user/JobIndustryController').apiOnly()

  Route.resource('job-departments', 'user/JobDepartmentController').apiOnly()
  // Route.resource('scoial', 'user/user/SocialController').apiOnly()

  // cart
  Route.get('my-cart', 'user/CartsController.show')
  Route.put('update-my-cart', 'user/CartsController.update')
}).prefix('api')
