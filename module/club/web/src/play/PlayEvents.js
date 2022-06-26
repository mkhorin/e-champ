/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.PlayEvents = class PlayEvents {

    constructor (params) {
        this.items = [];
        this.timestamp = null;
        this.params = params;
    }

    isEnded () {
        return this.cursor >= this.count() - 1;
    }

    getFirstPreviousIndexByName (index, name) {
        while (this.items[index - 1][0] === name) --index;
        return index;
    }

    isLastName (name) {
        return this.getLastName() === name;
    }

    getLastName () {
        return this.getLast()?.[0];
    }

    getLast () {
        return this.items[this.items.length - 1];
    }

    getLastByName (name) {
        return this.items[this.getLastIndexByName(name)];
    }

    getLastIndexByName (name) {
        for (let i = this.count() - 1; i >= 0; --i) {
            if (this.items[i][0] === name) {
                return i;
            }
        }
    }

    add (items) {
        if (Array.isArray(items) && this.checkStartEvent(items)) {
            this.excludePrediction(items);
            this.items.push(...items);
        }
    }

    checkStartEvent (items) {
        return this.items.length
            || !this.params.startEvent
            || items[0]?.[0] === this.params.startEvent;
    }

    addPrediction (name, data) {
        if (this.prediction) {
            throw new Error('Previous prediction not yet approved');
        }
        this.prediction = [name, data];
        this.items.push(this.prediction);
    }

    excludePrediction (items) {
        const index = this.search(this.prediction, items);
        if (Number.isInteger(index)) {
            items.splice(index, 1, [null]);
            this.prediction = null;
        }
    }

    search (item, items) {
        if (item && Array.isArray(items)) {
            for (let i = 0; i < items.length; ++i) {
                if (this.matchItems(item, items[i])) {
                    return i;
                }
            }
        }
    }

    matchItems (a, b) {
        if (a[0] !== b[0]) {
            return false;
        }
        const event = this.getEventClass(a[0]);
        if (event.matchByData) {
            return event.matchByData(a[1], b[1]);
        }
        return JSON.stringify(a) === JSON.stringify(b);
    }

    count () {
        return this.items.length;
    }

    clear () {
        this.items = [];
        this.reset();
    }

    clearBeforeCursor () {
        if (this.hiddenIndex !== -1) {
            this.hiddenIndex -= this.cursor;
        }
        if (this.stopIndex !== null) {
            this.stopIndex -= this.cursor;
        }
        this.items = this.items.slice(this.cursor);
        this.cursor = 0;
    }

    reset () {
        this.cursor = 0;
        this.hiddenIndex = -1;
        this.stopIndex = null;
        this.runningEvent = null;
        this.prediction = null;
    }

    slice () {
        return this.items.slice(...arguments);
    }

    stop () {
        this.stopIndex = this.cursor - 1;
    }

    continue () {
        this.stopIndex = null;
        this.process();
    }

    process () {
        if (this.runningEvent) {
            return false;
        }
        if (this.stopIndex !== null && this.cursor > this.stopIndex) {
            return false;
        }
        const item = this.items[this.cursor];
        if (!Array.isArray(item)) {
            return false;
        }
        this.resolveHiddenIndex();
        this.runningEvent = this.createEvent(item);
        setTimeout(() => this.runningEvent.process(), 0);
        return true;
    }

    createEvent ([name, data], params) {
        const EventClass = this.getEventClass(name);
        return new EventClass({
            hidden: this.cursor <= this.hiddenIndex,
            data: data,
            play: this.params.play,
            onHandled: this.onHandledEvent.bind(this),
            index: this.cursor,
            ...params
        });
    }

    getEventClass (name) {
        const EventClass = this.params.BaseEvent.getClass(name);
        if (EventClass) {
            return EventClass;
        }
        if (!name) {
            return this.params.BaseEvent;
        }
        throw new Error(`Event not found: ${name}`);
    }

    resolveHiddenIndex () {
        if (document.hidden && this.hiddenIndex < this.cursor  ) {
            this.hiddenIndex = this.count() - 1;
        }
    }

    onHandledEvent (event) {
        if (this.runningEvent !== event) {
            return false;
        }
        this.params.onHandledEvent?.(event);
        if (this.cursor === this.hiddenIndex) {
            this.params.onHandledHiddenEvents?.();
        }
        this.cursor += 1;
        this.runningEvent = null;
        if (!this.process()) {
            this.params.onHandledEvents?.();
        }
    }
};