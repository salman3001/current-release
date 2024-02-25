import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    // orders
    Route.get('orders/summary', 'OrdersController.summary')
    Route.get('orders/my-orders', 'OrdersController.myOrders')
    Route.resource('orders', 'OrdersController').only(['index'])

}).prefix('api')
