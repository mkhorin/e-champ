/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/scheduler/Job');

module.exports = class DeleteExpiredRooms extends Base {

    constructor (config) {
        super({
            lastEventDuration: 'PT30M',
            ...config
        });
    }

    async execute () {
        await this.deleteRooms();
    }

    async deleteRooms (comparison) {
        const arena = this.module.getArena();
        const minDate = this.getEarliestValidDate(this.lastEventDuration);
        for (const room of arena.rooms) {
            const date = room.play?.events.getLastTimestamp() || room.createdAt;
            if (date < minDate) {
                await room.remove();
                this.log('info', `Room removed: ${room.id}`);
            }
        }
    }

    getEarliestValidDate (duration) {
        return new Date(Date.now() - DateHelper.parseDuration(duration));
    }
};

const DateHelper = require('areto/helper/DateHelper');