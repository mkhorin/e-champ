/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

module.exports = {

    build: [{
        Class: 'FileMerger',
        sources: [
            'club/Club.js',
            'club/Element.js',
            'club/Loadable.js',
            'club/attr/Attr.js',
            'club/attr/RadioList.js',
            'club/form/Form.js',
            'club/page/Page.js',
            'club/play/Play.js',
            'club'
        ],
        target: 'dist/club.min.js',
        copyright: `/* @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com> */\n`,
        logging: true,
        shrinking: false
    }],

    deploy: {
        'vendor': 'dist/club.min.js'
    }
};