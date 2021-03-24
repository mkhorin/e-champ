/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.FormDescription = class FormDescription extends Club.FormAttr {

    init () {
        super.init();
        this.form.getAttr('game').on('change', this.onChangeGame.bind(this));
        this.onChangeGame();
    }

    onChangeGame () {
        const data = this.club.getGameData(this.form.getValue('game'));
        const url = data?.webPage;
        this.find('a').attr('href', url).html(url);
        this.toggleClass('hidden', !url);
    }
};