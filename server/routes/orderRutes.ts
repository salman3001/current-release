import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // orders
  Route.post('orders/summary', 'OrdersController.summary')
  Route.get('orders/get-coupons', 'OrdersController.getCoupons')
  Route.get('orders/customer-orders', 'OrdersController.customerOrdersList')
  Route.get('orders/vendor-orders', 'OrdersController.venodrOrdersList')
  Route.put('orders/:id/update-status', 'OrdersController.updateStatus')
  Route.resource('orders', 'OrdersController').only(['index', 'store'])

  // coupons
  Route.get('coupons/vendor-coupons', 'CouponsController.vendorCoupons')
  // Route.post('coupons/:id/apply-to-services', 'CouponsController.applyToServices')
  Route.put('coupons/:id/update-services', 'CouponsController.updateServices')
  Route.resource('coupons', 'CouponsController')
}).prefix('api')
