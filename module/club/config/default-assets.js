/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

module.exports = {

    build: [{
        Class: 'Packer',
        sources: [
            'src/Club.js',
            'src/Element.js',
            'src/Loadable.js',
            'src/attr/Attr.js',
            'src/attr/RadioList.js',
            'src/form/Form.js',
            'src/page/Page.js',
            'src/play/Play.js',
            'src'
        ],
        target: 'vendor/club.min.js',
        copyright: `/* @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com> */\n`,
        logging: true
    }]
};