/**
 * @name SpotifyListenAlong
 * @description Enables Spotify Listen Along feature on Discord without Premium
 * @version 1.1.2
 * @author ordinall
 * @authorId 374663636347650049
 * @website https://github.com/ordinall/BetterDiscord-Stuff/tree/master/Plugins/SpotifyListenAlong/
 * @source https://raw.githubusercontent.com/ordinall/BetterDiscord-Stuff/master/Plugins/SpotifyListenAlong/SpotifyListenAlong.plugin.js
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/
const config = {
    changelog: [
        {
            title: "v1.1.2",
            type: "fixed",
            items: [
                "fixed"
            ]
        }
    ]
};


const { Webpack, Patcher, Data, UI } = BdApi;
const SpotifyStore = BdApi.Webpack.getStore("SpotifyStore");

module.exports = class SpotifyListenAlong {
    constructor(meta) {
        this.meta = meta;
    }
    showChangelog() {
        const savedVersion = Data.load(this.meta.name, "version");
        if (savedVersion !== this.meta.version && config.changelog.length > 0) {
            UI.showChangelogModal({
                title: this.meta.name,
                subtitle: this.meta.version,
                changes: config.changelog
            });
            Data.save(this.meta.name, "version", this.meta.version);
        }
    }

    start() {
        this.showChangelog();
        console.log(SpotifyStore);
        if (SpotifyStore && SpotifyStore.__proto__) {
            console.log("Found on prototype:", SpotifyStore.__proto__);

            Patcher.after(
                "SpotifyListenAlong",
                SpotifyStore.__proto__,
                "getActiveSocketAndDevice",
                (_, args, ret) => {
                    if (ret?.socket) ret.socket.isPremium = true;
                    return ret;
                }
            );
        }
    }

    stop() {
        Patcher.unpatchAll(this.meta.name)
    }

};
/*@end@*/
