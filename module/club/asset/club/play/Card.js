/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.Card = class Card {

    static MOVE_DELAY = .3;
    static MOVE_DURATION = .5;

    constructor ($container) {
        this.element = document.createElement('div');
        this.element.classList.add('card');
        $container?.append(this.element);
        $(this.element).data('card', this);
    }

    getData () {
        return {
            rank: this.getRank(),
            suit: this.getSuit()
        };
    }

    getRank () {
        return parseInt(this.element.getAttribute('data-rank'));
    }

    getSuit () {
        return this.element.getAttribute('data-suit');
    }

    open (rank, suit) {
        this.element.setAttribute('data-rank', rank);
        this.element.setAttribute('data-suit', suit);
    }

    close () {
        this.element.removeAttribute('data-rank');
        this.element.removeAttribute('data-suit');
    }

    getOffset (dx = 0, dy = 0) {
        return [this.element.offsetLeft + dx, this.element.offsetTop + dy];
    }

    setOffset (x, y) {
        Club.setElementOffset(x, y, this.element);
    }

    changeOffset () {
        this.setOffset(...this.getOffset(...arguments));
    }

    toggleClass () {
        this.element.classList.toggle(...arguments);
    }

    after (card) {
        this.element.after(card.element);
    }
};