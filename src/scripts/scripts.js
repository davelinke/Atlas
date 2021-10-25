import { LoadParticles } from "./lib-loader.js";

(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const elements = document.querySelector('body').querySelectorAll('*');
        const cutomElements = Array.from(elements).filter(element => element.tagName.indexOf('-') > -1);
        let customElementTags = cutomElements.map(element => element.tagName.toLowerCase());
        customElementTags = customElementTags.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
        LoadParticles(customElementTags);
    });
})();