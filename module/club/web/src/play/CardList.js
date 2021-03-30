/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.CardList = class CardList {

    constructor (params = {}) {
        if (params.getCardWidth) {
            this.getCardWidth = params.getCardWidth;
        }
        if (params.getMaxCardSpace) {
            this.getMaxCardSpace = params.getMaxCardSpace;
        }
        this.$listener = params.$listener;
        this.items = [];
    }

    isEmpty () {
        return !this.items.length;
    }

    has (card) {
        return this.items.includes(card);
    }

    get (index) {
        return this.items[index];
    }

    find (rank, suit) {
        for (const item of this.items) {
            if (item.getRank() === rank && item.getSuit() === suit) {
                return item;
            }
        }
    }

    last () {
        return this.items[this.items.length - 1];
    }

    forEach () {
        return this.items.forEach(...arguments);
    }

    clear () {
        this.items = [];
        this.trigger('change');
    }

    count () {
        return this.items.length;
    }

    add (data) {
        if (data instanceof this.constructor) {
            data = data.items;
        }
        Array.isArray(data)
            ? this.items.push(...data)
            : this.items.push(data);
        this.trigger('change');
    }

    close () {
        this.forEach(card => card.close());
    }

    pop () {
        return this.splice(1)[0];
    }

    splice (count) {
        const items = this.items.splice(-count, count);
        this.trigger('change');
        return items;
    }

    remove (card) {
        const index = this.items.indexOf(card);
        const item = index !== -1 ? this.items.splice(index, 1)[0] : null;
        this.trigger('change');
        return item;
    }

    arrange (addition = 0) {
        const [dx, dy] = this.getSteps(this.count() + addition);
        for (let i = 0; i < this.items.length; ++i) {
            this.items[i].setOffset(this.x + dx * i, this.y + dy * i);
        }
        this.setOrder();
    }

    setOrder () {
        for (let i = 1; i < this.items.length; ++i) {
            this.items[i - 1].after(this.items[i]);
        }
    }

    setCardOrder (card, previous) {
        const index = this.items.indexOf(card);
        if (index > 0) {
            previous = this.items[index - 1];
        }
        if (card && previous) {
            previous.after(card);
        }
    }

    setOffset (x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
    }

    getCardWidth () {
        return 84;
    }

    getMaxCardSpace () {
        return 6;
    }

    getSteps (total) {
        const cardWidth = this.getCardWidth();
        const space = this.getMaxCardSpace();
        const dx = Club.getOffsetStep(this.width, cardWidth, total, space);
        return [dx < 2 ? 0 : dx, 0];
    }

    getCardOffset (card) {
        const [dx, dy] = this.getSteps(this.count());
        const index = this.items.indexOf(card);
        return [this.x + dx * index, this.y + dy * index];
    }

    trigger (name, data) {
        if (this.$listener) {
            this.$listener.trigger(`cards:${name}`, data);
        }
    }
};