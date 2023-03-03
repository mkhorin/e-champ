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
        const element = this.cards?.get(0).element;
        this.cardWidth = element?.offsetWidth;
        this.cardHeight = element?.offsetHeight;
    }

    createCards (total) {
        this.clearCards();
        this.cards = this.createCardList();
        for (let i = 0; i < total; ++i) {
            let card = new Club.Card(this.$container);
            this.cards.add(card);
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

    moveCard (card, offset, duration, delay) {
        const data = {
            element: card.element,
            target: offset,
            delay: this.motion.count() * (delay || Club.Card.MOVE_DELAY),
            duration: duration || Club.Card.MOVE_DURATION
        };
        return this.motion.move(data);
    }

    setDeckSkin () {
        const language = Jam.i18n.getLanguage();
        const skin = this.getDeckSkinByLanguage(language);
        this.setDataAttr('deck', skin);
    }

    getDeckSkinByLanguage (language) {
        switch (language) {
            case 'ru': {
                return 'slavic';
            }
        }
        return 'german';
    }
};