// require the module as normal
var bs = require("browser-sync").create();

// .init starts the server
bs.init({
    watch: true,
    server: "./src",
});