/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.GatheringForm = class GatheringForm extends Club.Form {

    setData (data) {
        const game = this.club.getGameData(data.name);
        this.find('[data-name="room"]').html(data.room);
        this.find('[data-name="game"]').html(Jam.t(data.label, game.name));
        this.find('[data-name="public"]').html(Jam.t(data.public));
        const items = data.players.map(this.renderPlayer.bind(this, game));
        Jam.t(this.find('.gathering-opponents').html(items.join('')));
        this.$optionGroup.html(this.renderOptions({
            data: data.options,
            name: game.name,
            attrs: game.optionAttrs,
            template: 'static'
        }));
    }

    renderPlayer (game, data, index) {
        data.number = index + 1;
        data.status = data.ready ? 'ready' : 'free';
        data.name = this.club.resolvePlayerName(data, game);
        return this.resolveTemplate('player', data);
    }
};