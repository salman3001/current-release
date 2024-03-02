import { ofetch, type FetchOptions } from 'ofetch'
import { Notify } from "quasar";

export default function createFetch(option: FetchOptions) {

    globalThis.$fetch = ofetch.create({
        onResponse: (ctx) => {
            const success = ctx.response._data?.success
            const message = ctx.response._data?.message

            if (message) {
                if (success) {
                    Notify.create({
                        message,
                        icon: 'done',
                        color: 'positive'
                    })
                } else {
                    Notify.create({
                        message,
                        icon: 'warning',
                        color: 'negative'
                    })
                }
            }
        },
        ...option

    })
}

