/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.Meta = class Meta {

    constructor (club) {
        this.club = club;
        this._classMap = {};
    }

    getClass (name) {
        return this._classMap.hasOwnProperty(name)
            ? $.Deferred().resolve(this._classMap[name])
            : this.load('class', {class: name}).done(data => this._classMap[name] = data);
    }

    getUrl (key) {
        return this.club.getData('meta-'+ key);
    }

    load (key, data) {
        const url = this.getUrl(key);
        return $.post(url, data).fail(this.onFail.bind(this));
    }

    onFail () {
    }

    getElementGroup (groupName, data) {
        this.prepareClassElements(data);
        if (Array.isArray(data.groups)) {
            for (const group of data.groups) {
                if (group.name === groupName) {
                    return group;
                }
            }
        }
    }

    prepareClassElements (data) {
        if (data._elements) {
            return;
        }
        const groupMap = Jam.ArrayHelper.index('name', data.groups);
        data._elements = [];
        for (const group of Object.values(groupMap)) {
            group._group = true;
            groupMap.hasOwnProperty(group.parent)
                ? Jam.ObjectHelper.push(group, '_elements', groupMap[group.parent])
                : data._elements.push(group);
        }
        for (const attr of data.attrs) {
            groupMap.hasOwnProperty(attr.group)
                ? Jam.ObjectHelper.push(attr, '_elements', groupMap[attr.group])
                : data._elements.push(attr);
        }
        const comparator = (a, b) => a.orderNumber - b.orderNumber;
        for (const group of Object.values(groupMap)) {
            if (group._elements) {
                data._elements.sort(comparator);
            }
        }
        data._elements.sort(comparator);
    }

    getStateTitle (stateName, className) {
        if (!this._classMap.hasOwnProperty(className)) {
            return stateName;
        }
        const states = this._classMap[className].states;
        const index = Jam.ArrayHelper.searchByNestedValue(stateName, 'name', states);
        return index === -1 ? stateName : states[index].label;
    }

    formatAsEnum (value, {enums}, ...args) {
        const items = enums?.[0]?.items || [];
        for (const item of items) {
            if (item.value === value) {
                return Jam.t(item.text, ...args);
            }
        }
        return value;
    }
};