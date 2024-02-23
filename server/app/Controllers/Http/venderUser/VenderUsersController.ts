import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VenderUser from "App/Models/venderUser/VenderUser"
import BaseController from "../BaseController"
import VendorUserUpdateValidator from "App/Validators/vendorUser/VendorUserUpdateValidator"
import VendorUserCreateValidator from "App/Validators/vendorUser/VendorUserCreateValidator"
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'


export default class VenderUsersController extends BaseController {
    constructor() {
        super(VenderUser, VendorUserCreateValidator, VendorUserUpdateValidator, 'VendorUserPolicy')
    }

    public async store({ request, response, bouncer }: HttpContextContract) {
        const payload = await request.validate(VendorUserCreateValidator)
        const user = new VenderUser()
        await bouncer.with('VendorUserPolicy').authorize('create')

        user.merge(payload)
        await user.save()

        await user.save()

        return response.custom({
            message: 'User Added Successfully',
            code: 201,
            data: user,
            success: true,
        })
    }

    public async update({ request, response, params, bouncer }: HttpContextContract) {
        const payload = await request.validate(VendorUserUpdateValidator)
        const id = params.id
        const user = await VenderUser.findOrFail(id)
        await bouncer.with('VendorUserPolicy').authorize('update', user)

        user.merge(payload)
        await user.save()

        return response.custom({
            message: 'User updated Successfully',
            code: 201,
            data: user,
            success: true,
        })
    }

    public async banUser({ params, response, bouncer }: HttpContextContract) {
        await bouncer.with('VendorUserPolicy').authorize('delete')
        const user = await VenderUser.findOrFail(+params.id)
        user.isActive = false
        await user.save()
        return response.custom({
            message: 'User Banned Successfully',
            code: 200,
            data: user,
            success: true,
        })
    }

    public async updateUserPassword({ params, response, request, bouncer }: HttpContextContract) {
        const user = await VenderUser.findOrFail(+params.id)

        await bouncer.with('VendorUserPolicy').authorize('update', user)

        const validationSchema = schema.create({
            password: schema.string({ trim: true }, [rules.minLength(8)]),
            password_confirmation: schema.string({ trim: true }, [rules.confirmed('password')]),
        })

        const payload = await request.validate({
            schema: validationSchema,
        })
        user.password = payload.password
        await user.save()
        return response.custom({
            message: 'Password changed',
            code: 200,
            data: user,
            success: true,
        })
    }

    public async storeExcelData(data: any, ctx: HttpContextContract): Promise<void> {
        ctx.meta = {
            currentObjectId: data.id,
        }
        const validatedData = await validator.validate({
            schema: new VendorUserUpdateValidator(ctx).schema,
            data: {
                user: data,
            },
        })

        await VenderUser.updateOrCreate({ id: validatedData.id }, validatedData)
    }

    public excludeIncludeExportProperties(record: any) {
        const { createdAt, updatedAt, avatar, ...rest } = record
        return { ...rest, password: '' }
    }
}
