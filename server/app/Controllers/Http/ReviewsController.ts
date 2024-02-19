// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Review from 'App/Models/service/Review'
import BaseController from './BaseController'
import CreateReviewValidator from 'App/Validators/CreateReviewValidator'
import UpdateReviewValidator from 'App/Validators/UpdateReviewValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ReviewsController extends BaseController {
  constructor() {
    super(Review, CreateReviewValidator, UpdateReviewValidator)
  }

  public async store({ request, response, bouncer }: HttpContextContract): Promise<void> {
    const payload = await request.validate(CreateReviewValidator)
    const review = await Review.create(payload)
    return response.custom({
      message: 'Review added',
      code: 201,
      data: review,
      success: true,
    })
  }

  public async update({ params, request, response, bouncer }: HttpContextContract): Promise<void> {
    const review = await Review.findOrFail(+params.id)
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
