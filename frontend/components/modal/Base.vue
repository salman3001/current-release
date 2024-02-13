<script setup lang="ts">

const modal = modalStore();
</script>

<template>
  <q-dialog v-model="modal.show">
    <ModalChangeRole v-if="modal.content === 'changeRole'" />
    <ModalBanAdminUser v-if="modal.content === 'changeAdminStatus'" />
    <ModalDeleteRecord v-if="modal.content === 'deleteRecord'" />
    <ModalAddressContinentAdd v-if="modal.content === 'addContinent'" />
    <ModalAddressContinentEdit v-if="modal.content === 'editContinent'" />
    <ModalAddressCountryAdd v-if="modal.content === 'addCountry'" />
    <ModalAddressCountryEdit v-if="modal.content === 'editCountry'" />
    <ModalAddressStateAdd v-if="modal.content === 'addState'" />
    <ModalAddressStateEdit v-if="modal.content === 'editState'" />
    <ModalAddressCityEdit v-if="modal.content === 'editCity'" />
    <ModalAddressCityAdd v-if="modal.content === 'addCity'" />
    <ModalAddressStreetAdd v-if="modal.content === 'addStreet'" />
    <ModalAddressStreetEdit v-if="modal.content === 'editStreet'" />
    <ModalAddRole v-if="modal.content === 'addRole'" />
    <ModalBanUser v-if="modal.content === 'changeUserStatus'" />
    <ModalDeleteNotification v-if="modal.content === 'deleteNotification'" />
    <ModalChangeSupportTicketStatus v-if="modal.content === 'changeSupportTicketStatus'" />
    <!-- <ModalContactMessage v-if="modal.content === 'contactMessage'" />
    <ModalAddressContinentAdd v-if="modal.content === 'addContinent'" />
    <ModalAddressContinentEdit v-if="modal.content === 'editContinent'" />
    <ModalAddressCountryAdd v-if="modal.content === 'addCountry'" />
    <ModalAddressCountryEdit v-if="modal.content === 'editCountry'" /> -->
  </q-dialog>
</template>
