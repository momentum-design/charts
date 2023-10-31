# @momentum-design/widgets

A PURE UI library based on web components and chart.js that is for building dashboards
which can be used in any front-end framework.

- [API](https://momentum-design.github.io/momentum-widgets/docs/api/)
- [Tutorials](https://momentum-design.github.io/momentum-widgets/docs/tutorials/getting-started)
- [Changelog](https://momentum-design.github.io/momentum-widgets/blog)

All examples in website are using the JSX and online code editor to render widgets in real time.

## Installation

### umd

The UMD build is also available on unpkg.com:

```html
<link rel="stylesheet" href="https://unpkg.com/@momentum-design/widgets/dist/widgets.css">
<script src="https://unpkg.com/@momentum-design/widgets/dist/widgets.umd.js"></script>
```

Then you can find the library on `window.mdw`.

### npm

NPM is the easiest and fastest way to get started using this library. It is also the recommended installation method when building single-page applications (SPAs). It pairs nicely with a CommonJS module bundler such as Webpack.

```bash
# latest stable
$ npm i @momentum-design/widgets
```

### Use with Angular

1. Import library and enable web component support in **src/app/app.module.ts**.

    ```diff
    import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    +import '@momentum-design/widgets';

    import { AppComponent } from './app.component';

    @NgModule({
      declarations: [
        AppComponent,
      ],
      imports: [
        BrowserModule
      ],
      providers: [],
      bootstrap: [AppComponent],
    +  schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    export class AppModule { }
    ```

1. Use the components in your HTML template.

    ```html
    <mdw-hello-world [name]="who"></mdw-hello-world>
    ```

## Contributing

### Prerequisites

- Install [Node.js](https://nodejs.org/) which includes [Node Package Manager](https://docs.npmjs.com/getting-started). We recommend to use version 16 and above.

### Steps to Start

1. Clone this repo.

1. Install all dependencies via run command `npm install`.

1. Now, run `npm start` to start your work.

    - The component code should be placed to **src/components**. The new component should be structured as below:

      ```
      new-component
        ├─ index.ts                 // should export all public members
        ├─ new-component.ts         // the component code
        ├─ new-component.spec.ts    // unit tests
        ├─ new-component.types.ts   // all types definitions
        └─ new-component.plugins.ts // plugins of chart.js if need
      ```

    - The style file should be placed with component code and imported in **src/styles/main.scss**.

    - Also export the new component in **src/components/index.ts** file.

    - The internal folder dependency should be as below. That means we should not import anything from **core** folder into **types** folder or **components** into **core** folder.

      ```
      components ─⫸ core ─⫸ types
      ```

1. Commit your changes and push them to your forked repo, and submit a Pull Request to **main** branch.


### Styles Guides

- [Coding guidelines](https://google.github.io/styleguide/tsguide.html)

    - **Names**
        - Use `PascalCase` for type names.
        - Do not use `I` as a prefix for interface names.
        - Use `PascalCase` for enum values.
        - Use `camelCase` for function names.
        - Use `camelCase` for property names and local variables.
        - Do not use `_` as a prefix for private properties.
        - Use whole words in names when possible.
        - Use `CONSTANT_CASE` for the constants that is immutable.

- [Documentation Guide](https://typedoc.org/guides/overview/)


### Commit Message Guidelines

All commit message MUST follow [Angular Commit Message Format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit).

Format as:

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: <component-name>
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is optional.

### Useful Commands

- `npm run data` will print the random data which is predefined in **./tools/data.ts** and can be used to test your component. For example, `npm run data -- --pie --default --5`, `npm run data -- --number --10` to get 10 random numbers.
