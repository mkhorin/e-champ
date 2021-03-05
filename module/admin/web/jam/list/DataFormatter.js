/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

Jam.ListDataFormatter = class ListDataFormatter extends Jam.ListDataFormatter {

    asTranslationByData (value, params, data) {
        return this.escape(Jam.t(value, data[params.format.key]), params);
    }
};

Object.assign(Jam.ListDataFormatter.METHODS, {
    translationByData: 'asTranslationByData'
});