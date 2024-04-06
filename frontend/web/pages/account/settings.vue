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
        <br>
        <div>
            settings
        </div>
    </NavTabs>
</template>