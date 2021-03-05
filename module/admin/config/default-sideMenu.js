/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

module.exports = {

    items: [{
        url: 'admin/room',
        label: 'Rooms'
    },{
        url: 'admin/game',
        label: 'Games'
    }, {
        type: 'divider'
    }, {
        url: 'admin/user',
        label: 'Users'
    }, {
        label: 'Security',
        children: [{
            url: 'admin/rbac/item/permissions',
            label: 'Permissions'
        }, {
            url: 'admin/rbac/item/roles',
            label: 'Roles'
        }, {
            url: 'admin/rbac/assignment-rule',
            label: 'Assignment rules'
        }, {
            url: 'admin/rbac/rule',
            label: 'Rules'
        }]
    }, {
        label: 'Informing',
        children: [{
            url: 'admin/notification',
            label: 'Notifications'
        }, {
            url: 'admin/notification-message',
            label: 'Messages'
        }, {
            url: 'admin/popup-notification',
            label: 'Popup notifications'
        }, {
            url: 'admin/user-filter',
            label: 'User filters'
        }]
    }, {
        label: 'Events',
        children: [{
            url: 'admin/listener',
            label: 'Listeners'
        }, {
            url: 'admin/event-handler',
            label: 'Event handlers'
        }]
    }, {
        url: 'admin/task',
        label: 'Tasks'
    }, {
        url: 'admin/table',
        label: 'Database'
    }, {
        url: 'admin/log',
        label: 'Logs'
    }]
};