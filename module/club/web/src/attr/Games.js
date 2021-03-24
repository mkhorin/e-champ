/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.FormGames = class FormGames extends Club.FormRadioList {

    init () {
        super.init();
        this.renderItems();
        this.$list.find('input').first().click();
    }

    renderItems () {
        const items = this.club.games.map(({name, label}) => {
            label = Jam.t(label, name);
            return this.resolveTemplate('game', {name, label})
        });
        this.find('.form-game-list').append(items.join(''));
    }
};