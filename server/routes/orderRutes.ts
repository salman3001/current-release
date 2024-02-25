import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // orders
  Route.get('orders/summary', 'OrdersController.summary')
  Route.get('orders/my-orders', 'OrdersController.myOrders')
  Route.put('orders/:id/update-status', 'OrdersController.updateStatus')
  Route.resource('orders', 'OrdersController').only(['index', 'store'])
}).prefix('api')
