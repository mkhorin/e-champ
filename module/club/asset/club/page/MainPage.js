/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.MainPage = class MainPage extends Club.Page {

    init () {
        super.init();
        this.getCommand('create').click(this.onCreate.bind(this));
        this.getCommand('join').click(this.onJoin.bind(this));
        this.getCommand('play').click(this.onPlay.bind(this));
        this.getCommand('playback').click(this.onPlayback.bind(this));
        this.$playFile = this.find('.play-file');
        this.$playFile.change(this.onChangePlayFile.bind(this));
        this.playFileReader = new FileReader;
        this.playFileReader.addEventListener('load', this.onLoadPlayFile.bind(this));
    }

    onCreate () {
        this.club.showPage('new');
    }

    onJoin () {
        this.club.showPage('join');
    }

    onPlay () {
        this.club.showPage('gathering');
    }

    onPlayback () {
        Jam.Helper.resetFormElement(this.$playFile);
        this.$playFile.click();
    }

    onChangePlayFile () {
        this.playFile = this.$playFile.get(0).files[0];
        this.playFileReader.readAsText(this.playFile);
    }

    onLoadPlayFile () {
        const data = Jam.Helper.parseJson(this.playFileReader.result);
        if (!data) {
            return Jam.dialog.error('Invalid JSON data');
        }
        const game = this.club.getGameData(data.game);
        if (!game) {
            return Jam.dialog.error(`Game not found: ${data.game}`);
        }
        const file = this.playFile;
        this.club.showPage('playback', {data, file});
    }
};