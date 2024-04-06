<script setup lang="ts">

const props = defineProps<{
    selectedBooking: IBooking | IBidBooking
    bookingtype: 'normal' | 'custom'
    title: string
}>()

defineEmits<{
    (e: 'success'): void
    (e: 'error'): void
}>()

const { form: statusForm, loading: updatingStatus, update: updateStatus } = useBookingApi.updateStatus({
    remarks: '',
    status: props.selectedBooking?.status || '' as OrderStatus,
})

const { form: customStatusForm, loading: updatingCustomStatus, update: updateCustomStatus } = useBidBookingApi.updateStatus({
    remarks: '',
    status: props.selectedBooking?.status || '' as OrderStatus,
})

</script>

<template>
    <Modal2Base :title="title">
        <q-form class="q-gutter-y-sm" @submit="() => {
        if (bookingtype == 'normal') {
            updateStatus(
                selectedBooking!.id,
                {
                    onSuccess: () => {
                        $emit('success')
                    },
                    onError: () => {
                        $emit('error')
                    },
                })
        }

        if (bookingtype == 'custom') {
            updateCustomStatus(
                selectedBooking!.id,
                {
                    onSuccess: () => {
                        $emit('success')
                    },
                    onError: () => {
                        $emit('error')
                    },
                })
        }
    }">
            <div>
                <div class="q-gutter-sm normalcase" v-if="bookingtype == 'normal'">
                    <q-radio v-model="statusForm.status"
                        v-for="status, i in Object.values(OrderStatus).filter(v => v != 'placed')"
                        checked-icon="task_alt" :val="status" :label="status" :rules="[rules.required('Required')]" />
                    <q-input type="textarea" outlined label="Remarks" v-model="statusForm.remarks" />
                </div>
                <div class="q-gutter-sm normalcase" v-if="bookingtype == 'custom'">
                    <q-radio v-model="customStatusForm.status"
                        v-for="status, i in Object.values(OrderStatus).filter(v => v != 'placed')"
                        checked-icon="task_alt" :val="status" :label="status" :rules="[rules.required('Required')]" />
                    <q-input type="textarea" outlined label="Remarks" v-model="customStatusForm.remarks" />
                </div>

            </div>
            <div class="row q-gutter-sm justify-end q-pt-lg">
                <q-btn color="primary" v-if="updatingStatus" disabled>
                    <LoadingIndicator /> Processing
                </q-btn>
                <q-btn color="primary" type="submit" :disabled="updatingStatus" v-else
                    style="min-width: 6rem">Submit</q-btn>
            </div>
        </q-form>
    </Modal2Base>
</template>