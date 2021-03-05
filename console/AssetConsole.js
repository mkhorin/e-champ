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
        const executor = this.createAssetExecutor(this.assetInstaller);
        const dir = game.getPath(executor.getVendorDir());
        await executor.installVendors(dir);
    }

    async buildGame (game) {
        const data = game.assets?.build;
        if (data) {
            this.log('info', `Building game assets: ${game.name}`);
            const executor = this.createAssetExecutor(this.assetBuilder);
            await executor.buildAssets(data, game.getPath());
        }
    }

    async deployGame (game) {
        const data = game.assets?.deploy;
        if (data) {
            this.log('info', `Deploying game assets: ${game.name}`);
            const executor = this.createAssetExecutor(this.assetDeployer);
            await executor.deployAssets(data, game.getPath());
        }
    }

    async handleGames (handler) {
        const arena = this.app.getArena();
        for (const game of arena.games) {
            await handler(game);
        }
    }
};