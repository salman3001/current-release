<script lang="ts" setup>
const leftDrawerOpen = ref(false)

const togetlLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<template>
    <q-layout view="lHh LpR lFf" container class="bg-nutral-dim" :style="{ height: $q.screen.gt.sm ? '90vh' : '85vh' }">
        <q-header bordered class="bg-nutral">
            <q-toolbar flat class="text-nutral q-px-sm q-px-md-lg">
                <q-btn dense flat round icon="menu" @click="togetlLeftDrawer" v-if="$q.screen.lt.lg"></q-btn>
                <q-toolbar-title class="row  gap-50 items-center gap-100">
                    <q-avatar>
                        <img src="/images/sample-dp.png" class="border-primary border-2" />
                    </q-avatar>
                    <span>
                        Salman Khan
                    </span>
                </q-toolbar-title>

            </q-toolbar>
        </q-header>
        <q-drawer bordered show-if-above side="left" v-model="leftDrawerOpen" class="">
            <ScrollArea width="100%" height="100%">
                <q-list padding>
                    <template v-for="i in 10">
                        <q-item clickable v-ripple>
                            <q-item-section class="q-gutter-xs text-muted">
                                <q-item-lebel class="gap-100 row items-center justify-between">
                                    <q-avatar>
                                        <q-img src="/images/sample-dp.png" />
                                    </q-avatar>
                                    <p style="flex-grow: 1;">Single Line</p>
                                    <p>4h Ago</p>
                                </q-item-lebel>
                                <q-item-lebel caption class="text-muted ellipsis-2-lines">Single Line Lorem ipsum dolor
                                    sit
                                    amet. Lorem ipsum
                                    dolor sit amet,
                                    consectetur adipisicing elit. Atque expedita omnis inventore architecto error
                                    doloribus
                                    eaque consequuntur quos officiis iusto.</q-item-lebel>
                            </q-item-section>
                        </q-item>
                        <q-separator />
                    </template>
                </q-list>
            </ScrollArea>
        </q-drawer>
        <q-page-container :style="{ height: $q.screen.gt.sm ? '90vh' : '82vh' }" class="column justify-between">
            <div class="bg-nutral-dim col-10 q-pa-lg column q-pa-md-xl" style="flex-direction: column-reverse;">
                <q-chat-message name="me" :text="['heloow there how are you']" sent />
                <q-chat-message name="me" :text="['heloow there how are you']" sent />
                <q-chat-message name="me" :text="['heloow there how are you']" />
                <q-chat-message name="me" :text="['heloow there how are you']" />
                <q-chat-message name="me" :text="['heloow there how are you']" sent />
            </div>
            <div class="bg-nutral-dim col-2 q-pa-lg q-pa-md-xl">
                <q-input outlined color="primary" class="bg-nutral rounded-borders">

                    <template v-slot:after>
                        <q-btn name="send" color="primary" icon="send" />
                    </template>
                </q-input>

            </div>
        </q-page-container>
    </q-layout>
</template>