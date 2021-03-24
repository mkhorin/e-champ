/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.FormRadioList = class FormRadioList extends Club.FormAttr {

    init () {
        super.init();
        this.$list = this.find('.form-check-list');
        this.$list.on('change', 'input', this.onChange.bind(this));
        this.refreshValue();
    }

    onChange (event) {
        this.$list.find('input').not(event.target).prop('checked', false);
        this.refreshValue();
    }

    refreshValue () {
        this.setValue(this.$list.find(':checked').val());
        //this.trigger('change');
    }
};