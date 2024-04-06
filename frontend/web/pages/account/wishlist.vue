<script setup lang="ts">

const wishlist = wishlistStore()

const { data, pending } = useAsyncData(() => wishlist.fetchDetailedWishlist())

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
        <br>
        <div class="row q-col-gutter-lg">
            <div v-if="pending" v-for="s in 10" class="col-12 col-sm-6 col-md-4 col-lg-3">
                <SkeletonBase type="card" />
            </div>
            <div v-else v-for="s in data?.items" class="col-12 col-sm-6 col-md-4 col-lg-3">
                <WebServiceCard :service="s" />
            </div>
        </div>
    </NavTabs>
</template>