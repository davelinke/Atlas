export async function LoadParticles(particles) {
    // 
    let skeletonCss = '';
    const moduleCalls = [];

    particles.forEach(async (particle) => {
        // skeletonCss += `${particle}:not(:defined){display:inline-block;background-color:#e0e0e0; color:transparent;};`
        moduleCalls.push(import(`./${particle}.js`));
    });

    // const style = document.createElement('style');
    // style.textContent = skeletonCss;
    // document.querySelector('head').appendChild(style);

    const loadedModules = await Promise.all(moduleCalls);

    particles.forEach((particle, i) => {
        const loadedModule = loadedModules[i];
        customElements.define(particle, loadedModule.default);
    });
}

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