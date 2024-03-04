<script setup lang="ts">
import { ref } from 'vue'


const tab = ref('Requirement detail')


</script>

<template>

    <div class="q-pa-md q-pa-md-lg q-pa-lg-xl ">
        <NuxtLink :to="routes.account + '?tab=Custom Orders'">
            <q-icon name="keyboard_backspace" size="30px"></q-icon> Go Back
        </NuxtLink>
        <h2 class="text-h5 text-bold q-sm">Custom Order Detail</h2>
        <h2 class="text-h6 text-bold q-sm">Order #1234</h2>
        <div class="q-col-gutter-y-md">

            <div>
                <p class="text-bold">Address</p>
                <p>Lorem ipsum dolor sit amet.</p>
            </div>
            <div>
                <p class="text-bold">Date and time</p>
                <p>12/03/2024 03:13pm</p>
            </div>
            <div class="row q-gutter-md">
                <p class="text-bold">Order Status</p>
                <q-badge color="yellow-10">Placed</q-badge>
            </div>
            <div class="row q-gutter-sm">
                <NuxtLink to="/"> <q-icon name="download"></q-icon> Download Invoice</NuxtLink>
            </div>
            <div class="q-mt-md">
                <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align=""
                    narrow-indicator>
                    <q-tab name="Requirement detail" label="Requirement detail" class="q-pl-none" />
                    <q-tab name="Accepted Bid" label="Accepted Bid" class="q-pl-none" />
                    <q-tab name="Payment Detail" label="Payment Detail" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tab" animated>
                    <q-tab-panel name="Requirement detail">
                        <div class="q-col-gutter-y-md">
                            <div>
                                <p class="text-bold">Category</p>
                                <p>Cleaning Services</p>
                            </div>
                            <div>
                                <p class="text-bold">Title</p>
                                <p>Lorem ipsum dolor sit amet.</p>
                            </div>
                            <div>
                                <p class="text-bold">Description</p>
                                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium, incidunt.</p>
                            </div>
                            <div>
                                <p class="text-bold">Budget Type</p>
                                <p>Hourly</p>
                            </div>
                            <div>
                                <p class="text-bold">Budget</p>
                                <p class="text-bold">&#x20B9;200</p>
                            </div>
                            <div class="column q-gutter-md">
                                <p class="text-bold">Skills Required</p>
                                <ul>
                                    <li v-for="n, i in 5">skill {{ i + 1 }}</li>
                                </ul>
                            </div>
                        </div>
                    </q-tab-panel>

                    <q-tab-panel name="Accepted Bid">
                        <div class="q-col-gutter-y-md">
                            <div>
                                <p class="text-bold">Vendor Name</p>
                                <p>Jacky chain</p>
                            </div>
                            <div>
                                <p class="text-bold">Business Name</p>
                                <NuxtLink to="/">Best Cleaining services LLC</NuxtLink>
                            </div>
                            <div>
                                <p class="text-bold">Offered Price</p>
                                <p class="text-bold">&#x20B9;220</p>
                            </div>
                            <div class="column q-gutter-md">
                                <p class="text-bold">What is included</p>
                                <ul>
                                    <li v-for="n, i in 5">Included {{ i + 1 }}</li>
                                </ul>
                            </div>

                            <div class="column q-gutter-md">
                                <p class="text-bold">What is excluded</p>
                                <ul>
                                    <li v-for="n, i in 5">Excluded {{ i + 1 }}</li>
                                </ul>
                            </div>
                        </div>
                    </q-tab-panel>

                    <q-tab-panel name="Payment Detail">
                        <div class="text-h6">Payment Detail</div>
                        pay
                    </q-tab-panel>
                </q-tab-panels>
            </div>
        </div>

    </div>
</template>