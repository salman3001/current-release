<script setup lang="ts">
import { ref } from 'vue';


const text = ref('')
const expand = ref(false)

</script>

<template>
    <q-input type="text" outlined rounded :dense="$q.screen.lt.md" v-model="text" placeholder="Search Services"
        :debounce="500" :style="{ minWidth: $q.screen.lt.sm ? '300px' : '500px' }" class="input-shadow"
        @update:model-value="(val) => {
        $emit('search', val)
    }" @focus="expand = true" @blur="expand = false">
        <template v-slot:append>
            <q-btn rounded color="primary" :size="$q.screen.lt.md ? 'sm' : 'md'">
                <q-icon name="search" @click="() => { text = ''; $emit('search', '') }" />
                <span v-if="expand">Search </span>
            </q-btn>
        </template>

        <template v-slot:after>
            <q-btn icon="tune" rounded></q-btn>
        </template>
    </q-input>
</template>
