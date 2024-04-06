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
    <div class="column gap-50">
      <h6 class="text-bold q-pb-none">Account Information</h6>
      <WebAccountEdit />
    </div>
    <br />
    <q-separator />
    <br />
    <div class="column gap-50">
      <h6 class="text-bold q-pb-none">Profile Information</h6>
      <WebProfileEdit />
    </div>
  </NavTabs>
</template>
