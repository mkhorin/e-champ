/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const defaults = require('evado/config/default-widgets');

module.exports = {

    ...defaults,

    'commonMenu': {
        app: {
            hidden: true
        },
        modules: {
            'club': {
                separated: true
            }
        }
    }
};