import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.post('service-requirements/:id/accept-bid', 'bid/ServiceRequirementController.acceptBid')
    Route.get('service-requirements/:id/accepted-bid', 'bid/ServiceRequirementController.showAcceptedBid')
    Route.resource('service-requirements', 'bid/ServiceRequirementController').apiOnly()
    Route.resource('bids', 'bid/BidController').apiOnly()
}).prefix('api')
