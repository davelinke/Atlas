
# The Atlas Project
An ES6 vanilla javascript no-code app designer/editor

The creation of a no-code app design/development platform has been one of my favorite exercises since the creation of [Pinocchio](https://pinocchio.us/) in 2016.

That first version of this idea was created in AngularJS, which led to performance issues.

From there on, I have tried as many frameworks as you can imagine in order to modernize the code. Angular, React/Redux, StencilJS, etc.

This latest iteration makes use of contemporary ESM modules to fulfill the goal of creating a project that will be fully maintainable and not dependent of complex frameworks that make it a whole lot harder to keep the application tidy and secure.

Although you end up creating a bit of a framework yourself while doing this, it provides many advantages, being the most important one independence and slim codebase.

The architecture of this project relies on modularized web components, simple native event bubbling and handshake patterns that allow new modules to have visibility of the whole and shared state. This means it's fully decoupled. you remove a feature and everything else keeps on working fine and dandy.

There's a long road ahead in terms of completing this project, as well as documenting it properly. Should you want to collaborate jut let me know!
