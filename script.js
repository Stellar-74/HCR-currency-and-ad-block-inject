Java.perform(function () {
    console.log("[*] Injecting Definitive Cross-Layer Bypass & Economy Engine...");

    var MainActivity = Java.use("com.fingersoft.game.MainActivity");
    var Cocos2dxUserDefault = Java.use("org.cocos2dx.lib.Cocos2dxUserDefault");

//Ad Block
    try {
        var Class = Java.use("java.lang.Class");
        Class.forName.overload('java.lang.String', 'boolean', 'java.lang.ClassLoader').implementation = function (name, initialize, loader) {
            if (name !== null && (name.indexOf("ads.mobile.sdk") !== -1 || name.indexOf("gms.ads") !== -1)) {
                console.log("[+] Prevented initialization of Ad Infrastructure: " + name);
                var ClassNotFoundException = Java.use("java.lang.ClassNotFoundException");
                throw ClassNotFoundException.$new(name);
            }
            return this.forName(name, initialize, loader);
        };
    } catch (e) {
        console.log("[-] Class Introspection protection fallback invoked.");
    }

//Currency Inject

    Cocos2dxUserDefault.getIntegerForKey.overload('java.lang.String', 'int').implementation = function (key, defaultValue) {
        var val = this.getIntegerForKey(key, defaultValue);

        if (key === "coins" || key.indexOf("coins") !== -1) {
            console.log("[+] Intercepted Coin Request (" + key + ") -> Forcing 999,999,999");
            return 999999999;
        }
        if (key === "gems" || key === "diamonds" || key.indexOf("gem") !== -1 || key.indexOf("diamond") !== -1) {
            console.log("[+] Intercepted Gem Request (" + key + ") -> Forcing 999,999");
            return 999999;
        }
        return val;
    };
});

