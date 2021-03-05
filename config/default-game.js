/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

module.exports = {

    players: {
        'bot': {
            Class: require('../arena/BotPlayer')
        },
        'remote': {
            Class: require('../arena/RemotePlayer')
        }
    }
};