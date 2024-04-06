<template>
    <br />
    <NavTabs :links="[{
        label: 'Account',
        url: routes.vendor.account
    }, {
        label: 'Settings',
        url: routes.vendor.settings
    }, {
        label: 'Security',
        url: routes.vendor.security
    }]">
        <br>
        <div>
            settings
        </div>

    </NavTabs>

</template>