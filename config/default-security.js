/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const parent = require('evado/config/default-security');

module.exports = {

    permissions: {
        ...parent.permissions,

        'moduleAdmin': {
            label: 'Administration module',
            description: 'Access to the Administration module'
        }
    },

    roles: {
        'administrator': {
            label: 'Administrator',
            description: 'Full access to system',
            children: [
                'moduleAdmin'
            ]
        },
        'guest': {
            label: 'Guest',
            description: 'Auto-assigned role for anonymous users'
        },
        'user': {
            label: 'User',
            description: 'Default role for authenticated users'
        }
    },

    rules: {
    },

    // rules to auto-bind users to roles
    assignmentRules: {        
    }
};