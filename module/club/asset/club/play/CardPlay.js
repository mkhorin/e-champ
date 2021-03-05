/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.CardPlay = class CardPlay extends Club.Play {

    constructor () {
        super(...arguments);
        this.setDeckSkin();
    }

    getCardWidth () {
        return this.cardWidth;
    }

    getCardHeight () {
        return this.cardHeight;
    }

    setCardSize () {
        this.cardWidth = this.cards?.get(0).element.offsetWidth;
        this.cardHeight = this.cards?.get(0).element.offsetHeight;
    }

    createCards (total) {
        this.clearCards();
        this.cards = this.createCardList();
        for (let i = 0; i < total; ++i) {
            this.cards.add(new Club.Card(this.$container));
        }
    }

    createCardList (params) {
        return new Club.CardList({
            getCardWidth: this.getCardWidth.bind(this),
            ...params
        });
    }

    clearCards () {
        this.find('.card').remove();
    }

    moveCard (card, offset, duration = Club.Card.MOVE_DURATION, delay = Club.Card.MOVE_DELAY) {
        return this.motion.move({
            element: card.element,
            target: offset,
            delay: this.motion.count() * delay,
            duration
        });
    }

    setDeckSkin () {
        this.setDataAttr('deck', Jam.i18n.getLanguage() === 'ru' ? 'slavic': 'german');
    }
};