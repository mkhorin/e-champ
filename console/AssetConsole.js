/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/console/AssetConsole');

module.exports = class AssetConsole extends Base {

    async install () {
        await this.handleGames(this.installGame.bind(this));
        await super.install();
    }

    async build () {
        await this.handleGames(this.buildGame.bind(this));
        await super.build();
    }

    async deploy () {
        await this.handleGames(this.deployGame.bind(this));
        await super.deploy();
    }

    async installGame (game) {
        await this.installItem(game);
        for (const bot of game.bots) {
            await this.installItem(bot);
        }
    }

    async installItem (item) {
        const executor = this.createAssetExecutor(this.assetInstaller);
        const dir = item.getPath(executor.getVendorDir());
        await executor.installVendors(dir);
    }

    async buildGame (game) {
        await this.buildItem(game, 'Building game assets');
        for (const bot of game.bots) {
            await this.buildItem(bot, 'Building bot assets');
        }
    }

    async buildItem (item, message) {
        if (item.assets?.build) {
            const root = item.getPath();
            this.log('info', `${message}: ${item.name}: ${root}`);
            const executor = this.createAssetExecutor(this.assetBuilder);
            await executor.buildAssets(item.assets.build, root);
        }
    }

    async deployGame (game) {
        await this.deployItem(game, 'Deploying game assets');
        for (const bot of game.bots) {
            await this.deployItem(bot, 'Deploying bot assets');
        }
    }

    async deployItem (item, message) {
        if (item.assets?.deploy) {
            const root = item.getPath();
            this.log('info', `${message}: ${item.name}: ${root}`);
            const executor = this.createAssetExecutor(this.assetDeployer);
            await executor.deployAssets(item.assets.deploy, root);
        }
    }

    async handleGames (handler) {
        const arena = this.app.getArena();
        for (const game of arena.games) {
            await handler(game);
        }
    }
};