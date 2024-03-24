import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { LucidModel, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Config from '@ioc:Adonis/Core/Config'



export default class BaseApiController {

    protected searchByFileds(): string[] {
        return []
    }

    public async paginate(request: HttpContextContract['request'], modelQuery: ModelQueryBuilderContract<any, any>) {
        const model = await modelQuery.paginate(request.qs().page || 1, request.qs().perPage || Config.get('common.rowsPerPage'))
        return model
    }

    public applyFilters(modelQuery: ModelQueryBuilderContract<any, any>, qs: Record<string, any>) {

        if (qs?.search) {
            this.searchByFileds().forEach((field, i) => {
                if (i == 0) {
                    modelQuery.whereILike(field, qs?.search)
                } else {
                    modelQuery.orWhereILike(field, qs?.search)
                }
            })
        }

        if (qs?.orderBy) {
            const [orderBy, direction] = (qs.orderBy as string).split(':')
            modelQuery.orderBy(orderBy, (direction as 'desc') || 'asc')
        }

        this.extraFilters(modelQuery, qs)

        return modelQuery
    }

    public extraFilters(modelQuery: ModelQueryBuilderContract<any, any>, qs: Record<string, any>): void {
    }
}