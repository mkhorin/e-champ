/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const defaults = require('evado/config/default-tasks');

module.exports = {

    ...defaults,

    'deleteExpiredRooms': {
        description: 'Delete expired rooms',
        job: {
            Class: 'component/job/DeleteExpiredRooms'
        },
        period: 'PT30M',
        active: true
    }
};