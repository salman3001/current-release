<script setup lang="ts">
import { ref } from 'vue'

const query = useRoute().query

const tab = ref('Profile')

watch(query, (newVal) => {
    if (query.tab) {
        tab.value = query.tab as string
    }
}, { deep: true, immediate: true })


</script>

<template>
    <div>
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align=""
            narrow-indicator>
            <q-tab name="Profile" label="Profile" />
            <q-tab name="Orders" label="Orders" />
            <q-tab name="Custom Orders" label="Custom Orders" />
            <q-tab name="Settings" label="Settings" />
            <q-tab name="Security" label="Security" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="Profile">
                <div class="text-h6">Profile</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>

            <q-tab-panel name="Orders">
                <div class="text-h6">Orders</div>
                <WebOrdersList />
            </q-tab-panel>

            <q-tab-panel name="Custom Orders">
                <div class="text-h6">Custom Orders</div>
                <WebCustomOrderList />
            </q-tab-panel>

            <q-tab-panel name="Settings">
                <div class="text-h6">Settings</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>

            <q-tab-panel name="Security">
                <div class="text-h6">Security</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>