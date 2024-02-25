import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('vendor-users/export', 'vendorUser/VendorUsersController.export')
  Route.post('vendor-users/import', 'vendorUser/VendorUsersController.import')
  Route.get('vendor-users/unique-field', 'vendorUser/VendorUsersController.uniqueField')
  Route.post('vendor-users/ban/:id', 'vendorUser/VendorUsersController.banUser')
  Route.post(
    'vendor-users/update-password/:id',
    'vendorUser/VendorUsersController.updateUserPassword'
  )

  // update profile
  Route.put('vendor-users/:id/update-profile', 'vendorUser/VendorUsersController.updateProfile')

  // update business
  Route.put('vendor-users/:id/update-business', 'vendorUser/VendorUsersController.updateBusiness')

  Route.resource('vendor-users', 'vendorUser/VendorUsersController').apiOnly()

  // business list
  Route.get('businesses', 'vendorUser/BuissnessesController.index')
}).prefix('api')
