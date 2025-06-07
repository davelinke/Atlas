export async function LoadParticles (particles) {
  //
//   const skeletonCss = ''
  const moduleCalls = []
  const missingModules = []

  particles.forEach(async (particle) => {
    // skeletonCss += `${particle}:not(:defined){display:inline-block;background-color:#e0e0e0; color:transparent;};`
    // const customElement = customElements.get(particle)
    if (!customElements.get(particle)) {
      moduleCalls.push(import(`./${particle}.js`))
      missingModules.push(particle)
    }
  })

  // const style = document.createElement('style');
  // style.textContent = skeletonCss;
  // document.querySelector('head').appendChild(style);

  const loadedModules = await Promise.all(moduleCalls)
  missingModules.forEach((particle, i) => {
    // const customElement = customElements.get(particle)

    if (!customElements.get(particle)) {
      const loadedModule = loadedModules[i]
      customElements.define(particle, loadedModule.default)
    }
  })
}
