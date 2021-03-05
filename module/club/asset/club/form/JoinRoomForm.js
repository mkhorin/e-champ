/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.JoinRoomForm = class JoinRoomForm extends Club.Form {

    loadRooms () {
        if (this.checkForAnyGame()) {
            this.getAttrHandler('rooms').refresh();
        }
    }
};