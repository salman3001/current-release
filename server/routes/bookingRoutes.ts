import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // bookings
  Route.post('bookings/summary', 'booking/BookingController.summary')
  Route.get('bookings/get-coupons', 'booking/BookingController.getCoupons')
  Route.get('bookings/customer-bookings', 'booking/BookingController.customerBookingList')
  Route.get('bookings/vendor-bookings', 'booking/BookingController.venodrBookingList')
  Route.put('bookings/:id/update-status', 'booking/BookingController.updateStatus')
  Route.resource('bookings', 'booking/BookingController').only(['index', 'store'])

  Route.get('bid-bookings/my-list', 'booking/BidBookingController.myList')
  Route.post('bid-bookings/:id/update-status', 'booking/BidBookingController.updateStatus')
  Route.resource('bid-bookings', 'booking/BidBookingController').only(['index', 'store', 'show'])

  // coupons
  Route.get('coupons/vendor-coupons', 'booking/CouponsController.vendorCoupons')
  // Route.post('coupons/:id/apply-to-services', 'CouponsController.applyToServices')
  Route.put('coupons/:id/update-services', 'booking/CouponsController.updateServices')
  Route.resource('coupons', 'CouponsController')
}).prefix('api')
