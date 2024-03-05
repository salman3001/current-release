<script setup lang="ts">
import { ref, computed } from 'vue'

const columns = [
    {
        name: 'id',
        required: true,
        label: 'Order No.',
        align: 'left',
        field: row => row.id,
        format: val => `${val}`,
        sortable: true
    },
    { name: 'created_at', align: 'center', label: 'Order Date', field: 'created_at', sortable: true },
    { name: 'status', label: 'Status', field: 'status', sortable: true },
    { name: 'More', label: 'More', field: 'More', align: 'center', },
]

const rows = [
    {
        id: '1',
        created_at: '12/8/2030 14:30hrs',
        status: 'placed'
    },
    {
        id: '2',
        created_at: '12/8/2030 14:30hrs',
        status: 'placed'
    },
    {
        id: '3',
        created_at: '12/8/2030 14:30hrs',
        status: 'placed'
    },
    {
        id: '4',
        created_at: '12/8/2030 14:30hrs',
        status: 'placed'
    },
    {
        id: '5',
        created_at: '12/8/2030 14:30hrs',
        status: 'placed'
    },
    {
        id: '6',
        created_at: '12/8/2030 14:30hrs',
        status: 'placed'
    },
    {
        id: '7',
        created_at: '12/8/2030 14:30hrs',
        status: 'placed'
    },
    {
        id: '8',
        created_at: '12/8/2030 14:30hrs',
        status: 'placed'
    },
    {
        id: '9',
        created_at: '12/8/2030 14:30hrs',
        status: 'placed'
    },
    {
        id: '10',
        created_at: '12/8/2030 14:30hrs',
        status: 'placed'
    }
]


const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 3
    // rowsNumber: xx if getting data from a server
})

const pagesNumber = computed(() => Math.ceil(rows.length / pagination.value.rowsPerPage))

</script>

<template>
    <div class="">
        <q-table flat :rows="rows" :columns="columns" row-key="id" v-model:pagination="pagination" hide-pagination
            color="green">
            <template v-slot:body-cell-More="props">
                <q-td :props="props">
                    <NuxtLink :to="routes.view_order(props.row.id)">
                        <q-btn size="sm" color="secondary">View Detail</q-btn>
                    </NuxtLink>
                </q-td>
            </template>
        </q-table>

        <div class="row justify-end q-mt-md">
            <q-pagination v-model="pagination.page" color="secondary" :max="pagesNumber" size="sm" />
        </div>
    </div>
</template>