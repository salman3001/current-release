// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Review from 'App/Models/Review'
import BaseController from '../BaseController'
import CreateReviewValidator from 'App/Validators/CreateReviewValidator'
import UpdateReviewValidator from 'App/Validators/UpdateReviewValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ReviewsController extends BaseController {
  constructor() {
    super(Review, CreateReviewValidator, UpdateReviewValidator, 'ReviewPolicy')
  }

  public getIndexQuery(ctx: HttpContextContract) {
    const serviceId = ctx?.params.serviceId

    return Review.query().where('service_id', serviceId)
  }

  public async store({ request, response, bouncer, auth, params }: HttpContextContract) {
    await bouncer.with('ReviewPolicy').authorize('create')

    const user = auth.user
    const serviceId = params.serviceId

    const reviewExist = await Review.query()
      .where('user_id', user!.id)
      .where('service_id', serviceId)
      .first()

    if (reviewExist) {
      return response.custom({
        code: 400,
        message: 'You have already rated this service',
        success: false,
        data: null,
      })
    }

    const payload = await request.validate(CreateReviewValidator)

    const review = await Review.create({ ...payload, userId: user?.id, serviceId: serviceId })
    return response.custom({
      message: 'Review added',
      code: 201,
      data: review,
      success: true,
    })
  }

  public async update({ params, request, response, bouncer }: HttpContextContract) {
    const review = await Review.findOrFail(+params.id)

    await bouncer.with('ReviewPolicy').authorize('update')
    const payload = await request.validate(UpdateReviewValidator)

    review.merge(payload)

    await review.save()
    return response.custom({
      message: 'Review updated',
      code: 201,
      data: review,
      success: true,
    })
  }
}
