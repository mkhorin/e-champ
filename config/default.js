/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

module.exports = {

    title: 'E-Champ',

    components: {
        'db': {
            settings: {
                'database': process.env.MONGO_NAME || 'e-champ',
            }
        },
        'cookie': {
            secret: 'e-champ.sign' // key to sign cookie
        },
        'session': {
            secret: 'e-champ.sign'  // key to sign session ID cookie
        },
        'i18n': {
            language: 'en'
        },
        'router': {
            defaultModule: 'club'
        },
        'arena': {
            Class: require('../arena/Arena'),
            socketPath: '/arena',
            socket: {
                Class: require('../arena/Socket')
            }
        }
    },
    modules: {
        'account': {
            Class: require('evado-module-account/Module')
        },
        'admin': {
            Class: require('../module/admin/Module')
        },
        'club': {
            Class: require('../module/club/Module')
        }
    },
    assets: require('./default-assets'),
    classes: require('./default-classes'),
    security: require('./default-security'),
    tasks: require('./default-tasks'),
    sideMenu: require('./default-sideMenu'),
    widgets: require('./default-widgets'),
    params: {
        'enablePasswordChange': true,
        'enablePasswordReset': false,
        'enableSignUp': false,
        'enableSignUpVerification': false,
        'languageToggle': true
    }
};