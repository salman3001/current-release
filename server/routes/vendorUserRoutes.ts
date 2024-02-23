import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('vendor-users/export', 'venderUser/VenderUsersController.export')
  Route.post('vendor-users/import', 'venderUser/VenderUsersController.import')
  Route.get('vendor-users/unique-field', 'venderUser/VenderUsersController.uniqueField')
  Route.post('vendor-users/ban/:id', 'venderUser/VenderUsersController.banUser')
  Route.post('vendor-users/update-password/:id', 'venderUser/VenderUsersController.updateUserPassword')

  Route.resource('vendor-users', 'venderUser/VenderUsersController').apiOnly()
}).prefix('api')
