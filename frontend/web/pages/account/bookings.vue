<script setup lang="ts">
import { date } from "quasar";

const { query, customerBookings } = useBookingApi.customerBookings({ page: 1 })
const {
    data: bookings,
    pending,
    refresh,
} = useAsyncData("bookings", async () => {
    const data = await customerBookings()
    return data.data;
});


const { form: creatChatForm, create } = useChatApi.cretae()
const createChat = async (vendorId: number, userType: string) => {
    creatChatForm.participant.userId = vendorId as unknown as string
    creatChatForm.participant.userType = userType as unknown as string

    const res = await create()
    console.log(res);

    if (res?.success == true) {
        navigateTo({
            path: routes.chats,
            query: {
                newConversationId: res?.data?.id,
            },
        });
    }
};

const columns = [
    {
        name: "id",
        required: true,
        label: "Booking No.",
        align: "left",
        field: (row: IBooking) => row.id,
    },
    {
        name: "service_name",
        required: true,
        label: "Service Name",
        align: "left",
        field: (row: IBooking) => row?.booking_detail?.service_variant.service_name,
    },
    {
        name: "created_at",
        align: "center",
        label: "Order Date",
        field: (row: IBooking) =>
            date.formatDate(row.created_at, "DD/MM/YYYY hh:mmA"),
    },
    { name: "status", label: "Status", field: "status" },
    {
        name: "payment",
        label: "Payment",
        field: (row: IBooking) => row?.payment_detail?.paymentStatus,
    },
    { name: "More", label: "More", field: "More", align: "center" },
];
</script>

<template>
    <br />
    <NavTabs :links="[{
        label: 'Profile',
        url: routes.account
    }, {
        label: 'Bookings',
        url: routes.bookings
    }, {
        label: 'Custom Bookings',
        url: routes.custom_bookings
    }
        , {
        label: 'Wishlist',
        url: routes.wishlist
    }, {
        label: 'Settings',
        url: routes.settings
    }, {
        label: 'Security',
        url: routes.security
    }]">
        <br />
        <div>
            <ScrollArea width="100vw" height="400px">
                <div class="" v-if="pending">
                    <SkeletonBase type="list" v-for="i in 2" />
                </div>
                <q-table :pagination="{
        rowsPerPage: 100,
    }" bordered v-else :rows="bookings!.data" :columns="columns" row-key="id" hide-pagination
                    class="table-zebra full-hieght shadow-6 q-ma-sm">
                    <template v-slot:body-cell-payment="props">
                        <q-td :props="props">
                            <q-badge class="normalcase q-pa-sm q-badge-positive"
                                v-if="props.row?.payment_detail?.paymentStatus === 'paid'">&nbsp;{{
        props.row?.payment_detail?.paymentStatus
    }}</q-badge>
                            <q-badge class="normalcase q-pa-sm q-badge-warning"
                                v-if="props.row?.payment_detail?.paymentStatus === 'pending'">&nbsp;{{
        props.row?.payment_detail?.paymentStatus
    }}</q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                            <q-badge class="normalcase q-pa-sm q-badge-warning" v-if="props.row.status === 'placed'">
                                &nbsp;{{
        props.row.status
    }}</q-badge>
                            <q-badge class="normalcase q-pa-sm q-badge-info" v-if="props.row.status === 'confirmed'">
                                &nbsp;{{
        props.row.status
    }}</q-badge>
                            <q-badge class="normalcase q-pa-sm q-badge-positive"
                                v-if="props.row.status === 'delivered'">
                                &nbsp;{{
        props.row.status
    }}</q-badge>
                            <q-badge class="normalcase q-pa-sm q-badge-negative" v-if="props.row.status === 'rejected'">
                                &nbsp;{{
                                props.row.status
                                }}</q-badge>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-More="props">
                        <q-td :props="props">
                            <NuxtLink :to="routes.view_booking(props.row.id)">
                                <q-btn size="sm" color="primary">Review</q-btn>
                            </NuxtLink>
                        </q-td>
                    </template>
                </q-table>
                <PaginateComponet :page="query.page || 1" :meta="bookings?.meta" @update:model-value="(v) => {
          query.page = v;
          refresh();
        }
        " />
            </ScrollArea>
        </div>
    </NavTabs>
</template>
